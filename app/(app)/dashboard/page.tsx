"use client";

import {
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, Tooltip, CartesianGrid
} from "recharts";
import {
  ArrowDownCircle, ArrowUpCircle, Wallet, Utensils, Car,
  Film, HeartPulse, GraduationCap, ChevronRight, Plus
} from "lucide-react";

const categories = [
  { name: "Alimentación", icon: Utensils, spent: 145000, limit: 180000, color: "#f43f5e" },
  { name: "Transporte",   icon: Car,       spent: 62000,  limit: 90000,  color: "#6366f1" },
  { name: "Entretenimiento", icon: Film,   spent: 38000,  limit: 60000,  color: "#f59e0b" },
  { name: "Salud",        icon: HeartPulse, spent: 20000, limit: 50000,  color: "#14b8a6" },
  { name: "Educación",    icon: GraduationCap, spent: 15000, limit: 40000, color: "#8b5cf6" },
];

const monthly = [ 
  { mes: "Mar", ingresos: 680000, gastos: 410000 },
  { mes: "Abr", ingresos: 680000, gastos: 455000 },
  { mes: "May", ingresos: 700000, gastos: 380000 },
  { mes: "Jun", ingresos: 680000, gastos: 500000 },
  { mes: "Jul", ingresos: 720000, gastos: 420000 },
  { mes: "Ago", ingresos: 680000, gastos: 280000 },
];

const transactions = [
  { desc: "Supermercado Líder", cat: "Alimentación", amount: -280000, date: "Hoy" },
  { desc: "Sueldo", cat: "Ingreso", amount: 680000, date: "Ayer", income: true },
  { desc: "Bencina Copec", cat: "Transporte", amount: -18000, date: "2 ago" },
  { desc: "Netflix", cat: "Entretenimiento", amount: -7990, date: "1 ago" },
];

function clp(n: number) {
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

export default function Dashboard() {
  const income = 680000;
  const expenses = 280000;
  const balance = income - expenses;
  const balancePct = Math.round((balance / income) * 100);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex font-sans">
    

      {/* Main */}
      <main className="flex-1 px-5 py-6 md:px-8 md:py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Resumen de agosto</h1>
            <p className="text-sm text-muted-foreground">Cómo va tu mes hasta ahora</p>
          </div>

        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {/* Balance ring — signature piece */}
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
            <div className="flex flex-col gap-3">
              {categories.map((c) => {
                const pct = Math.min(100, Math.round((c.spent / c.limit) * 100));
                const Icon = c.icon;
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <Icon size={13} style={{ color: c.color }} />
                        {c.name}
                      </div>
                      <span className="text-[11px] text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-card border border-border rounded-lg mt-3">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm font-medium">Movimientos recientes</p>
            <button className="text-xs text-muted-foreground flex items-center hover:text-foreground">
              Ver todos <ChevronRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {transactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.desc}</p>
                  <p className="text-xs text-muted-foreground">{t.cat} · {t.date}</p>
                </div>
                <p className={`text-sm font-semibold ${t.income ? "text-emerald-600" : "text-foreground"}`}>
                  {t.income ? "+" : ""}{clp(t.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
