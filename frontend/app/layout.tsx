import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TRK Imóveis — Painel Executivo",
  description: "Painel de acompanhamento de vendas TRK Imóveis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-zinc-50 min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <header className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-6 md:px-10 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2.5">
            <span className="text-2xl font-light tracking-[0.15em] text-zinc-900" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              TRK
            </span>
            <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-zinc-400">imóveis</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: "/", label: "Visão Geral" },
              { href: "/imovel/qi7", label: "QI 7" },
              { href: "/imovel/q510", label: "SCRS 510" },
              { href: "/imovel/ql08", label: "QL 08" },
              { href: "/vendedores", label: "Vendedores" },
              { href: "/pagamentos", label: "Pagamentos" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500 hover:text-zinc-900 transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-4 md:px-10 py-10">{children}</main>
        <footer className="border-t border-zinc-200 px-10 py-5 flex justify-between text-[10px] text-zinc-400 tracking-wider mt-10">
          <span>TRK Imóveis — Painel Executivo de Vendas</span>
          <span>{new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</span>
        </footer>
      </body>
    </html>
  );
}
