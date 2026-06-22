import { api } from "@/lib/api";
import { brl, pct } from "@/lib/fmt";
import { KpiCard, SectionHead, VendedorCard, AnimateIn } from "@/components/ui";
import { PagamentosTable } from "@/components/ui";
import Link from "next/link";
import type { PagamentoFlat } from "@/lib/api";

interface Props { params: Promise<{ id: string }> }

export default async function ImovelPage(props: Props) {
  const params = await props.params;
  const im = await api.imovel(params.id);
  const todosP = await api.pagamentos();
  const pgtos: PagamentoFlat[] = todosP.filter((p) => p.imovel_id === params.id);

  const p = pct(im.total_recebido, im.vgv);

  const tabs = [
    { id: "qi7", label: "QI 7" },
    { id: "q510", label: "SCRS 510" },
    { id: "ql08", label: "QL 08" },
    { id: "scl403", label: "SCL 403" },
  ];

  return (
    <div className="mb-20">
      {/* Premium Tabs Navigator */}
      <AnimateIn delay={0.1}>
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 hide-scrollbar">
          {tabs.map(t => (
            <Link key={t.id} href={`/imovel/${t.id}`}
                  className={`flex-none px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${t.id === params.id ? 'bg-zinc-900 text-white shadow-md' : 'bg-white text-zinc-400 border border-zinc-100 hover:border-zinc-300'}`}>
              {t.label}
            </Link>
          ))}
        </div>
      </AnimateIn>

      <AnimateIn delay={0.2}>
        <div className="mb-8 md:mb-12 relative">
          <div className="absolute -top-10 -left-4 w-32 h-32 bg-emerald-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-60"></div>
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-4xl md:text-5xl font-light text-zinc-900 tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {im.nome}
            </h1>
            <span className="text-[10px] md:text-xs font-semibold text-zinc-400 tracking-widest uppercase bg-zinc-50 px-2 py-1 rounded-full">{im.bairro}</span>
          </div>
          <p className="text-xs text-zinc-400">{im.endereco}</p>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.3}>
        <SectionHead title="Indicadores" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
          <KpiCard label="Valor do Imóvel" value={brl(im.vgv)} />
          <KpiCard label="Total Recebido" value={brl(im.total_recebido)} sub={`${p}% do VGV`} variant="green" />
          <KpiCard label="Saldo a Receber" value={brl(im.saldo_restante)} variant="red" />
          <KpiCard label="Pagamentos" value={pgtos.length} sub="realizados" />
        </div>
      </AnimateIn>

      {/* Compradores */}
      <AnimateIn delay={0.4}>
        {im.compradores.map((comp) => {
          const isAtivus = comp.nome.toLowerCase().includes("ativus");
          return (
            <div key={comp.nome} className="mb-12">
              <SectionHead
                title={`${comp.nome} — ${comp.percentual}%`}
                right={
                  <span className={`inline-block px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full ${isAtivus ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>
                    {brl(comp.valor_total)} total · {brl(comp.saldo)} pendente
                  </span>
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comp.vendedores.map((v) => (
                  <VendedorCard key={v.nome} v={v} comprador={comp.nome} />
                ))}
              </div>
            </div>
          );
        })}
      </AnimateIn>

      {/* Pagamentos */}
      <AnimateIn delay={0.5}>
        <SectionHead title="Pagamentos Realizados" />
        <PagamentosTable rows={pgtos} showImovel={false} />
      </AnimateIn>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ id: "qi7" }, { id: "q510" }, { id: "ql08" }, { id: "scl403" }];
}
