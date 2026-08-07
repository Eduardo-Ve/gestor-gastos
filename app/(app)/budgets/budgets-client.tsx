"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, TrendingDown, Plus, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getCategoryIcon } from "@/lib/icon-map";
import { BudgetEditorModal } from "./budget-editor-modal";
import type { Transaction } from "@prisma/client";

type BudgetItem = { id: string; name: string; icon: string; color: string; limit: number; spent: number };

function clp(n: number) {
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function getStatus(spent: number, limit: number) {
  if (limit === 0) return "unset";
  const pct = spent / limit;
  if (pct >= 1) return "exceeded";
  if (pct >= 0.8) return "warning";
  return "ok";
}

function getStatusConfig(status: string) {
  switch (status) {
    case "exceeded":
      return { label: "Excedido", icon: AlertTriangle, bg: "bg-rose-500/10", text: "text-rose-500" };
    case "warning":
      return { label: "Cerca del límite", icon: AlertTriangle, bg: "bg-amber-500/10", text: "text-amber-500" };
    case "unset":
      return { label: "Sin presupuesto", icon: AlertTriangle, bg: "bg-muted", text: "text-muted-foreground" };
    default:
      return { label: "Dentro del presupuesto", icon: CheckCircle2, bg: "bg-emerald-500/10", text: "text-emerald-500" };
  }
}

type Props = {
  budgets: BudgetItem[];
  recentTxs: Transaction[];
};

export default function BudgetsClient({ budgets, recentTxs }: Props) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isEditorOpen, setEditorOpen] = useState(false);

  const stats = useMemo(() => {
    const withLimit = budgets.filter((b) => b.limit > 0);
    const totalLimit = withLimit.reduce((acc, b) => acc + b.limit, 0);
    const totalSpent = withLimit.reduce((acc, b) => acc + b.spent, 0);
    const remaining = totalLimit - totalSpent;
    const overallPct = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;
    const alerts = budgets.filter((b) => b.limit > 0 && getStatus(b.spent, b.limit) !== "ok");
    return { totalLimit, totalSpent, remaining, overallPct, alerts };
  }, [budgets]);

  const chartData = useMemo(
    () => budgets.filter((b) => b.limit > 0).map((b) => ({ name: b.name, value: b.limit, color: b.color })),
    [budgets]
  );

  const selectedBudget = budgets.find((b) => b.id === selectedCategory);
  const categoryTransactions = useMemo(() => {
    if (!selectedCategory) return [];
    return recentTxs.filter((t) => t.categoryId === selectedCategory);
  }, [selectedCategory, recentTxs]);

  function handleSaved() {
    setEditorOpen(false);
    router.refresh();
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground px-5 py-6 md:px-8 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Presupuestos</h1>
          <p className="text-sm text-muted-foreground">Control de límites por categoría</p>
        </div>
        <button
          onClick={() => setEditorOpen(true)}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> Ajustar presupuestos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Total presupuestado</p>
          <p className="text-lg font-semibold tracking-tight">{clp(stats.totalLimit)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Total gastado</p>
          <p className="text-lg font-semibold tracking-tight text-rose-500">{clp(stats.totalSpent)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Disponible</p>
          <p className={`text-lg font-semibold tracking-tight ${stats.remaining >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {clp(stats.remaining)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <TrendingDown size={18} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">% usado general</p>
            <p className="text-lg font-semibold tracking-tight">{stats.overallPct}%</p>
          </div>
        </div>
      </div>

      {stats.alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {stats.alerts.map((b) => {
            const status = getStatus(b.spent, b.limit);
            const config = getStatusConfig(status);
            const Icon = config.icon;
            return (
              <div key={b.id} className={`flex items-center gap-3 rounded-lg border border-border px-4 py-3 ${config.bg}`}>
                <Icon size={18} className={config.text} />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {b.name}: <span className={config.text}>{config.label}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Has gastado {clp(b.spent)} de {clp(b.limit)} ({Math.round((b.spent / b.limit) * 100)}%)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Distribución del presupuesto</p>
          {chartData.length === 0 ? (
            <p className="text-xs text-muted-foreground py-10 text-center">Aún no has definido presupuestos.</p>
          ) : (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius="60%" outerRadius="85%" paddingAngle={3} dataKey="value" stroke="none">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => (typeof value === "number" ? clp(value) : "")} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {chartData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-3 bg-card border border-border rounded-lg p-4">
          <p className="text-sm font-medium mb-4">Presupuestos por categoría</p>
          {budgets.length === 0 ? (
            <p className="text-xs text-muted-foreground">Crea categorías de gasto primero.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {budgets.map((b) => {
                const pct = b.limit > 0 ? Math.min(100, Math.round((b.spent / b.limit) * 100)) : 0;
                const status = getStatus(b.spent, b.limit);
                const config = getStatusConfig(status);
                const Icon = getCategoryIcon(b.icon);
                const isSelected = selectedCategory === b.id;

                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedCategory(isSelected ? null : b.id)}
                    className={`text-left w-full rounded-lg border p-3 transition-all ${isSelected ? "border-foreground/20 bg-muted/30" : "border-transparent hover:bg-muted/20"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${b.color}15` }}>
                          <Icon size={16} style={{ color: b.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{b.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {b.limit > 0 ? `${clp(b.spent)} de ${clp(b.limit)}` : `${clp(b.spent)} gastado, sin límite`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {b.limit > 0 && <span className={`text-xs font-semibold ${config.text}`}>{pct}%</span>}
                        <ChevronRight size={14} className={`text-muted-foreground transition-transform ${isSelected ? "rotate-90" : ""}`} />
                      </div>
                    </div>
                    {b.limit > 0 && (
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: b.color, opacity: status === "exceeded" ? 1 : 0.9 }} />
                      </div>
                    )}
                    {status !== "ok" && status !== "unset" && (
                      <p className={`text-[11px] mt-1.5 ${config.text}`}>
                        {status === "exceeded" ? `Excedido en ${clp(b.spent - b.limit)}` : `Te quedan ${clp(b.limit - b.spent)} antes de excederte`}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedBudget && (
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm font-medium">Movimientos recientes — {selectedBudget.name}</p>
            <span className="text-xs text-muted-foreground">
              {categoryTransactions.length} movimiento{categoryTransactions.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-border">
            {categoryTransactions.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">No hay movimientos recientes en esta categoría.</div>
            ) : (
              categoryTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.description || "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.date).toLocaleDateString("es-CL", { day: "2-digit", month: "long" })}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">-{clp(t.amount)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {isEditorOpen && (
        <BudgetEditorModal budgets={budgets} onClose={() => setEditorOpen(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}