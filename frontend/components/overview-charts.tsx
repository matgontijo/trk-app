"use client";
import { VGVBarChart, CompradorPieChart, VendedorBarChart } from "./charts";
import { SectionHead } from "./ui";

interface Props {
  vgvData: { imovel: string; vgv: number; recebido: number; saldo: number }[];
  vendedorData: { nome: string; recebido: number }[];
  ativus: number;
  gibraltar: number;
}

export function OverviewCharts({ vgvData, vendedorData, ativus, gibraltar }: Props) {
  return (
    <>
      <SectionHead title="Análise Gráfica" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 mb-10">
        <div className="md:col-span-2 bg-white p-4 md:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400 mb-4">
            VGV vs. Recebido por Imóvel
          </p>
          <div className="h-[180px] min-h-[180px] md:min-h-[260px] md:h-[260px] w-full">
            <VGVBarChart data={vgvData} />
          </div>
        </div>
        <div className="bg-white p-4 md:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400 mb-4">
            Recebido por Comprador
          </p>
          <div className="h-[180px] min-h-[180px] md:min-h-[220px] md:h-[220px] w-full">
            <CompradorPieChart ativus={ativus} gibraltar={gibraltar} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 mb-10">
        <div className="bg-white p-4 md:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400 mb-4">
            Recebido por Vendedor
          </p>
          <div className="h-[180px] min-h-[180px] md:min-h-[220px] md:h-[220px] w-full">
            <VendedorBarChart data={vendedorData} />
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 flex flex-col justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400 mb-4">
            Distribuição por Comprador
          </p>
          <div className="space-y-3 mt-auto">
            {[
              { label: "Ativus Participações", value: ativus, color: "#3b82f6" },
              { label: "Gibraltar Investimentos", value: gibraltar, color: "#f59e0b" },
            ].map(({ label, value, color }) => {
              const total = ativus + gibraltar;
              const w = total ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-600">{label}</span>
                    <span className="font-semibold text-zinc-900">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value)}
                    </span>
                  </div>
                  <div className="h-1 bg-zinc-100 overflow-hidden rounded-full">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${w}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
