"use client";

import { useState } from "react";
import { getCategoryIcon } from "@/lib/icon-map";
import { saveBudgetLimits } from "./actions";
import { CurrencyInput } from "@/components/ui/currency-input";
import { formatCLP, parseCLP } from "@/lib/format";

type BudgetItem = { id: string; name: string; icon: string; color: string; limit: number; spent: number };

interface BudgetEditorModalProps {
  budgets: BudgetItem[];
  onClose: () => void;
  onSaved: () => void;
}

export function BudgetEditorModal({ budgets, onClose, onSaved }: BudgetEditorModalProps) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(budgets.map((b) => [b.id, b.limit === 0 ? "" : formatCLP(String(b.limit))]))
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const limits: Record<string, number> = {};
    for (const [id, raw] of Object.entries(values)) {
      limits[id] = raw.trim() === "" ? 0 : parseCLP(raw);
    }
    await saveBudgetLimits(limits);
    setSaving(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">Ajustar presupuestos</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">
            ×
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {budgets.map((b) => {
            const Icon = getCategoryIcon(b.icon);
            return (
              <div key={b.id} className="flex items-center gap-3">
                <Icon size={16} style={{ color: b.color }} className="shrink-0" />
                <span className="text-sm flex-1 truncate">{b.name}</span>
                <CurrencyInput
                  value={values[b.id]}
                  onChange={(formatted) => setValues((prev) => ({ ...prev, [b.id]: formatted }))}
                  placeholder="Sin límite"
                  className="w-32 bg-background border border-border rounded-md pl-6 pr-3 py-1.5 text-sm text-right placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40"
                />
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-md border border-border text-sm hover:bg-muted/30"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}