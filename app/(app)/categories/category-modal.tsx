"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { createCategory, editCategory } from "./actions";
import { ICON_OPTIONS, COLOR_OPTIONS, getCategoryIcon } from "@/lib/icon-map";
import type { Category } from "@/lib/types";

type CategoryModalProps = {
  onClose: () => void;
  onSaved: (category: Category) => void;
  editingCategory?: Category | null;
};

export function CategoryModal({ onClose, onSaved, editingCategory }: CategoryModalProps) {
  const [type, setType] = useState<"income" | "expense">(editingCategory?.type ?? "expense");
  const [icon, setIcon] = useState(editingCategory?.icon ?? ICON_OPTIONS[0]);
  const [color, setColor] = useState(editingCategory?.color ?? COLOR_OPTIONS[0]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const payload = { ...formData, type, icon, color };

    const result = editingCategory
      ? await editCategory(editingCategory.id, payload)
      : await createCategory(payload);

    setSubmitting(false);

    if (result.error) {
      if ("fieldErrors" in result.error) {
        setErrors(result.error.fieldErrors as Record<string, string[]>);
      } else {
        setErrors(result.error as Record<string, string[]>);
      }
      return;
    }

    if (result.data) onSaved(result.data);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold tracking-tight">
            {editingCategory ? "Editar categoría" : "Nueva categoría"}
          </h2>
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

          {/* Nombre */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Nombre</label>
            <input
              name="name"
              type="text"
              required
              maxLength={40}
              defaultValue={editingCategory?.name ?? ""}
              placeholder="Ej: Mascotas"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name[0]}</p>}
          </div>

          {/* Selector de ícono */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Ícono</label>
            <div className="grid grid-cols-7 gap-1.5">
              {ICON_OPTIONS.map((key) => {
                const Icon = getCategoryIcon(key);
                const selected = icon === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    className={`h-9 w-9 rounded-md flex items-center justify-center border transition-colors ${
                      selected ? "border-ring bg-muted" : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <Icon size={15} style={{ color: selected ? color : undefined }} className={selected ? "" : "text-muted-foreground"} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector de color */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="h-7 w-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check size={13} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

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