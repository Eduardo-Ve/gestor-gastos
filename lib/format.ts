export function formatCLP(value: string): string {
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  return new Intl.NumberFormat("es-CL").format(Number(numericValue));
}

export function parseCLP(value: string): number {
  return Number(value.replace(/\D/g, ""));
}