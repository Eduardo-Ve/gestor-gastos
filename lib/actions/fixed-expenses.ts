"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const FixedExpenseSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(50),
  estimatedAmount: z.coerce.number().int().positive("El monto debe ser mayor a 0"),
  dayOfMonth: z.coerce.number().int().min(1).max(31),
  categoryId: z.string().min(1, "Selecciona una categoría"),
});
export async function createFixedExpense(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  const parsed = FixedExpenseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await prisma.fixedExpense.create({
    data: {
      description: parsed.data.name,
      amount: parsed.data.estimatedAmount,
      dueDay: parsed.data.dayOfMonth,
      categoryId: parsed.data.categoryId,
      userId: session.user.id,
    },
  });

  revalidatePath("/budgets/fixed-expenses");
  return { success: true };
}

export async function updateFixedExpense(id: string, input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  const parsed = FixedExpenseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await prisma.fixedExpense.update({
    where: { id, userId: session.user.id },
    data: {
      description: parsed.data.name,
      amount: parsed.data.estimatedAmount,
      dueDay: parsed.data.dayOfMonth,
      categoryId: parsed.data.categoryId,
    },
  });

  revalidatePath("/budgets/fixed-expenses");
  return { success: true };
}
export async function toggleFixedExpenseActive(id: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  await prisma.fixedExpense.update({
    where: { id, userId: session.user.id },
    data: { active: isActive },
  });

  revalidatePath("/budgets/fixed-expenses");
  return { success: true };
}

export async function deleteFixedExpense(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  await prisma.fixedExpense.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/budgets/fixed-expenses");
  return { success: true };
}
export async function toggleFixedExpensePaid(fixedExpenseId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  const fixedExpense = await prisma.fixedExpense.findUniqueOrThrow({
    where: { id: fixedExpenseId, userId: session.user.id },
  });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const existing = await prisma.transaction.findFirst({
    where: {
      fixedExpenseId,
      userId: session.user.id,
      date: { gte: startOfMonth, lte: endOfMonth },
    },
  });

  if (existing) {
    await prisma.transaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.transaction.create({
      data: {
        description: fixedExpense.description,
        amount: Number(fixedExpense.amount),
        type: "expense",
        paymentMethod: "other",
        date: new Date(),
        categoryId: fixedExpense.categoryId,
        userId: session.user.id,
        fixedExpenseId,
      },
    });
  }

  revalidatePath("/budgets/fixed-expenses");
  revalidatePath("/");
  return { success: true };
}