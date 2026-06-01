import pandas as pd
import requests
from io import BytesIO

urls = {
    "q510": "https://docs.google.com/spreadsheets/d/19Z3iRQ9kZ8WIDQveBIyI-QjbOEFFWmqTFeUKZTMjVHI/export?format=xlsx",
    "ql08": "https://docs.google.com/spreadsheets/d/1hYwhMkInKruMHxJqmBci43N8F6Rg4Kg6-7DKM1-ESLM/export?format=xlsx",
    "qi7": "https://docs.google.com/spreadsheets/d/16RsoF0-Q3XsW2QO65qI5f4L-LbZahEDOls1ammS4CEY/export?format=xlsx"
}

def sync_all_imoveis():
    imoveis = []
    for k, v in urls.items():
        try:
            imovel = parse_imovel(k, v)
            if imovel:
                imoveis.append(imovel)
        except Exception as e:
            print(f"Error parsing {k}: {e}")
    return imoveis

def parse_imovel(imovel_id, url):
    resp = requests.get(url)
    xl = pd.ExcelFile(BytesIO(resp.content))
    summary_df = xl.parse(xl.sheet_names[0], header=None)
    
    nome = xl.sheet_names[0]
    vgv = 0
    sinal = 0
    saldo_restante = 0
    
    for _, row in summary_df.iterrows():
        col0 = str(row[0]).strip() if pd.notnull(row[0]) else ""
        if "Valor Total do Imóvel" in col0:
            vgv = float(str(row[1]).replace('R$', '').replace('.', '').replace(',', '.').strip())
        elif "Sinal" in col0:
            sinal = float(str(row[1]).replace('R$', '').replace('.', '').replace(',', '.').strip())
        elif "Saldo Restante" in col0:
            saldo_restante = float(str(row[1]).replace('R$', '').replace('.', '').replace(',', '.').strip())

    compradores = []
    
    def normalize_vendedor(nome):
        n = nome.upper()
        if "RAFAEL" in n: return "Rafael Barbosa Roda Figueiredo"
        if "CAROLINA" in n: return "Carolina Meirelles Ferreira"
        if "TARIK" in n or "TÁRIK" in n: return "Tárik Faraj Vieira"
        if "LUCIANA" in n: return "Luciana Carminati Zomer"
        return nome.title()

    def normalize_comprador(nome):
        n = nome.upper()
        if "ATIVUS" in n: return "ATIVUS Participações S.A."
        if "GIBRALTAR" in n: return "Gibraltar Investimentos Imobiliários"
        return nome.title()
    
    for sheet in xl.sheet_names[1:]:
        comprador_nome = normalize_comprador(sheet.strip())
        df = xl.parse(sheet, header=None)
        
        vendedores = []
        for r in range(df.shape[0]):
            for c in range(df.shape[1]):
                cell = str(df.iloc[r, c]).strip()
                if "PAGAMENTOS" in cell.upper() and "→" in cell:
                    parts = cell.split("→")
                    if len(parts) == 2:
                        vend_nome = normalize_vendedor(parts[1].strip())
                        valor_acordado = 0
                        pagamentos = []
                        total_recebido = 0
                        
                        for rr in range(r+1, min(r+25, df.shape[0])):
                            desc = str(df.iloc[rr, c]).strip()
                            val_cell = None
                            for offset in range(1, 4):
                                if c+offset < df.shape[1]:
                                    try:
                                        val = float(df.iloc[rr, c+offset])
                                        if pd.notnull(val):
                                            val_cell = val
                                            break
                                    except:
                                        pass
                            
                            if val_cell is None:
                                val_cell = 0
                            
                            if desc.upper() == "SALDO RESTANTE" or desc.upper().startswith("RESUMO") or desc.upper().startswith("VENDEDOR") or desc.upper().startswith("TOTAL PAGO"):
                                break
                                
                            if desc.upper().startswith("VALOR ACORDADO"):
                                try:
                                    valor_acordado = float(val_cell)
                                except:
                                    pass
                            elif desc and desc != "nan" and desc.upper() != "DATA / DESCRIÇÃO" and desc.upper() != "SALDO RESTANTE" and not desc.upper().startswith("RESUMO"):
                                try:
                                    val = float(val_cell)
                                    if pd.notnull(val) and val != 0:
                                        val = abs(val)
                                        data_str = desc.split(" ")[0] if " " in desc else desc
                                        desc_str = " ".join(desc.split(" ")[1:]) if " " in desc else "Pagamento"
                                        if desc_str == "00:00:00" or desc_str.strip() == "":
                                            desc_str = "Pagamento"
                                        
                                        pagamentos.append({
                                            "data": data_str,
                                            "descricao": desc_str.strip(),
                                            "valor": val,
                                            "comprador": comprador_nome,
                                            "vendedor": vend_nome
                                        })
                                        total_recebido += val
                                except Exception as e:
                                    pass
                                    
                        vendedores.append({
                            "nome": vend_nome,
                            "valor_acordado": valor_acordado,
                            "total_recebido": total_recebido,
                            "saldo_restante": valor_acordado - total_recebido,
                            "pagamentos": pagamentos
                        })
        
        if vendedores:
            valor_total_comp = sum(v["valor_acordado"] for v in vendedores)
            total_pago_comp = sum(v["total_recebido"] for v in vendedores)
            compradores.append({
                "nome": comprador_nome,
                "percentual": round((valor_total_comp / vgv) * 100) if vgv else 0,
                "valor_total": valor_total_comp,
                "total_pago": total_pago_comp,
                "saldo": valor_total_comp - total_pago_comp,
                "vendedores": vendedores
            })
            
    prop_metadata = {
        "q510": {"nome": "SCRS 510", "endereco": "SCRS 510, Bloco A", "bairro": "Asa Sul"},
        "ql08": {"nome": "QL 08", "endereco": "SHIS QL 08, Casa 01", "bairro": "Lago Sul"},
        "qi7": {"nome": "QI 7", "endereco": "SHIS QI 7, Conjunto 13, Nº 24", "bairro": "Lago Sul"}
    }
    
    return {
        "id": imovel_id,
        "nome": prop_metadata.get(imovel_id, {}).get("nome", nome),
        "endereco": prop_metadata.get(imovel_id, {}).get("endereco", ""),
        "bairro": prop_metadata.get(imovel_id, {}).get("bairro", ""),
        "vgv": vgv,
        "sinal": sinal,
        "saldo_restante": saldo_restante,
        "total_recebido": sum(c["total_pago"] for c in compradores),
        "compradores": compradores
    }
