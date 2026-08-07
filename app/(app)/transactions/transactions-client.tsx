"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Circle } from "lucide-react";
import { getCategoryIcon } from "@/lib/icon-map";
import { TransactionModal } from "./transaction-modal";
import type { Category, Transaction } from "@prisma/client";

type TransactionWithCategory = Transaction & { category: Category };

function clp(n: number) {
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("es-CL", { day: "2-digit", month: "short" });
}

type Props = {
  transactions: TransactionWithCategory[];
  categories: Category[];
};

export default function TransactionsClient({ transactions, categories }: Props) {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (typeFilter === "all" ? true : t.type === typeFilter))
      .filter((t) => (categoryFilter === "all" ? true : t.categoryId === categoryFilter))
      .filter((t) =>
        search.trim() === ""
          ? true
          : (t.description ?? "").toLowerCase().includes(search.toLowerCase())
      );
  }, [transactions, typeFilter, categoryFilter, search]);

  function handleCreated() {
    setModalOpen(false);
    router.refresh();
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground px-5 py-6 md:px-8 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Movimientos</h1>
          <p className="text-sm text-muted-foreground">Historial completo de ingresos y gastos</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> Movimiento
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descripción..."
            className="w-full bg-card border border-border rounded-md pl-8 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">Todos los tipos</option>
          <option value="income">Ingresos</option>
          <option value="expense">Gastos</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Descripción</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Método</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No hay movimientos que calcen con estos filtros.
                </td>
              </tr>
            )}
            {filtered.map((t) => {
              const Icon = getCategoryIcon(t.category?.icon) ?? Circle;
              return (
                <tr key={t.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 font-medium">{t.description || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon size={13} style={{ color: t.category?.color }} />
                      {t.category?.name ?? "Sin categoría"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{t.paymentMethod}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(t.date)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${t.type === "income" ? "text-emerald-500" : "text-foreground"}`}>
                    {t.type === "income" ? "+" : "-"}{clp(t.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <TransactionModal
          categories={categories}
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}