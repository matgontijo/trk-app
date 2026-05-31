import { api } from "@/lib/api";
import { brl, pct } from "@/lib/fmt";
import { KpiCard, SectionHead, ProgressBar } from "@/components/ui";
import Link from "next/link";
import { OverviewCharts } from "@/components/overview-charts";

export default async function Home() {
  const data = await api.consolidado();
  const pagamentos = await api.pagamentos();
  const vendedores = await api.vendedores();

  const vgvData = data.imoveis.map((i) => ({
    nome: i.nome,
    vgv: i.vgv,
    recebido: i.total_recebido,
    saldo: i.saldo_restante,
  }));

  const vendedorData = vendedores
    .sort((a, b) => b.total_recebido - a.total_recebido)
    .map((v) => ({
      nome: v.nome.split(" ")[0],
      recebido: v.total_recebido,
    }));

  const ativusTotal = data.imoveis.reduce((acc, im) => {
    const c = im.compradores.find((c) => c.nome.toLowerCase().includes("ativus"));
    return acc + (c?.total_pago || 0);
  }, 0);
  const gibraltarTotal = data.imoveis.reduce((acc, im) => {
    const c = im.compradores.find((c) => c.nome.toLowerCase().includes("gibraltar"));
    return acc + (c?.total_pago || 0);
  }, 0);

  return (
    <div>
      {/* Page title */}
      <div className="mb-10">
        <h1 className="text-4xl font-light text-zinc-900 tracking-tight mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Painel Executivo
        </h1>
        <p className="text-sm text-zinc-400 tracking-wide">
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPIs */}
      <SectionHead title="Consolidado — 3 Imóveis" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-zinc-200 border border-zinc-200 mb-10">
        <KpiCard label="VGV Total" value={brl(data.vgv_total)} sub="3 imóveis" />
        <KpiCard label="Recebido" value={brl(data.total_recebido)} sub={`${pct(data.total_recebido, data.vgv_total)}% do VGV`} variant="green" />
        <KpiCard label="Saldo em Aberto" value={brl(data.saldo_total)} variant="red" />
        <KpiCard label="Imóveis" value={data.imoveis.length} sub="Lago Sul · Asa Sul" />
        <KpiCard label="Compradores" value="2" sub="Ativus · Gibraltar" />
        <KpiCard label="Pagamentos" value={data.total_pagamentos} sub="realizados" />
      </div>

      {/* Cards por imóvel */}
      <SectionHead title="Por Imóvel" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 mb-10">
        {data.imoveis.map((im) => (
          <Link key={im.id} href={`/imovel/${im.id}`}
            className="bg-white p-6 hover:bg-zinc-50 transition-colors group block">
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-xl font-light text-zinc-900 group-hover:text-zinc-700"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {im.nome}
              </h2>
              <span className="text-[10px] text-zinc-400 tracking-widest uppercase mt-1">{im.bairro}</span>
            </div>
            <p className="text-xs text-zinc-400 mb-5">{im.endereco}</p>

            <div className="space-y-2">
              {[
                { label: "VGV", value: brl(im.vgv), cls: "text-zinc-900" },
                { label: "Recebido", value: brl(im.total_recebido), cls: "text-emerald-600" },
                { label: "Saldo", value: brl(im.saldo_restante), cls: "text-red-500" },
              ].map(({ label, value, cls }) => (
                <div key={label} className="flex justify-between text-xs border-b border-zinc-100 pb-2">
                  <span className="text-zinc-500">{label}</span>
                  <span className={`font-semibold ${cls}`}>{value}</span>
                </div>
              ))}
            </div>

            <ProgressBar pago={im.total_recebido} total={im.vgv} />
            <p className="text-[10px] text-zinc-400 mt-3 group-hover:text-zinc-600 tracking-wider">
              Ver detalhes →
            </p>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <OverviewCharts vgvData={vgvData} vendedorData={vendedorData} ativus={ativusTotal} gibraltar={gibraltarTotal} />

      {/* Últimos pagamentos */}
      <SectionHead title="Últimos Pagamentos" right={
        <Link href="/pagamentos" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
          Ver todos →
        </Link>
      } />
      <div className="overflow-x-auto border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              {["Imóvel", "Data", "Comprador", "Vendedor", "Descrição", "Valor"].map((h) => (
                <th key={h} className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 ${h === "Valor" ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagamentos.slice(-8).reverse().map((r, i) => {
              const isAtivus = r.comprador.toLowerCase().includes("ativus");
              return (
                <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-900">{r.imovel_nome}</td>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{r.data}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm ${isAtivus ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                      {isAtivus ? "Ativus" : "Gibraltar"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{r.vendedor}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{r.descricao}</td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600">{brl(r.valor)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
