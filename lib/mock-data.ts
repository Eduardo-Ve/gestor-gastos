import type { Transaction, Category } from "@/lib/types";

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Alimentación", type: "expense", color: "#f97316", icon: "Utensils" },
  { id: "cat-2", name: "Transporte", type: "expense", color: "#6366f1", icon: "Car" },
  { id: "cat-3", name: "Entretenimiento", type: "expense", color: "#f59e0b", icon: "Film" },
  { id: "cat-4", name: "Salud", type: "expense", color: "#14b8a6", icon: "HeartPulse" },
  { id: "cat-5", name: "Educación", type: "expense", color: "#8b5cf6", icon: "GraduationCap" },
  { id: "cat-6", name: "Sueldo", type: "income", color: "#10b981", icon: "Wallet" },
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