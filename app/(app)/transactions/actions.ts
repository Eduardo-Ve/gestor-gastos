"use server";

import { transactionSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { addTransaction } from "@/lib/mock-store";
import { randomUUID } from "crypto";

export async function createTransaction(formData: Record<string, unknown>) {
  const parsed = transactionSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const session = await auth();
  if (!session?.user?.id) return { error: { general: ["No autorizado"] } };

  const transaction = addTransaction({
    id: randomUUID(),
    ...parsed.data,
    userId: session.user.id,
  });

  return { data: transaction };
}