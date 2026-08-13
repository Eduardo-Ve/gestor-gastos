"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createFixedExpense, updateFixedExpense } from "@/lib/actions/fixed-expenses";
import type { Category } from "@prisma/client";

type FixedExpenseItem = {
  id: string;
  name: string;
  estimatedAmount: number;
  dayOfMonth: number;
  categoryId: string;
};

type Props = {
  categories: Category[];
  editingItem: FixedExpenseItem | null;
  onClose: () => void;
  onSaved: () => void;
};

export function FixedExpenseEditorModal({ categories, editingItem, onClose, onSaved }: Props) {
  const [name, setName] = useState(editingItem?.name ?? "");
  const [amount, setAmount] = useState(editingItem?.estimatedAmount?.toString() ?? "");
  const [dayOfMonth, setDayOfMonth] = useState(editingItem?.dayOfMonth?.toString() ?? "1");
  const [categoryId, setCategoryId] = useState(editingItem?.categoryId ?? categories[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [installmentsCount, setInstallmentsCount] = useState("1");
const isInstallments = Number(installmentsCount) > 1;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const input = { name, estimatedAmount: amount, dayOfMonth, categoryId };
    const result = editingItem
      ? await updateFixedExpense(editingItem.id, input)
      : await createFixedExpense(input);

    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Ocurrió un error");
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-medium">{editingItem ? "Editar gasto fijo" : "Nuevo gasto fijo"}</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Netflix, Spotify, Internet, etc."
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Monto estimado</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="9990"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Día del mes en que vence</label>
            <input
              type="number"
              min={1}
              max={31}
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
              required
            />
            
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
    
  );
}