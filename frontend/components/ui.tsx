"use client";
import { brl, pct } from "@/lib/fmt";

// ── KPI Card ──────────────────────────────────────────────────────────
interface KpiProps {
  label: string;
  value: string | number;
  sub?: string;
  variant?: "default" | "green" | "red" | "dark";
}

export function KpiCard({ label, value, sub, variant = "default" }: KpiProps) {
  const valueColor =
    variant === "green"
      ? "text-emerald-600"
      : variant === "red"
      ? "text-red-600"
      : variant === "dark"
      ? "text-zinc-900"
      : "text-zinc-900";

  return (
    <div className="bg-white border border-zinc-200 p-6 hover:border-zinc-400 transition-colors group">
      <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-zinc-400 mb-3">
        {label}
      </p>
      <p className={`font-light text-3xl leading-none mb-1 ${valueColor}`}
         style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {value}
      </p>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────
interface ProgressProps {
  pago: number;
  total: number;
  label?: string;
}

export function ProgressBar({ pago, total, label }: ProgressProps) {
  const p = pct(pago, total);
  return (
    <div className="mt-4 pt-4 border-t border-zinc-100">
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-400 mb-2">
        <span>{label || "Recebido"}</span>
        <span>{p}%</span>
      </div>
      <div className="h-[2px] bg-zinc-100 overflow-hidden">
        <div
          className="h-full bg-zinc-900 transition-all duration-1000"
          style={{ width: `${p}%` }}
        />
      </div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  variant?: "default" | "ativus" | "gibraltar";
}

export function Badge({ label, variant = "default" }: BadgeProps) {
  const cls =
    variant === "ativus"
      ? "bg-blue-50 text-blue-700 border border-blue-200"
      : variant === "gibraltar"
      ? "bg-amber-50 text-amber-700 border border-amber-200"
      : "bg-zinc-100 text-zinc-600 border border-zinc-200";
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm ${cls}`}>
      {label}
    </span>
  );
}

// ── Section Header ────────────────────────────────────────────────────
export function SectionHead({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-6">
      <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-zinc-400">
        {title}
      </p>
      {right && <div>{right}</div>}
    </div>
  );
}

// ── Pagamentos Table ──────────────────────────────────────────────────
import type { PagamentoFlat } from "@/lib/api";

interface PgtoTableProps {
  rows: PagamentoFlat[];
  showImovel?: boolean;
}

export function PagamentosTable({ rows, showImovel = true }: PgtoTableProps) {
  const total = rows.reduce((a, r) => a + r.valor, 0);
  return (
    <div className="overflow-x-auto border border-zinc-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50">
            {showImovel && (
              <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                Imóvel
              </th>
            )}
            <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              Data
            </th>
            <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              Comprador
            </th>
            <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              Vendedor
            </th>
            <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              Descrição
            </th>
            <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              Valor
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const isAtivus = r.comprador.toLowerCase().includes("ativus");
            return (
              <tr
                key={i}
                className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
              >
                {showImovel && (
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {r.imovel_nome}
                  </td>
                )}
                <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{r.data}</td>
                <td className="px-4 py-3">
                  <Badge
                    label={isAtivus ? "Ativus" : "Gibraltar"}
                    variant={isAtivus ? "ativus" : "gibraltar"}
                  />
                </td>
                <td className="px-4 py-3 text-zinc-700">{r.vendedor}</td>
                <td className="px-4 py-3 text-zinc-500 text-xs">{r.descricao}</td>
                <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                  {brl(r.valor)}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-zinc-300 bg-zinc-50">
            <td
              colSpan={showImovel ? 5 : 4}
              className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500"
            >
              Total Recebido
            </td>
            <td className="px-4 py-3 text-right font-bold text-zinc-900 text-base">
              {brl(total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ── Vendedor Card ─────────────────────────────────────────────────────
import type { VendedorDetalhe } from "@/lib/api";

export function VendedorCard({ v, comprador }: { v: VendedorDetalhe; comprador: string }) {
  const isAtivus = comprador.toLowerCase().includes("ativus");
  const p = pct(v.total_recebido, v.valor_acordado);
  return (
    <div className="border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-medium text-zinc-900 text-sm">{v.nome}</p>
          <Badge
            label={isAtivus ? "Ativus" : "Gibraltar"}
            variant={isAtivus ? "ativus" : "gibraltar"}
          />
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-400 mb-0.5">Recebido</p>
          <p className="font-semibold text-emerald-600">{brl(v.total_recebido)}</p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between py-1.5 border-b border-zinc-100">
          <span className="text-zinc-500">Valor acordado</span>
          <span className="text-zinc-800 font-medium">{brl(v.valor_acordado)}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-zinc-100">
          <span className="text-zinc-500">Recebido</span>
          <span className="text-emerald-600 font-semibold">{brl(v.total_recebido)}</span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-zinc-500">Saldo restante</span>
          <span className="text-red-600 font-semibold">{brl(v.saldo_restante)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-100">
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
          <span>Pago</span>
          <span>{p}%</span>
        </div>
        <div className="h-[2px] bg-zinc-100 overflow-hidden">
          <div className="h-full bg-zinc-900 transition-all duration-1000" style={{ width: `${p}%` }} />
        </div>
      </div>

      {v.pagamentos.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-100">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Pagamentos</p>
          <div className="space-y-1.5">
            {v.pagamentos.map((pg, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-zinc-500">{pg.data} · {pg.descricao}</span>
                <span className="text-emerald-600 font-medium">{brl(pg.valor)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
