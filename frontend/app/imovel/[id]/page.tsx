import { api } from "@/lib/api";
import { brl, pct } from "@/lib/fmt";
import { KpiCard, SectionHead, VendedorCard } from "@/components/ui";
import { PagamentosTable } from "@/components/ui";
import type { PagamentoFlat } from "@/lib/api";

interface Props { params: { id: string } }

export default async function ImovelPage({ params }: Props) {
  const im = await api.imovel(params.id);
  const todosP = await api.pagamentos();
  const pgtos: PagamentoFlat[] = todosP.filter((p) => p.imovel_id === params.id);

  const p = pct(im.total_recebido, im.vgv);

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-1">
          <h1 className="text-4xl font-light text-zinc-900 tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {im.nome}
          </h1>
          <span className="text-sm text-zinc-400 tracking-widest uppercase">{im.bairro}</span>
        </div>
        <p className="text-sm text-zinc-400">{im.endereco}</p>
      </div>

      <SectionHead title="Indicadores" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200 mb-10">
        <KpiCard label="Valor do Imóvel" value={brl(im.vgv)} />
        <KpiCard label="Total Recebido" value={brl(im.total_recebido)} sub={`${p}% do VGV`} variant="green" />
        <KpiCard label="Saldo a Receber" value={brl(im.saldo_restante)} variant="red" />
        <KpiCard label="Pagamentos" value={pgtos.length} sub="realizados" />
      </div>

      {/* Compradores */}
      {im.compradores.map((comp) => {
        const isAtivus = comp.nome.toLowerCase().includes("ativus");
        return (
          <div key={comp.nome} className="mb-10">
            <SectionHead
              title={`${comp.nome} — ${comp.percentual}%`}
              right={
                <span className={`inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-sm border ${isAtivus ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                  {brl(comp.valor_total)} acordado · {brl(comp.total_pago)} pago · {brl(comp.saldo)} saldo
                </span>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {comp.vendedores.map((v) => (
                <VendedorCard key={v.nome} v={v} comprador={comp.nome} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Pagamentos */}
      <SectionHead title="Pagamentos Realizados" />
      <PagamentosTable rows={pgtos} showImovel={false} />
    </div>
  );
}

export async function generateStaticParams() {
  return [{ id: "qi7" }, { id: "q510" }, { id: "ql08" }];
}
