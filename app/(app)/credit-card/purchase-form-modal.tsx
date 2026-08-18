"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createCreditCardPurchase } from "@/lib/actions/credit-card";
import type { Category } from "@prisma/client";
import { CurrencyInput } from "@/components/ui/currency-input";
import { parseCLP } from "@/lib/format";

type Props = {
  cardId: string;
  categories: Category[];
  onClose: () => void;
  onCreated: () => void;
};

export function PurchaseFormModal({ cardId, categories, onClose, onCreated }: Props) {
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [installmentsCount, setInstallmentsCount] = useState("1");
  const [monthlyInterestRate, setMonthlyInterestRate] = useState("0");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const isInstallments = Number(installmentsCount) > 1;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await createCreditCardPurchase({
        cardId,
        description,
        totalAmount: parseCLP(totalAmount),
        installmentsCount: Number(installmentsCount),
        monthlyInterestRate: isInstallments ? Number(monthlyInterestRate) / 100 : 0,
        categoryId,
        purchaseDate: new Date(purchaseDate),
      });

      if (!result.success) {
        setError(result.error ?? "Ocurrió un error al guardar la compra");
        return;
      }

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo conectar con el servidor");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-medium">Nueva compra con tarjeta</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Descripción</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notebook, refrigerador, etc."
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Monto total</label>
            <CurrencyInput
              value={totalAmount}
              onChange={setTotalAmount}
              placeholder="300.000"
              required
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Número de cuotas</label>
            <input
              type="number"
              min={1}
              max={48}
              value={installmentsCount}
              onChange={(e) => setInstallmentsCount(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          {isInstallments && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Tasa de interés mensual (%) — 0 si es sin interés
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={monthlyInterestRate}
                onChange={(e) => setMonthlyInterestRate(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Fecha de compra</label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
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