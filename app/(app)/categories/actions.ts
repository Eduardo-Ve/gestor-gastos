"use server";

import { categorySchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: Record<string, unknown>) {
  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const session = await auth();
  if (!session?.user?.id) return { error: { general: ["No autorizado"] } };

  const category = await prisma.category.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/budgets");

  return { data: category };
}

export async function editCategory(id: string, formData: Record<string, unknown>) {
  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const session = await auth();
  if (!session?.user?.id) return { error: { general: ["No autorizado"] } };

  const existing = await prisma.category.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });

  if (!existing) return { error: { general: ["Categoría no encontrada"] } };

  const result = await prisma.category.updateMany({
    where: { id, userId: session.user.id },
    data: parsed.data,
  });

  if (result.count === 0) return { error: { general: ["Categoría no encontrada"] } };

  const updated = await prisma.category.findFirst({ where: { id, userId: session.user.id } });

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/budgets");

  return { data: updated };
}

export async function removeCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: { general: ["No autorizado"] } };

  const [transactionCount, budgetCount, fixedExpenseCount, creditCardPurchaseCount] = await Promise.all([
    prisma.transaction.count({ where: { categoryId: id, userId: session.user.id } }),
    prisma.budget.count({ where: { categoryId: id, userId: session.user.id } }),
    prisma.fixedExpense.count({ where: { categoryId: id, userId: session.user.id } }),
    prisma.creditCardPurchase.count({ where: { categoryId: id, userId: session.user.id } }),
  ]);

  if (transactionCount + budgetCount + fixedExpenseCount + creditCardPurchaseCount > 0) {
    return { error: { general: ["No puedes eliminar una categoría con movimientos asociados"] } };
  }

  const result = await prisma.category.deleteMany({
    where: { id, userId: session.user.id },
  });

  if (result.count === 0) return { error: { general: ["Categoría no encontrada"] } };

  revalidatePath("/categories");
  revalidatePath("/budgets");

  return { success: true };
}