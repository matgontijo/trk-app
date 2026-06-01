"use client";
import { useEffect, useState } from "react";
import { Network, Database, RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react";

interface Connection {
  id: string;
  nome: string;
  sheet_id: string;
  status: string;
  last_sync: string;
}

export default function ConexoesPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/status");
      const data = await res.json();
      setConnections(data.connections);
    } catch (error) {
      console.error("Erro ao buscar status", error);
    } finally {
      setLoading(false);
    }
  };

  const forceSync = async () => {
    setSyncing(true);
    try {
      await fetch("http://localhost:8000/api/sync", { method: "POST" });
      await fetchStatus();
    } catch (error) {
      console.error("Erro ao sincronizar", error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 md:mb-10 relative">
        <div className="absolute -top-10 -left-4 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-60"></div>
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-light text-zinc-900 tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Conexões
          </h1>
        </div>
        <p className="text-[11px] md:text-sm text-zinc-400 tracking-wide font-medium">
          Gerencie o status da sincronização com o Google Sheets
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-100 pb-6">
          <div>
            <h2 className="text-lg font-medium text-zinc-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-zinc-400" />
              Google Sheets API
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Os dados são sincronizados automaticamente a cada 5 minutos.
            </p>
          </div>
          <button
            onClick={forceSync}
            disabled={syncing || loading}
            className="flex items-center justify-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-zinc-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? "Sincronizando..." : "Forçar Sincronização"}
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-zinc-400 text-sm">Carregando conexões...</div>
          ) : (
            connections.map((c) => (
              <div key={c.id} className="bg-zinc-50/50 rounded-2xl border border-zinc-100 p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-zinc-900">{c.nome}</span>
                    {c.status === "Conectado" ? (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Conectado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" /> {c.status}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    ID: {c.sheet_id}
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end text-xs bg-white p-3 rounded-xl border border-zinc-100">
                  <span className="text-zinc-400 mb-0.5 uppercase tracking-wider text-[9px] font-semibold">Última Sincronização</span>
                  <span className="text-zinc-700 font-medium">{c.last_sync}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
