const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Pagamento {
  data: string;
  descricao: string;
  valor: number;
  comprador: string;
  vendedor: string;
}

export interface VendedorDetalhe {
  nome: string;
  valor_acordado: number;
  total_recebido: number;
  saldo_restante: number;
  pagamentos: Pagamento[];
}

export interface CompradorDetalhe {
  nome: string;
  percentual: number;
  valor_total: number;
  total_pago: number;
  saldo: number;
  vendedores: VendedorDetalhe[];
}

export interface Imovel {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  vgv: number;
  sinal: number;
  saldo_restante: number;
  total_recebido: number;
  compradores: CompradorDetalhe[];
}

export interface Consolidado {
  vgv_total: number;
  total_recebido: number;
  saldo_total: number;
  total_pagamentos: number;
  imoveis: Imovel[];
}

export interface PagamentoFlat extends Pagamento {
  imovel_id: string;
  imovel_nome: string;
  imovel_bairro: string;
}

export interface VendedorResumo {
  nome: string;
  total_recebido: number;
  imoveis: { imovel: string; comprador: string; recebido: number; saldo: number }[];
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  consolidado: () => get<Consolidado>("/api/consolidado"),
  imoveis: () => get<Imovel[]>("/api/imoveis"),
  imovel: (id: string) => get<Imovel>(`/api/imoveis/${id}`),
  pagamentos: () => get<PagamentoFlat[]>("/api/pagamentos"),
  vendedores: () => get<VendedorResumo[]>("/api/vendedores"),
};
