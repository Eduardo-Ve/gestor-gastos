"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, CheckCircle2, Circle, Trash2, Pencil } from "lucide-react";
import { getCategoryIcon } from "@/lib/icon-map";
import { toggleFixedExpenseActive, deleteFixedExpense, toggleFixedExpensePaid } from "@/lib/actions/fixed-expenses";

import { FixedExpenseEditorModal } from "./fixed-expense-editor-modal";
import type { Category } from "@prisma/client";


type FixedExpenseItem = {
  id: string;
  name: string;
  estimatedAmount: number;
  dayOfMonth: number;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  paidThisMonth: boolean;
  paidAmount: number;
};

function clp(n: number) {
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

type Props = {
  fixedExpenses: FixedExpenseItem[];
  categories: Category[];
};

export default function FixedExpensesClient({ fixedExpenses, categories }: Props) {
  const router = useRouter();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FixedExpenseItem | null>(null);

  const activeItems = useMemo(() => fixedExpenses.filter((f) => f.isActive), [fixedExpenses]);

  const stats = useMemo(() => {
    const totalEstimated = activeItems.reduce((sum, f) => sum + f.estimatedAmount, 0);
    const paid = activeItems.filter((f) => f.paidThisMonth);
    const pending = activeItems.filter((f) => !f.paidThisMonth);
    const totalPaid = paid.reduce((sum, f) => sum + f.paidAmount, 0);
    return { totalEstimated, paidCount: paid.length, pendingCount: pending.length, totalPaid };
  }, [activeItems]);

  function handleSaved() {
    setEditorOpen(false);
    setEditingItem(null);
    router.refresh();
  }

  async function handleTogglePaid(id: string) {
    await toggleFixedExpensePaid(id);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este gasto fijo? Esta acción no se puede deshacer.")) return;
    await deleteFixedExpense(id);
    router.refresh();
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground px-5 py-6 md:px-8 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Gastos fijos</h1>
          <p className="text-sm text-muted-foreground">Suscripciones y pagos mensuales recurrentes</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setEditorOpen(true); }}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> Nuevo gasto fijo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Total mensual estimado</p>
          <p className="text-lg font-semibold tracking-tight">{clp(stats.totalEstimated)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Pagados este mes</p>
          <p className="text-lg font-semibold tracking-tight text-emerald-500">
            {stats.paidCount} / {activeItems.length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Pendientes</p>
          <p className="text-lg font-semibold tracking-tight text-amber-500">{stats.pendingCount}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-medium">Todos los gastos fijos</p>
        </div>
        {fixedExpenses.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            Aún no tienes gastos fijos registrados.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {fixedExpenses.map((f) => {
              const Icon = getCategoryIcon(f.categoryIcon);
              return (
                <div key={f.id} className={`flex items-center justify-between px-4 py-3 ${!f.isActive ? "opacity-50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleTogglePaid(f.id)} title={f.paidThisMonth ? "Marcar como no pagado" : "Marcar como pagado"}>
                      {f.paidThisMonth ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : (
                        <Circle size={18} className="text-muted-foreground" />
                      )}
                    </button>
                    <div className="h-8 w-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${f.categoryColor}15` }}>
                      <Icon size={16} style={{ color: f.categoryColor }} />
                    </div>©
                    <div>
                      <p className="text-sm font-medium">{f.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {f.categoryName} · vence día {f.dayOfMonth}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold">{clp(f.estimatedAmount)}</p>
                    <button onClick={() => { setEditingItem(f); setEditorOpen(true); }} className="text-muted-foreground hover:text-foreground">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="text-muted-foreground hover:text-rose-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isEditorOpen && (
        <FixedExpenseEditorModal
          categories={categories}
          editingItem={editingItem}
          onClose={() => { setEditorOpen(false); setEditingItem(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}