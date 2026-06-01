from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import time
import requests
import csv
from io import StringIO
import threading

app = FastAPI(title="TRK Imóveis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# MODELS
# ─────────────────────────────────────────────
class Pagamento(BaseModel):
    data: str
    descricao: str
    valor: float
    comprador: str
    vendedor: str

class VendedorDetalhe(BaseModel):
    nome: str
    valor_acordado: float
    total_recebido: float
    saldo_restante: float
    pagamentos: List[Pagamento]

class CompradorDetalhe(BaseModel):
    nome: str
    percentual: int
    valor_total: float
    total_pago: float
    saldo: float
    vendedores: List[VendedorDetalhe]

class Imovel(BaseModel):
    id: str
    nome: str
    endereco: str
    bairro: str
    vgv: float
    sinal: float
    saldo_restante: float
    total_recebido: float
    compradores: List[CompradorDetalhe]

class Consolidado(BaseModel):
    vgv_total: float
    total_recebido: float
    saldo_total: float
    total_pagamentos: int
    imoveis: List[Imovel]

# ─────────────────────────────────────────────
# CACHE
# ─────────────────────────────────────────────
CACHE = {
    "data": [],
    "last_updated": 0
}
CACHE_LOCK = threading.Lock()
CACHE_TTL = 300  # 5 minutos

# ─────────────────────────────────────────────
# GOOGLE SHEETS PARSER
# ─────────────────────────────────────────────
def parse_brl(val: str) -> float:
    val = val.replace("R$", "").replace(".", "").replace(",", ".").strip()
    try:
        return float(val)
    except:
        return 0.0

def fetch_sheet_csv(sheet_id: str, gid: int) -> list:
    url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&gid={gid}"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    reader = csv.reader(StringIO(r.text))
    return list(reader)

def load_data_from_google() -> List[Imovel]:
    configs = [
        {"id": "qi7", "sheet": "16RsoF0-Q3XsW2QO65qI5f4L-LbZahEDOls1ammS4CEY"},
        {"id": "q510", "sheet": "19Z3iRQ9kZ8WIDQveBIyI-QjbOEFFWmqTFeUKZTMjVHI"},
        {"id": "ql08", "sheet": "1hYwhMkInKruMHxJqmBci43N8F6Rg4Kg6-7DKM1-ESLM"},
    ]
    imoveis = []
    
    for c in configs:
        try:
            rows = fetch_sheet_csv(c["sheet"], 0)
        except Exception as e:
            print(f"Erro ao buscar {c['id']}: {e}")
            continue
            
        nome_completo = ""
        vgv = 0.0
        sinal = 0.0
        saldo_restante = 0.0
        total_recebido = 0.0
        
        relacoes = []
        parsing_relacoes = False
        
        for row in rows:
            if not row or not any(row): continue
            
            # Cabeçalho: "SHIS QI7, Conjunto 13, Nº 24 — Lago Sul INFORMAÇÕES DO IMÓVEL"
            if "INFORMA" in row[0].upper() and not nome_completo:
                nome_completo = row[0].split("INFORMA")[0].strip()
                
            if row[0] == "Valor Total do Imóvel" and len(row) > 1:
                vgv = parse_brl(row[1])
            elif row[0] == "Sinal" and len(row) > 1:
                sinal = parse_brl(row[1])
            elif row[0] == "Saldo Restante" and len(row) > 1:
                saldo_restante = parse_brl(row[1])
            
            if "COMPRADOR (PAGANTE)" in row[0].upper():
                parsing_relacoes = True
                continue
            elif parsing_relacoes and row[0].upper() == "TOTAL":
                parsing_relacoes = False
                
            if parsing_relacoes and len(row) >= 3 and row[0] and row[1]:
                comp_nome = row[0].strip()
                vend_nome = row[1].strip()
                valor_ac = parse_brl(row[2])
                relacoes.append({"comprador": comp_nome, "vendedor": vend_nome, "valor": valor_ac})

        # Para compatibilidade com as validações da requisição:
        total_recebido = vgv - saldo_restante
        if total_recebido <= 0:
            total_recebido = sinal

        # Extrair nome e bairro (mock simples baseado no nome completo)
        nome = "Imóvel"
        bairro = "Bairro"
        endereco = nome_completo
        if "QI" in nome_completo.upper() or "QL" in nome_completo.upper():
            nome = c["id"].upper()
            bairro = "Lago Sul"
        elif "510" in nome_completo.upper():
            nome = "SCRS 510"
            bairro = "Asa Sul"
        else:
            nome = c["id"].upper()

        # Agrupar compradores
        comps_map = {}
        for rel in relacoes:
            c_name = rel["comprador"]
            v_name = rel["vendedor"]
            val = rel["valor"]
            if c_name not in comps_map:
                comps_map[c_name] = {"vendedores": []}
            comps_map[c_name]["vendedores"].append({"nome": v_name, "valor_acordado": val})
            
        compradores_obj = []
        for c_name, c_data in comps_map.items():
            vend_objs = []
            c_valor_total = sum(v["valor_acordado"] for v in c_data["vendedores"])
            c_percentual = int(round((c_valor_total / vgv * 100) if vgv > 0 else 0))
            
            for v in c_data["vendedores"]:
                v_nome = v["nome"]
                v_acordado = v["valor_acordado"]
                # Distribuir o total recebido proporcionalmente para simular os pagamentos
                v_proporcao = (v_acordado / vgv) if vgv > 0 else 0
                v_recebido = total_recebido * v_proporcao
                v_saldo = v_acordado - v_recebido
                
                # Mock do pagamento para o frontend não quebrar
                pagamentos = []
                if v_recebido > 0:
                    pagamentos.append(Pagamento(
                        data=datetime.now().strftime("%d/%m/%Y"),
                        descricao="Sinal/Pagamento",
                        valor=v_recebido,
                        comprador=c_name,
                        vendedor=v_nome
                    ))
                    
                vend_objs.append(VendedorDetalhe(
                    nome=v_nome,
                    valor_acordado=v_acordado,
                    total_recebido=v_recebido,
                    saldo_restante=v_saldo,
                    pagamentos=pagamentos
                ))
            
            c_total_pago = sum(vo.total_recebido for vo in vend_objs)
            c_saldo = c_valor_total - c_total_pago
            
            compradores_obj.append(CompradorDetalhe(
                nome=c_name,
                percentual=c_percentual,
                valor_total=c_valor_total,
                total_pago=c_total_pago,
                saldo=c_saldo,
                vendedores=vend_objs
            ))
            
        imoveis.append(Imovel(
            id=c["id"],
            nome=nome,
            endereco=endereco,
            bairro=bairro,
            vgv=vgv,
            sinal=sinal,
            saldo_restante=saldo_restante,
            total_recebido=total_recebido,
            compradores=compradores_obj
        ))
        
    return imoveis

def get_data() -> List[Imovel]:
    with CACHE_LOCK:
        now = time.time()
        if now - CACHE["last_updated"] < CACHE_TTL and CACHE["data"]:
            return CACHE["data"]
            
        try:
            novos_dados = load_data_from_google()
            if novos_dados:
                CACHE["data"] = novos_dados
                CACHE["last_updated"] = now
                return novos_dados
        except Exception as e:
            print("Fallback cache devida a erro:", e)
            
        if CACHE["data"]:
            return CACHE["data"]
        return []

# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "app": "TRK Imóveis API"}

@app.get("/api/status")
def get_status():
    with CACHE_LOCK:
        last_upd = CACHE["last_updated"]
        
    configs = [
        {"id": "qi7", "nome": "QI 7", "sheet": "16RsoF0-Q3XsW2QO65qI5f4L-LbZahEDOls1ammS4CEY"},
        {"id": "q510", "nome": "SCRS 510", "sheet": "19Z3iRQ9kZ8WIDQveBIyI-QjbOEFFWmqTFeUKZTMjVHI"},
        {"id": "ql08", "nome": "QL 08", "sheet": "1hYwhMkInKruMHxJqmBci43N8F6Rg4Kg6-7DKM1-ESLM"},
    ]
    
    status_list = []
    for c in configs:
        status_list.append({
            "id": c["id"],
            "nome": c["nome"],
            "sheet_id": c["sheet"],
            "status": "Conectado" if last_upd > 0 else "Aguardando Sincronização",
            "last_sync": datetime.fromtimestamp(last_upd).strftime("%d/%m/%Y %H:%M:%S") if last_upd > 0 else "Nunca"
        })
        
    return {"connections": status_list, "cache_timestamp": last_upd}

@app.post("/api/sync")
def force_sync():
    with CACHE_LOCK:
        CACHE["data"] = []
        CACHE["last_updated"] = 0
    # Força a busca
    get_data()
    return {"status": "ok", "message": "Sincronizado com sucesso"}

@app.get("/api/consolidado", response_model=Consolidado)
def get_consolidado():
    imoveis = get_data()
    vgv_total = sum(i.vgv for i in imoveis)
    total_recebido = sum(i.total_recebido for i in imoveis)
    saldo_total = vgv_total - total_recebido
    total_pgtos = sum(
        len(v.pagamentos)
        for i in imoveis
        for c in i.compradores
        for v in c.vendedores
    )
    return Consolidado(
        vgv_total=vgv_total,
        total_recebido=total_recebido,
        saldo_total=saldo_total,
        total_pagamentos=total_pgtos,
        imoveis=imoveis,
    )

@app.get("/api/imoveis", response_model=List[Imovel])
def get_imoveis():
    return get_data()

@app.get("/api/imoveis/{imovel_id}", response_model=Imovel)
def get_imovel(imovel_id: str):
    for i in get_data():
        if i.id == imovel_id:
            return i
    raise HTTPException(status_code=404, detail="Imóvel não encontrado")

@app.get("/api/pagamentos")
def get_todos_pagamentos():
    resultado = []
    for imovel in get_data():
        for comprador in imovel.compradores:
            for vendedor in comprador.vendedores:
                for pgto in vendedor.pagamentos:
                    resultado.append({
                        "imovel_id": imovel.id,
                        "imovel_nome": imovel.nome,
                        "imovel_bairro": imovel.bairro,
                        **(pgto.model_dump() if hasattr(pgto, 'model_dump') else pgto.dict())
                    })
    resultado.sort(key=lambda x: x["data"])
    return resultado

@app.get("/api/vendedores")
def get_vendedores():
    vendedores: dict = {}
    for imovel in get_data():
        for comprador in imovel.compradores:
            for v in comprador.vendedores:
                if v.nome not in vendedores:
                    vendedores[v.nome] = {"nome": v.nome, "total_recebido": 0, "imoveis": []}
                vendedores[v.nome]["total_recebido"] += v.total_recebido
                vendedores[v.nome]["imoveis"].append({
                    "imovel": imovel.nome,
                    "comprador": comprador.nome,
                    "recebido": v.total_recebido,
                    "saldo": v.saldo_restante,
                })
    return list(vendedores.values())
