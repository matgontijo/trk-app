import { api } from "@/lib/api";
import { brl } from "@/lib/fmt";
import { SectionHead, PagamentosTable } from "@/components/ui";

export default async function PagamentosPage() {
  const pagamentos = await api.pagamentos();
  const total = pagamentos.reduce((a, p) => a + p.valor, 0);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-light text-zinc-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Pagamentos
        </h1>
        <p className="text-sm text-zinc-400">
          {pagamentos.length} pagamentos · Total: <span className="text-emerald-600 font-semibold">{brl(total)}</span>
        </p>
      </div>
      <SectionHead title={`Todos os Pagamentos — ${pagamentos.length} registros`} />
      <PagamentosTable rows={pagamentos} showImovel={true} />
    </div>
  );
}
