import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import { Home, Building2, Users, ReceiptText, Network, Menu } from "lucide-react";

export const metadata: Metadata = {
  title: "TRK Imóveis — Painel Executivo",
  description: "Painel de acompanhamento de vendas TRK Imóveis",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const navLinks = [
    { href: "/", label: "Visão Geral", icon: <Home className="w-4 h-4" /> },
    { href: "/imovel/qi7", label: "QI 7", icon: <Building2 className="w-4 h-4" /> },
    { href: "/imovel/q510", label: "SCRS 510", icon: <Building2 className="w-4 h-4" /> },
    { href: "/imovel/ql08", label: "QL 08", icon: <Building2 className="w-4 h-4" /> },
    { href: "/vendedores", label: "Vendedores", icon: <Users className="w-4 h-4" /> },
    { href: "/pagamentos", label: "Pagamentos", icon: <ReceiptText className="w-4 h-4" /> },
    { href: "/conexoes", label: "Conexões", icon: <Network className="w-4 h-4" /> },
  ];

  const bottomNavLinks = [
    { href: "/", label: "Início", icon: <Home className="w-[22px] h-[22px]" /> },
    { href: "/imovel/qi7", label: "Imóveis", icon: <Building2 className="w-[22px] h-[22px]" /> },
    { href: "/vendedores", label: "Equipe", icon: <Users className="w-[22px] h-[22px]" /> },
    { href: "/pagamentos", label: "Caixa", icon: <ReceiptText className="w-[22px] h-[22px]" /> },
    { href: "/conexoes", label: "Sync", icon: <Network className="w-[22px] h-[22px]" /> },
  ];

  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-zinc-50/50 min-h-screen pb-20 md:pb-0 overflow-x-hidden w-full" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-zinc-200/50 px-5 md:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2.5 active:scale-95 transition-transform">
            <span className="text-2xl font-light tracking-[0.15em] text-zinc-900" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              TRK
            </span>
            <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-zinc-400">imóveis</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href}
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500 hover:text-zinc-900 transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
          {/* Mobile hamburger menu placeholder for now, bottom nav handles main sections */}
        </header>
        <main className="max-w-7xl mx-auto px-5 md:px-10 py-8 md:py-12">{children}</main>
        
        {/* Mobile Bottom Navigation - Floating Pill */}
        <div className="md:hidden fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
          <nav className="pointer-events-auto w-full max-w-sm h-16 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-around px-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
            {bottomNavLinks.map((item) => (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full h-full text-zinc-400 hover:text-white active:scale-90 transition-all duration-300 gap-1 group relative">
                <div className="group-hover:-translate-y-1 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="text-[9px] font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 absolute -bottom-1 transition-opacity duration-300">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <footer className="hidden md:flex border-t border-zinc-200/50 px-10 py-6 justify-between text-[11px] text-zinc-400 tracking-widest mt-10">
          <span>TRK Imóveis — Painel Executivo de Vendas</span>
          <span>{new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</span>
        </footer>
      </body>
    </html>
  );
}
