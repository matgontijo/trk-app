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
IMOVEIS: List[Imovel] = [

    # ── QI 7 ──────────────────────────────────────────────────────────────
    Imovel(
        id="qi7",
        nome="QI 7",
        endereco="SHIS QI 7, Conjunto 13, Nº 24",
        bairro="Lago Sul",
        vgv=4_000_000,
        sinal=100_000,
        saldo_restante=3_900_000,
        total_recebido=100_000,
        compradores=[
            CompradorDetalhe(
                nome="ATIVUS Participações S/A",
                percentual=30,
                valor_total=1_200_000,
                total_pago=30_000,
                saldo=1_170_000,
                vendedores=[
                    VendedorDetalhe(
                        nome="Luciana Carminati Zomer",
                        valor_acordado=1_200_000,
                        total_recebido=30_000,
                        saldo_restante=1_170_000,
                        pagamentos=[
                            Pagamento(data="02/03/2026", descricao="Sinal", valor=30_000,
                                      comprador="ATIVUS Participações S/A",
                                      vendedor="Luciana Carminati Zomer"),
                        ]
                    )
                ]
            ),
            CompradorDetalhe(
                nome="Gibraltar Investimentos Imobiliários",
                percentual=70,
                valor_total=2_800_000,
                total_pago=70_000,
                saldo=2_730_000,
                vendedores=[
                    VendedorDetalhe(
                        nome="Tarik Faraj Vieira",
                        valor_acordado=2_800_000,
                        total_recebido=70_000,
                        saldo_restante=2_730_000,
                        pagamentos=[
                            Pagamento(data="02/03/2026", descricao="Sinal", valor=70_000,
                                      comprador="Gibraltar Investimentos Imobiliários",
                                      vendedor="Tarik Faraj Vieira"),
                        ]
                    )
                ]
            ),
        ]
    ),

    # ── 510 ───────────────────────────────────────────────────────────────
    Imovel(
        id="q510",
        nome="SCRS 510",
        endereco="SCRS 510, Bloco A",
        bairro="Asa Sul",
        vgv=1_900_000,
        sinal=200_000,
        saldo_restante=1_700_000,
        total_recebido=246_000,
        compradores=[
            CompradorDetalhe(
                nome="ATIVUS Participações S.A.",
                percentual=50,
                valor_total=950_000,
                total_pago=146_000,
                saldo=804_000,
                vendedores=[
                    VendedorDetalhe(
                        nome="Rafael Barbosa Roda Figueiredo",
                        valor_acordado=2_175_000,
                        total_recebido=96_000,
                        saldo_restante=2_079_000,
                        pagamentos=[
                            Pagamento(data="10/02/2026", descricao="Sinal", valor=50_000,
                                      comprador="ATIVUS Participações S.A.",
                                      vendedor="Rafael Barbosa Roda Figueiredo"),
                            Pagamento(data="02/03/2026", descricao="Pagamento", valor=16_000,
                                      comprador="ATIVUS Participações S.A.",
                                      vendedor="Rafael Barbosa Roda Figueiredo"),
                            Pagamento(data="20/05/2026", descricao="Pagamento", valor=30_000,
                                      comprador="ATIVUS Participações S.A.",
                                      vendedor="Rafael Barbosa Roda Figueiredo"),
                        ]
                    ),
                    VendedorDetalhe(
                        nome="Tárik Faraj Vieira",
                        valor_acordado=2_175_000,
                        total_recebido=50_000,
                        saldo_restante=2_125_000,
                        pagamentos=[
                            Pagamento(data="10/02/2026", descricao="Sinal", valor=50_000,
                                      comprador="ATIVUS Participações S.A.",
                                      vendedor="Tárik Faraj Vieira"),
                        ]
                    ),
                ]
            ),
            CompradorDetalhe(
                nome="Gibraltar Investimentos Imobiliários",
                percentual=50,
                valor_total=950_000,
                total_pago=100_000,
                saldo=850_000,
                vendedores=[
                    VendedorDetalhe(
                        nome="Rafael Barbosa Roda Figueiredo",
                        valor_acordado=2_175_000,
                        total_recebido=50_000,
                        saldo_restante=2_125_000,
                        pagamentos=[
                            Pagamento(data="11/02/2026", descricao="Sinal", valor=50_000,
                                      comprador="Gibraltar Investimentos Imobiliários",
                                      vendedor="Rafael Barbosa Roda Figueiredo"),
                        ]
                    ),
                    VendedorDetalhe(
                        nome="Carolina Meirelles Ferreira",
                        valor_acordado=2_175_000,
                        total_recebido=50_000,
                        saldo_restante=2_125_000,
                        pagamentos=[
                            Pagamento(data="11/02/2026", descricao="Sinal", valor=50_000,
                                      comprador="Gibraltar Investimentos Imobiliários",
                                      vendedor="Carolina Meirelles Ferreira"),
                        ]
                    ),
                ]
            ),
        ]
    ),

    # ── QL 08 ─────────────────────────────────────────────────────────────
    Imovel(
        id="ql08",
        nome="QL 08",
        endereco="SHIS QL 08, Casa 01",
        bairro="Lago Sul",
        vgv=8_700_000,
        sinal=200_000,
        saldo_restante=8_500_000,
        total_recebido=210_000,
        compradores=[
            CompradorDetalhe(
                nome="ATIVUS Participações S.A.",
                percentual=50,
                valor_total=4_350_000,
                total_pago=110_000,
                saldo=4_240_000,
                vendedores=[
                    VendedorDetalhe(
                        nome="Rafael Barbosa Roda Figueiredo",
                        valor_acordado=2_175_000,
                        total_recebido=60_000,
                        saldo_restante=2_115_000,
                        pagamentos=[
                            Pagamento(data="10/02/2026", descricao="Sinal", valor=50_000,
                                      comprador="ATIVUS Participações S.A.",
                                      vendedor="Rafael Barbosa Roda Figueiredo"),
                            Pagamento(data="20/04/2026", descricao="Pagamento", valor=10_000,
                                      comprador="ATIVUS Participações S.A.",
                                      vendedor="Rafael Barbosa Roda Figueiredo"),
                        ]
                    ),
                    VendedorDetalhe(
                        nome="Carolina Meirelles Ferreira",
                        valor_acordado=2_175_000,
                        total_recebido=50_000,
                        saldo_restante=2_125_000,
                        pagamentos=[
                            Pagamento(data="10/02/2026", descricao="Sinal", valor=50_000,
                                      comprador="ATIVUS Participações S.A.",
                                      vendedor="Carolina Meirelles Ferreira"),
                        ]
                    ),
                ]
            ),
            CompradorDetalhe(
                nome="Gibraltar Investimentos Imobiliários",
                percentual=50,
                valor_total=4_350_000,
                total_pago=100_000,
                saldo=4_250_000,
                vendedores=[
                    VendedorDetalhe(
                        nome="Rafael Barbosa Roda Figueiredo",
                        valor_acordado=2_175_000,
                        total_recebido=50_000,
                        saldo_restante=2_125_000,
                        pagamentos=[
                            Pagamento(data="11/02/2026", descricao="Sinal", valor=50_000,
                                      comprador="Gibraltar Investimentos Imobiliários",
                                      vendedor="Rafael Barbosa Roda Figueiredo"),
                        ]
                    ),
                    VendedorDetalhe(
                        nome="Carolina Meirelles Ferreira",
                        valor_acordado=2_175_000,
                        total_recebido=50_000,
                        saldo_restante=2_125_000,
                        pagamentos=[
                            Pagamento(data="11/02/2026", descricao="Sinal", valor=50_000,
                                      comprador="Gibraltar Investimentos Imobiliários",
                                      vendedor="Carolina Meirelles Ferreira"),
                        ]
                    ),
                ]
            ),
        ]
    ),
]

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
    resultado.sort(key=lambda x: x["data"])
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
