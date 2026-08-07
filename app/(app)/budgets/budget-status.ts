export type BudgetStatus = "exceeded" | "warning" | "unset" | "ok";

export function getStatus(spent: number, limit: number): BudgetStatus {
  if (limit === 0) return "unset";
  const pct = spent / limit;
  if (pct >= 1) return "exceeded";
  if (pct >= 0.8) return "warning";
  return "ok";
}