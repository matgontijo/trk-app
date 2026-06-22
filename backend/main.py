from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

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
# DADOS — extraídos diretamente das planilhas
# ─────────────────────────────────────────────
from sync import sync_all_imoveis
import threading
import time

IMOVEIS: List[Imovel] = []
LAST_SYNC_TIME = 0

def auto_sync_worker():
    global IMOVEIS, LAST_SYNC_TIME
    while True:
        time.sleep(60) # 1 minuto
        try:
            print("Auto-sync: Atualizando planilhas em background...")
            raw_data = sync_all_imoveis()
            IMOVEIS = [Imovel(**i) for i in raw_data]
            LAST_SYNC_TIME = time.time()
            print("Auto-sync: Sincronizado com sucesso.")
        except Exception as e:
            print(f"Auto-sync erro: {e}")

@app.on_event("startup")
def startup_event():
    global IMOVEIS, LAST_SYNC_TIME
    try:
        print("Baixando dados das planilhas do Google Sheets...")
        raw_data = sync_all_imoveis()
        IMOVEIS = [Imovel(**i) for i in raw_data]
        LAST_SYNC_TIME = time.time()
        print("Planilhas sincronizadas com sucesso no startup!")
    except Exception as e:
        print(f"Erro ao sincronizar planilhas no startup: {e}")
        
    t = threading.Thread(target=auto_sync_worker, daemon=True)
    t.start()

@app.get("/api/sync")
def sync_data():
    global IMOVEIS, LAST_SYNC_TIME
    try:
        raw_data = sync_all_imoveis()
        IMOVEIS = [Imovel(**i) for i in raw_data]
        LAST_SYNC_TIME = time.time()
        return {"status": "ok", "message": "Dados atualizados das planilhas com sucesso!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "app": "TRK Imóveis API"}

@app.get("/api/consolidado", response_model=Consolidado)
def get_consolidado():
    vgv_total = sum(i.vgv for i in IMOVEIS)
    total_recebido = sum(i.total_recebido for i in IMOVEIS)
    saldo_total = vgv_total - total_recebido
    total_pgtos = sum(
        len(v.pagamentos)
        for i in IMOVEIS
        for c in i.compradores
        for v in c.vendedores
    )
    return Consolidado(
        vgv_total=vgv_total,
        total_recebido=total_recebido,
        saldo_total=saldo_total,
        total_pagamentos=total_pgtos,
        imoveis=IMOVEIS,
    )

@app.get("/api/imoveis", response_model=List[Imovel])
def get_imoveis():
    return IMOVEIS

@app.get("/api/imoveis/{imovel_id}", response_model=Imovel)
def get_imovel(imovel_id: str):
    for i in IMOVEIS:
        if i.id == imovel_id:
            return i
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Imóvel não encontrado")

@app.get("/api/pagamentos")
def get_todos_pagamentos():
    resultado = []
    for imovel in IMOVEIS:
        for comprador in imovel.compradores:
            for vendedor in comprador.vendedores:
                for pgto in vendedor.pagamentos:
                    resultado.append({
                        "imovel_id": imovel.id,
                        "imovel_nome": imovel.nome,
                        "imovel_bairro": imovel.bairro,
                        **pgto.dict()
                    })
    from datetime import datetime
    def _data_key(s):
        try:
            return datetime.strptime(s, "%d/%m/%Y")
        except (ValueError, TypeError):
            return datetime.min
    resultado.sort(key=lambda x: _data_key(x["data"]))
    return resultado

@app.get("/api/vendedores")
def get_vendedores():
    vendedores: dict = {}
    for imovel in IMOVEIS:
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

@app.get("/api/status")
def get_status():
    from datetime import datetime
    global LAST_SYNC_TIME
    
    last_upd = LAST_SYNC_TIME
    
    configs = [
        {"id": "qi7", "nome": "QI 7", "sheet": "16RsoF0-Q3XsW2QO65qI5f4L-LbZahEDOls1ammS4CEY"},
        {"id": "q510", "nome": "SCRS 510", "sheet": "19Z3iRQ9kZ8WIDQveBIyI-QjbOEFFWmqTFeUKZTMjVHI"},
        {"id": "ql08", "nome": "QL 08", "sheet": "1hYwhMkInKruMHxJqmBci43N8F6Rg4Kg6-7DKM1-ESLM"},
        {"id": "scl403", "nome": "SCL 403", "sheet": "16Tu9JYtr-os8qc2WGTRAvrPd4642apQV_YShOg2-s1k"},
    ]
    
    status_list = []
    for c in configs:
        status_list.append({
            "id": c["id"],
            "nome": c["nome"],
            "sheet_id": c["sheet"],
            "sheet_url": f"https://docs.google.com/spreadsheets/d/{c['sheet']}/edit",
            "status": "Conectado" if last_upd > 0 else "Aguardando Sincronização",
            "last_sync": datetime.fromtimestamp(last_upd).strftime("%d/%m/%Y %H:%M:%S") if last_upd > 0 else "Nunca"
        })
        
    return {"connections": status_list, "cache_timestamp": last_upd}

