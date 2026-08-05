import { z } from "zod";
import { ICON_OPTIONS, COLOR_OPTIONS } from "./icon-map";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive().max(999_999_999),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  date: z.coerce.date(),
  description: z.string().trim().max(200).optional(),
  paymentMethod: z.enum(["cash", "debit", "credit", "transfer"]),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(40),
  type: z.enum(["income", "expense"]),
  color: z.enum(COLOR_OPTIONS as [string, ...string[]]),
  icon: z.enum(ICON_OPTIONS as [string, ...string[]]),
});

export type CategoryInput = z.infer<typeof categorySchema>;