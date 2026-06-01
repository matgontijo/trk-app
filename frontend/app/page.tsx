import { api } from "@/lib/api";
import { brl, pct } from "@/lib/fmt";
import { KpiCard, SectionHead, ProgressBar, AnimateIn } from "@/components/ui";
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
      {/* Page title - Premium feel */}
      <AnimateIn delay={0.1}>
        <div className="mb-8 md:mb-12 relative">
          <div className="absolute -top-10 -left-4 w-40 h-40 bg-zinc-200/50 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-60"></div>
          <h1 className="text-3xl md:text-5xl font-light text-zinc-900 tracking-tight mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Painel Executivo
          </h1>
          <p className="text-[11px] md:text-sm text-zinc-400 tracking-wide font-medium">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </AnimateIn>

      {/* KPIs */}
      <AnimateIn delay={0.2}>
        <SectionHead title="Consolidado — 3 Imóveis" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-10">
          <KpiCard label="VGV Total" value={brl(data.vgv_total)} sub="3 imóveis" />
          <KpiCard label="Recebido" value={brl(data.total_recebido)} sub={`${pct(data.total_recebido, data.vgv_total)}% do VGV`} variant="green" />
          <KpiCard label="Saldo em Aberto" value={brl(data.saldo_total)} variant="red" />
          <KpiCard label="Imóveis" value={data.imoveis.length} sub="Lago Sul · Asa Sul" />
          <KpiCard label="Compradores" value="2" sub="Ativus · Gibraltar" />
          <KpiCard label="Pagamentos" value={data.total_pagamentos} sub="realizados" />
        </div>
      </AnimateIn>

      {/* Cards por imóvel */}
      <AnimateIn delay={0.3}>
        <SectionHead title="Por Imóvel" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {data.imoveis.map((im) => (
            <Link key={im.id} href={`/imovel/${im.id}`}
              className="bg-white p-5 md:p-6 rounded-3xl border border-zinc-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group block">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl font-light text-zinc-900 group-hover:text-zinc-700 transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {im.nome}
                </h2>
                <span className="text-[9px] font-semibold text-zinc-400 tracking-widest uppercase mt-2 bg-zinc-50 px-2 py-1 rounded-full">{im.bairro}</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6">{im.endereco}</p>

              <div className="space-y-3 mb-6">
                {[
                  { label: "VGV", value: brl(im.vgv), cls: "text-zinc-900" },
                  { label: "Recebido", value: brl(im.total_recebido), cls: "text-emerald-600" },
                  { label: "Saldo", value: brl(im.saldo_restante), cls: "text-red-500" },
                ].map(({ label, value, cls }) => (
                  <div key={label} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 uppercase tracking-wider text-[10px] font-medium">{label}</span>
                    <span className={`font-semibold ${cls} text-sm`}>{value}</span>
                  </div>
                ))}
              </div>

              <ProgressBar pago={im.total_recebido} total={im.vgv} />
              <div className="mt-4 flex justify-end">
                <span className="text-[10px] uppercase font-semibold text-zinc-400 group-hover:text-zinc-800 transition-colors tracking-widest">
                  Ver detalhes →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </AnimateIn>

      {/* Charts */}
      <AnimateIn delay={0.4}>
        <OverviewCharts vgvData={vgvData} vendedorData={vendedorData} ativus={ativusTotal} gibraltar={gibraltarTotal} />
      </AnimateIn>

      {/* Últimos pagamentos */}
      <AnimateIn delay={0.5} className="mb-20">
        <SectionHead title="Últimos Pagamentos" right={
          <Link href="/pagamentos" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
            Ver todos →
          </Link>
        } />
        <div className="overflow-x-auto bg-white rounded-3xl border border-zinc-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                {["Imóvel", "Data", "Comprador", "Vendedor", "Descrição", "Valor"].map((h) => (
                  <th key={h} className={`px-5 py-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 ${h === "Valor" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagamentos.slice(-8).reverse().map((r, i) => {
                const isAtivus = r.comprador.toLowerCase().includes("ativus");
                return (
                  <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors">
                    <td className="px-5 py-4 font-medium text-zinc-900">{r.imovel_nome}</td>
                    <td className="px-5 py-4 text-zinc-400 text-xs whitespace-nowrap">{r.data}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full ${isAtivus ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>
                        {isAtivus ? "Ativus" : "Gibraltar"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-600 font-medium">{r.vendedor}</td>
                    <td className="px-5 py-4 text-zinc-400 text-xs">{r.descricao}</td>
                    <td className="px-5 py-4 text-right font-semibold text-emerald-600">{brl(r.valor)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AnimateIn>
    </div>
  );
}
