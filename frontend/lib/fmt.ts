export function brl(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function pct(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export function firstName(name: string): string {
  return name.split(" ")[0];
}

export function compradorShort(nome: string): string {
  if (nome.toLowerCase().includes("ativus")) return "Ativus";
  if (nome.toLowerCase().includes("gibraltar")) return "Gibraltar";
  return nome;
}
