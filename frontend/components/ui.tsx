"use client";
import { brl, pct } from "@/lib/fmt";
import { motion } from "framer-motion";

// ── AnimateIn Wrapper ───────────────────────────────────────────────────
export function AnimateIn({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl md:rounded-3xl border border-zinc-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-5 md:p-6 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 group"
    >
      <p className="text-[9px] md:text-[10px] font-semibold tracking-[0.22em] uppercase text-zinc-400 mb-2 md:mb-3">
        {label}
      </p>
      <p className={`font-light text-3xl md:text-4xl leading-none mb-1.5 ${valueColor}`}
         style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {value}
      </p>
      {sub && <p className="text-[10px] md:text-xs text-zinc-400 mt-1">{sub}</p>}
    </motion.div>
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
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border border-zinc-200">
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

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {rows.map((r, i) => {
          const isAtivus = r.comprador.toLowerCase().includes("ativus");
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-5 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-300 relative overflow-hidden"
            >
              {/* Glass subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/50 to-transparent pointer-events-none"></div>
              
              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-full">{r.data}</div>
                  <div className="text-lg font-medium text-emerald-600 tracking-tight">{brl(r.valor)}</div>
                </div>
                {showImovel && <div className="text-xl font-light text-zinc-900 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{r.imovel_nome}</div>}
                
                <div className="space-y-2 bg-zinc-50/80 rounded-2xl p-4 border border-zinc-100/50">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium uppercase tracking-wider text-[9px]">Origem</span>
                    <Badge
                      label={isAtivus ? "Ativus" : "Gibraltar"}
                      variant={isAtivus ? "ativus" : "gibraltar"}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium uppercase tracking-wider text-[9px]">Destino</span>
                    <span className="text-zinc-700 font-semibold">{r.vendedor}</span>
                  </div>
                </div>
                
                <div className="text-[11px] text-zinc-500 mt-4 flex items-start gap-2 px-1">
                  <div className="w-1 h-1 rounded-full bg-zinc-300 mt-1.5 shrink-0"></div>
                  <span className="leading-relaxed">{r.descricao}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div className="bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 p-5 flex justify-between items-center mt-2 text-white">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Total Recebido
          </span>
          <span className="text-xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{brl(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Vendedor Card ─────────────────────────────────────────────────────
import type { VendedorDetalhe } from "@/lib/api";

export function VendedorCard({ v, comprador }: { v: VendedorDetalhe; comprador: string }) {
  const isAtivus = comprador.toLowerCase().includes("ativus");
  const p = pct(v.total_recebido, v.valor_acordado);
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-3xl border border-zinc-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 p-5 md:p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="font-semibold text-zinc-900 text-sm md:text-base mb-1">{v.nome}</p>
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

      <div className="space-y-3 text-xs bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100/50">
        <div className="flex justify-between items-center border-b border-zinc-100/80 pb-2">
          <span className="text-zinc-400 font-medium tracking-wide">Valor acordado</span>
          <span className="text-zinc-800 font-semibold text-sm">{brl(v.valor_acordado)}</span>
        </div>
        <div className="flex justify-between items-center border-b border-zinc-100/80 pb-2">
          <span className="text-zinc-400 font-medium tracking-wide">Recebido</span>
          <span className="text-emerald-600 font-bold text-sm">{brl(v.total_recebido)}</span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-zinc-400 font-medium tracking-wide">Saldo restante</span>
          <span className="text-red-500 font-bold text-sm">{brl(v.saldo_restante)}</span>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-zinc-100">
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
    </motion.div>
  );
}
