"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import { brl } from "@/lib/fmt";

interface VGVChartProps {
  data: { nome: string; vgv: number; recebido: number; saldo: number }[];
}

export function VGVBarChart({ data }: VGVChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="nome"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `R$${(v / 1_000_000).toFixed(1)}M`}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          width={72}
        />
        <Tooltip
          formatter={(v: any) => [brl(v), ""]}
          contentStyle={{
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            fontSize: 12,
            backgroundColor: "#fff",
          }}
          cursor={{ fill: "#f9fafb" }}
        />
        <Legend
          formatter={(v) =>
            v === "vgv" ? "VGV Total" : v === "recebido" ? "Recebido" : "Saldo"
          }
          iconType="square"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: "#6b7280" }}
        />
        <Bar dataKey="vgv" name="vgv" fill="#e5e7eb" radius={[2, 2, 0, 0]} />
        <Bar dataKey="recebido" name="recebido" fill="#10b981" radius={[2, 2, 0, 0]} />
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
  const COLORS = ["#3b82f6", "#f59e0b"];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v: any) => [brl(v), ""]}
          contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 2, fontSize: 12 }}
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
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
        barCategoryGap="30%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="nome"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          width={90}
        />
        <Tooltip
          formatter={(v: any) => [brl(v), "Recebido"]}
          contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 2, fontSize: 12 }}
          cursor={{ fill: "#f9fafb" }}
        />
        <Bar dataKey="recebido" fill="#18181b" radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
