"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createTransaction } from "./actions";
import Link from "next/link";
import type { Category, Transaction } from "@/lib/types";

type TransactionModalProps = {
  categories: Category[];
  onClose: () => void;
  onCreated: () => void;
};

export function TransactionModal({ categories, onClose, onCreated }: TransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setSubmitting] = useState(false);

  const filteredCategories = categories.filter((c) => c.type === type);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const formData = Object.fromEntries(new FormData(e.currentTarget));

    const result = await createTransaction({ ...formData, type });

    setSubmitting(false);

    if (result.error) {
      if ("fieldErrors" in result.error) {
        setErrors(result.error.fieldErrors as Record<string, string[]>);
      } else {
        setErrors(result.error as Record<string, string[]>);
      }
      return;
    }

    if (result.data) {
      onCreated();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold tracking-tight">Nuevo movimiento</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Tipo */}
          <div className="flex rounded-md border border-border overflow-hidden text-sm">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2 transition-colors ${type === "expense" ? "bg-rose-500/10 text-rose-500 font-medium" : "text-muted-foreground"}`}
            >
              Gasto
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2 transition-colors ${type === "income" ? "bg-emerald-500/10 text-emerald-500 font-medium" : "text-muted-foreground"}`}
            >
              Ingreso
            </button>
          </div>

          {/* Monto */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Monto</label>
            <input
              name="amount"
              type="number"
              min="1"
              step="1"
              required
              placeholder="0"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
            {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount[0]}</p>}
          </div>

          {/* Categoría */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Categoría</label>
            <select
              name="categoryId"
              required
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Selecciona una categoría</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-rose-500 mt-1">{errors.categoryId[0]}</p>}
          </div>

          {/* Fecha */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Fecha</label>
            <input
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
            {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date[0]}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Descripción (opcional)</label>
            <input
              name="description"
              type="text"
              maxLength={200}
              placeholder="Ej: Supermercado Líder"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Método de pago */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Método de pago</label>
            <select
              name="paymentMethod"
              required
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="debit">Débito</option>
              
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>
{type === "expense" && (
  <p className="text-xs text-muted-foreground -mt-1">
    ¿Pagaste con tarjeta de crédito?{" "}
    <Link href="/credit-card/new-purchase" className="text-foreground underline hover:opacity-80">
      Regístralo acá
    </Link>{" "}
    para trackear las cuotas.
  </p>
)}
          {errors.general && <p className="text-xs text-rose-500">{errors.general[0]}</p>}

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 text-sm rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}