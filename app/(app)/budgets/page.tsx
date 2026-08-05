"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle, CheckCircle2, TrendingDown, Plus, ChevronRight,
  Utensils, Car, Film, HeartPulse, GraduationCap, Wallet, Home, Zap,
  ArrowDownCircle, ArrowUpCircle, CircleDollarSign
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// ─── Datos mock ───
const budgets = [
  { id: "1", name: "Alimentación", icon: Utensils, color: "#f43f5e", limit: 180000, spent: 145000 },
  { id: "2", name: "Transporte", icon: Car, color: "#6366f1", limit: 90000, spent: 62000 },
  { id: "3", name: "Entretenimiento", icon: Film, color: "#f59e0b", limit: 60000, spent: 58000 },
  { id: "4", name: "Salud", icon: HeartPulse, color: "#14b8a6", limit: 50000, spent: 20000 },
  { id: "5", name: "Educación", icon: GraduationCap, color: "#8b5cf6", limit: 40000, spent: 15000 },
  { id: "6", name: "Hogar", icon: Home, color: "#ec4899", limit: 120000, spent: 115000 },
  { id: "7", name: "Servicios", icon: Zap, color: "#06b6d4", limit: 80000, spent: 82000 },
];

const mockTransactions = [
  { id: "t1", description: "Supermercado Líder", categoryId: "1", amount: 45000, date: "2024-08-05" },
  { id: "t2", description: "Bencina Copec", categoryId: "2", amount: 18000, date: "2024-08-04" },
  { id: "t3", description: "Netflix", categoryId: "3", amount: 7990, date: "2024-08-01" },
  { id: "t4", description: "Farmacia Ahumada", categoryId: "4", amount: 12000, date: "2024-08-03" },
  { id: "t5", description: "Curso Udemy", categoryId: "5", amount: 15000, date: "2024-07-28" },
  { id: "t6", description: "Homecenter", categoryId: "6", amount: 45000, date: "2024-08-02" },
  { id: "t7", description: "Cuenta de luz", categoryId: "7", amount: 35000, date: "2024-08-01" },
  { id: "t8", description: "Cuenta de gas", categoryId: "7", amount: 22000, date: "2024-07-15" },
  { id: "t9", description: "Supermercado Unimarc", categoryId: "1", amount: 32000, date: "2024-08-01" },
  { id: "t10", description: "Uber", categoryId: "2", amount: 12000, date: "2024-07-30" },
  { id: "t11", description: "Cine Hoyts", categoryId: "3", amount: 18000, date: "2024-07-25" },
  { id: "t12", description: "Almuerzo oficina", categoryId: "1", amount: 6800, date: "2024-08-04" },
];

// ─── Helpers ───
function clp(n: number) {
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function getStatus(spent: number, limit: number) {
  const pct = spent / limit;
  if (pct >= 1) return "exceeded";
  if (pct >= 0.8) return "warning";
  return "ok";
}

function getStatusConfig(status: string) {
  switch (status) {
    case "exceeded":
      return { label: "Excedido", icon: AlertTriangle, bg: "bg-rose-500/10", text: "text-rose-500", bar: "bg-rose-500" };
    case "warning":
      return { label: "Cerca del límite", icon: AlertTriangle, bg: "bg-amber-500/10", text: "text-amber-500", bar: "bg-amber-500" };
    default:
      return { label: "Dentro del presupuesto", icon: CheckCircle2, bg: "bg-emerald-500/10", text: "text-emerald-500", bar: "bg-emerald-500" };
  }
}

export default function BudgetsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
    const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
    const remaining = totalLimit - totalSpent;
    const overallPct = Math.round((totalSpent / totalLimit) * 100);
    const alerts = budgets.filter(b => getStatus(b.spent, b.limit) !== "ok");
    return { totalLimit, totalSpent, remaining, overallPct, alerts };
  }, []);

  const chartData = useMemo(() => 
    budgets.map(b => ({ name: b.name, value: b.limit, color: b.color })), 
  []);

  const selectedBudget = budgets.find(b => b.id === selectedCategory);
  
  const categoryTransactions = useMemo(() => {
    if (!selectedCategory) return [];
    return mockTransactions
      .filter(t => t.categoryId === selectedCategory)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedCategory]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground px-5 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Presupuestos</h1>
          <p className="text-sm text-muted-foreground">Control de límites por categoría</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-md hover:opacity-90 transition-opacity">
          <Plus size={15} /> Ajustar presupuestos
        </button>
      </div>

      {/* Stats cards */}
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

      {/* Alerts */}
      {stats.alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {stats.alerts.map(b => {
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

      {/* Main grid: Chart + Budgets list */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-6">
        {/* Donut chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Distribución del presupuesto</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => clp(value)}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {chartData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Budgets list */}
        <div className="lg:col-span-3 bg-card border border-border rounded-lg p-4">
          <p className="text-sm font-medium mb-4">Presupuestos por categoría</p>
          <div className="flex flex-col gap-4">
            {budgets.map(b => {
              const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
              const status = getStatus(b.spent, b.limit);
              const config = getStatusConfig(status);
              const Icon = b.icon;
              const isSelected = selectedCategory === b.id;

              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedCategory(isSelected ? null : b.id)}
                  className={`text-left w-full rounded-lg border p-3 transition-all ${
                    isSelected ? "border-foreground/20 bg-muted/30" : "border-transparent hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${b.color}15` }}>
                        <Icon size={16} style={{ color: b.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{b.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {clp(b.spent)} de {clp(b.limit)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${config.text}`}>{pct}%</span>
                      <ChevronRight size={14} className={`text-muted-foreground transition-transform ${isSelected ? "rotate-90" : ""}`} />
                    </div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: b.color, opacity: status === "exceeded" ? 1 : 0.9 }}
                    />
                  </div>
                  {status !== "ok" && (
                    <p className={`text-[11px] mt-1.5 ${config.text}`}>
                      {status === "exceeded" 
                        ? `Excedido en ${clp(b.spent - b.limit)}` 
                        : `Te quedan ${clp(b.limit - b.spent)} antes de excederte`}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected category detail */}
      {selectedBudget && (
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <selectedBudget.icon size={16} style={{ color: selectedBudget.color }} />
              <p className="text-sm font-medium">Movimientos recientes — {selectedBudget.name}</p>
            </div>
            <span className="text-xs text-muted-foreground">
              {categoryTransactions.length} movimiento{categoryTransactions.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-border">
            {categoryTransactions.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No hay movimientos recientes en esta categoría.
              </div>
            ) : (
              categoryTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.description}</p>
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
    </div>
  );
}