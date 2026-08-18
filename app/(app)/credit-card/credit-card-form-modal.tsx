"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createCreditCard } from "@/lib/actions/credit-card";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export function CreditCardFormModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [cardLimit, setCardLimit] = useState("");
  const [closingDay, setClosingDay] = useState("1");
  const [dueDay, setDueDay] = useState("10");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await createCreditCard({ name, cardLimit, closingDay, dueDay });

    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Ocurrió un error");
      return;
    }
    onCreated();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-medium">Configurar tarjeta de crédito</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Nombre de la tarjeta</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Falabella Visa, Santander Latam Pass, etc."
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Cupo total</label>
            <input
              type="number"
              value={cardLimit}
              onChange={(e) => setCardLimit(e.target.value)}
              placeholder="1500000"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Día de cierre</label>
              <input
                type="number"
                min={1}
                max={31}
                value={closingDay}
                onChange={(e) => setClosingDay(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Día de vencimiento</label>
              <input
                type="number"
                min={1}
                max={31}
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
                required
              />
            </div>
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