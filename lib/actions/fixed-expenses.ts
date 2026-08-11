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
      ...parsed.data,
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
    data: parsed.data,
  });

  revalidatePath("/budgets/fixed-expenses");
  return { success: true };
}

export async function toggleFixedExpenseActive(id: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  await prisma.fixedExpense.update({
    where: { id, userId: session.user.id },
    data: { isActive },
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