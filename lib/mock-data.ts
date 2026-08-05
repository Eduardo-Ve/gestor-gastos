import type { Transaction, Category } from "./types";

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Alimentación", type: "expense", color: "#f97316" },
  { id: "cat-2", name: "Transporte", type: "expense", color: "#6366f1" },
  { id: "cat-3", name: "Sueldo", type: "income", color: "#10b981" },
];

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "mock-user-id",
    type: "expense",
    amount: 15000,
    categoryId: "cat-1",
    date: new Date("2026-08-01"),
    description: "Supermercado",
    paymentMethod: "debit",
  },
];