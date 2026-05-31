import { api } from "@/lib/api";
import { brl, pct } from "@/lib/fmt";
import { SectionHead, KpiCard } from "@/components/ui";

export default async function VendedoresPage() {
  const vendedores = await api.vendedores();
  const totalRecebido = vendedores.reduce((a, v) => a + v.total_recebido, 0);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-light text-zinc-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Vendedores
        </h1>
        <p className="text-sm text-zinc-400">Recebido consolidado por vendedor</p>
      </div>

      <SectionHead title="Recebido por Vendedor" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200 mb-10">
        {vendedores.sort((a,b) => b.total_recebido - a.total_recebido).map((v) => (
          <KpiCard
            key={v.nome}
            label={v.nome.split(" ")[0]}
            value={brl(v.total_recebido)}
            sub={`${v.imoveis.length} imóvel(is)`}
            variant="default"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendedores.map((v) => (
          <div key={v.nome} className="bg-white border border-zinc-200 p-6">
            <h2 className="text-lg font-light text-zinc-900 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {v.nome}
            </h2>
            <div className="space-y-3">
              {v.imoveis.map((im, i) => {
                const isAtivus = im.comprador.toLowerCase().includes("ativus");
                return (
                  <div key={i} className="border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-zinc-800">{im.imovel}</span>
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm border ${isAtivus ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                        {isAtivus ? "Ativus" : "Gibraltar"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>Recebido: <span className="text-emerald-600 font-semibold">{brl(im.recebido)}</span></span>
                      <span>Saldo: <span className="text-red-500 font-semibold">{brl(im.saldo)}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-200 flex justify-between">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Total recebido</span>
              <span className="text-base font-semibold text-zinc-900">{brl(v.total_recebido)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
