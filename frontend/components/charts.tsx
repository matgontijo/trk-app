"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import { brl } from "@/lib/fmt";

interface VGVChartProps {
  data: { imovel: string; vgv: number; recebido: number; saldo: number }[];
}

export function VGVBarChart({ data }: VGVChartProps) {
  const formatYAxis = (v: number) => `R$${(v / 1_000_000).toFixed(1)}M`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }} barCategoryGap="30%">
        <defs>
          <linearGradient id="colorVgv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#18181b" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#3f3f46" stopOpacity={0.8}/>
          </linearGradient>
          <linearGradient id="colorRecebido" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#059669" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.5} />
        <XAxis dataKey="imovel" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v: any) => brl(v)} cursor={{ fill: "#f4f4f5", opacity: 0.4 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" />
        <Bar dataKey="vgv" name="VGV" fill="url(#colorVgv)" radius={[4, 4, 0, 0]} animationDuration={1500} />
        <Bar dataKey="recebido" name="Recebido" fill="url(#colorRecebido)" radius={[4, 4, 0, 0]} animationDuration={1500} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface StatusPieProps {
  ativus: number;
  gibraltar: number;
}

export function CompradorPieChart({ ativus, gibraltar }: StatusPieProps) {
  const data = [
    { name: "Ativus", value: ativus },
    { name: "Gibraltar", value: gibraltar },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <defs>
          <linearGradient id="pieAtivus" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9}/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7}/>
          </linearGradient>
          <linearGradient id="pieGibraltar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d97706" stopOpacity={0.9}/>
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7}/>
          </linearGradient>
        </defs>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          animationDuration={1500}
        >
          <Cell key="cell-0" fill="url(#pieAtivus)" />
          <Cell key="cell-1" fill="url(#pieGibraltar)" />
        </Pie>
        <Tooltip
          formatter={(v: any) => [brl(v), ""]}
          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: "#6b7280" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface VendedorBarProps {
  data: { nome: string; recebido: number }[];
}

export function VendedorBarChart({ data }: VendedorBarProps) {
  const formatYAxis = (v: number) => `R$${(v / 1_000_000).toFixed(1)}M`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
        barCategoryGap="30%"
      >
        <defs>
          <linearGradient id="colorVendedor" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#c4b5fd" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} opacity={0.5} />
        <XAxis
          type="number"
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 10, fill: "#71717a" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="nome"
          tick={{ fontSize: 10, fill: "#71717a" }}
          axisLine={false}
          tickLine={false}
          width={90}
        />
        <Tooltip
          formatter={(v: any) => [brl(v), "Recebido"]}
          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          cursor={{ fill: "#f4f4f5", opacity: 0.4 }}
        />
        <Bar dataKey="recebido" fill="url(#colorVendedor)" radius={[0, 4, 4, 0]} animationDuration={1500} />
      </BarChart>
    </ResponsiveContainer>
  );
}
