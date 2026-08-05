import type { Transaction, Category } from "./types";
import { mockTransactions, mockCategories } from "./mock-data";

// --- Transacciones ---
export const transactionStore: Transaction[] = [...mockTransactions];

export function addTransaction(transaction: Transaction) {
  transactionStore.unshift(transaction);
  return transaction;
}

// --- Categorías ---
export const categoryStore: Category[] = [...mockCategories];

export function addCategory(category: Category) {
  categoryStore.push(category);
  return category;
}

export function updateCategory(id: string, data: Partial<Omit<Category, "id">>) {
  const index = categoryStore.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categoryStore[index] = { ...categoryStore[index], ...data };
  return categoryStore[index];
}

export function deleteCategory(id: string) {
  const inUse = transactionStore.some((t) => t.categoryId === id);
  if (inUse) {
    return { error: "No puedes eliminar una categoría con movimientos asociados" };
  }
  const index = categoryStore.findIndex((c) => c.id === id);
  if (index === -1) return { error: "Categoría no encontrada" };
  categoryStore.splice(index, 1);
  return { success: true };
}