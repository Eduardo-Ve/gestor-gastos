import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive().max(999_999_999),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  date: z.coerce.date(),
  description: z.string().trim().max(200).optional(),
  paymentMethod: z.enum(["cash", "debit", "credit", "transfer"]),
});

export type TransactionInput = z.infer<typeof transactionSchema>;