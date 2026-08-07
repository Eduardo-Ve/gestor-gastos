"use client";

import {
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, Tooltip, CartesianGrid
} from "recharts";
import { ArrowDownCircle, ArrowUpCircle, ChevronRight } from "lucide-react";
import { getCategoryIcon } from "@/lib/icon-map";
import Link from "next/link";

function clp(n: number) {
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("es-CL", { day: "2-digit", month: "short" });
}

type Props = {
  summary: { income: number; expenses: number; balance: number };
  budgets: { id: string; limit: number; spent: number; category: { name: string; color: string; icon: string } }[];
  monthly: { mes: string; ingresos: number; gastos: number }[];
  recent: { id: string; description: string | null; amount: number; type: string; date: Date; category: { name: string } }[];
  user?: { name?: string | null };
};

export default function DashboardClient({ summary, budgets, monthly, recent, user }: Props) {
  const { income, expenses, balance } = summary;
  const balancePct = income > 0 ? Math.round((balance / income) * 100) : 0;
  const monthLabel = new Date().toLocaleDateString("es-CL", { month: "long" });

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex font-sans">
      <main className="flex-1 px-5 py-6 md:px-8 md:py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight capitalize">Resumen de {monthLabel}</h2>
            <p className="text-sm text-muted-foreground">Cómo va tu mes hasta ahora</p>
          </div>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 md:col-span-1">
            <div className="relative h-20 w-20 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="72%" outerRadius="100%" data={[{ value: balancePct }]} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" fill="var(--foreground)" cornerRadius={8} background={{ fill: "var(--muted)" }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold">
                {balancePct}%
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Balance disponible</p>
              <p className="text-lg font-semibold tracking-tight">{clp(balance)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">de {clp(income)} ingresados</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ArrowUpCircle size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Ingresos</p>
              <p className="text-base font-semibold tracking-tight">{clp(income)}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-rose-500/10 flex items-center justify-center shrink-0">
              <ArrowDownCircle size={18} className="text-rose-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Gastos</p>
              <p className="text-base font-semibold tracking-tight">{clp(expenses)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {/* Evolution chart */}
          <div className="lg:col-span-3 bg-card border border-border rounded-lg p-4">
            <p className="text-sm font-medium mb-3">Ingresos vs. gastos</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthly} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  formatter={(value) => typeof value === "number" ? clp(value) : ""}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }}
                />
                <Line type="monotone" dataKey="ingresos" stroke="var(--foreground)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="gastos" stroke="#db455e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category budgets */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
            <p className="text-sm font-medium mb-3">Presupuestos por categoría</p>
            {budgets.length === 0 ? (
              <p className="text-xs text-muted-foreground">Aún no tienes presupuestos configurados.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {budgets.map((b) => {
                  const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
                  const Icon = getCategoryIcon(b.category.icon);
                  return (
                    <div key={b.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                          <Icon size={13} style={{ color: b.category.color }} />
                          {b.category.name}
                        </div>
                        <span className="text-[11px] text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: b.category.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-card border border-border rounded-lg mt-3">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm font-medium">Movimientos recientes</p>
            <Link href="/transactions" className="text-xs text-muted-foreground flex items-center hover:text-foreground">
              Ver todos <ChevronRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recent.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">Aún no tienes movimientos.</p>
            ) : (
              recent.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.description || "—"}</p>
                    <p className="text-xs text-muted-foreground">{t.category.name} · {formatDate(t.date)}</p>
                  </div>
                  <p className={`text-sm font-semibold ${t.type === "income" ? "text-emerald-600" : "text-foreground"}`}>
                    {t.type === "income" ? "+" : "-"}{clp(t.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}