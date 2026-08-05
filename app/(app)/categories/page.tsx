"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { mockCategories, mockTransactions } from "@/lib/mock-data";
import { getCategoryIcon } from "@/lib/icon-map";
import { removeCategory } from "./actions";
import type { Category } from "@/lib/types";
import { CategoryModal } from "./category-modal";

function clp(n: number) {
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const spentByCategory = useMemo(() => {
    const now = new Date();
    const map: Record<string, number> = {};
    for (const t of mockTransactions) {
      const d = new Date(t.date);
      const sameMonth = d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (!sameMonth) continue;
      map[t.categoryId] = (map[t.categoryId] ?? 0) + t.amount;
    }
    return map;
  }, []);

  function openCreate() {
    setEditingCategory(null);
    setModalOpen(true);
  }

  function openEdit(category: Category) {
    setEditingCategory(category);
    setModalOpen(true);
  }

  function handleSaved(category: Category) {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      return exists ? prev.map((c) => (c.id === category.id ? category : c)) : [...prev, category];
    });
    setModalOpen(false);
  }

  async function handleDelete(id: string) {
    setDeleteError(null);
    const result = await removeCategory(id);
    if (result.error) {
      setDeleteError(result.error.general?.[0] ?? "No se pudo eliminar");
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Categorías</h1>
          <p className="text-sm text-muted-foreground">Organiza tus ingresos y gastos</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> Categoría
        </button>
      </div>

      {deleteError && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 text-sm px-3 py-2 rounded-md mb-4">
          {deleteError}
        </div>
      )}

      <CategorySection
        title="Gastos"
        categories={expenseCategories}
        spentByCategory={spentByCategory}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <CategorySection
        title="Ingresos"
        categories={incomeCategories}
        spentByCategory={spentByCategory}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <CategoryModal
          editingCategory={editingCategory}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function CategorySection({
  title,
  categories,
  spentByCategory,
  onEdit,
  onDelete,
}: {
  title: string;
  categories: Category[];
  spentByCategory: Record<string, number>;
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
      {categories.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
          Aún no tienes categorías de {title.toLowerCase()}.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((c) => {
            const Icon = getCategoryIcon(c.icon);
            const spent = spentByCategory[c.id] ?? 0;
            return (
              <div key={c.id} className="bg-card border border-border rounded-lg p-4 group relative">
                <div
                  className="h-9 w-9 rounded-md flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${c.color}1a` }}
                >
                  <Icon size={16} style={{ color: c.color }} />
                </div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {spent > 0 ? `${clp(spent)} este mes` : "Sin movimientos"}
                </p>

                <div className="absolute top-3 right-3 hidden group-hover:flex gap-1">
                  <button
                    onClick={() => onEdit(c)}
                    className="h-6 w-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
                    className="h-6 w-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-rose-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}