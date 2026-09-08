"use server";

import { transactionSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: Record<string, unknown>) {
  const parsed = transactionSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const session = await auth();
  if (!session?.user?.id) return { error: { general: ["No autorizado"] } };

  const category = await prisma.category.findFirst({
    where: {
      id: parsed.data.categoryId,
      userId: session.user.id,
      type: parsed.data.type,
    },
    select: { id: true },
  });

  if (!category) {
    return { error: { general: ["Categoría no válida para este tipo de movimiento"] } };
  }

  const transaction = await prisma.transaction.create({
    data: {
      ...parsed.data,
      description: parsed.data.description || null,
      userId: session.user.id,
    },
    include: { category: true },
  });

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
  revalidatePath("/categories");

  return { data: transaction };
}