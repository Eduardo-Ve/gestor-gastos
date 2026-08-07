"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function saveBudgetLimits(limits: Record<string, number>) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("No autenticado");

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const categoryIds = Object.keys(limits);

  // Solo se permiten categorías que sean del usuario logueado, para evitar
  // que alguien pise el presupuesto de otro usuario pasando un categoryId ajeno.
  const ownedCategories = await prisma.category.findMany({
    where: { id: { in: categoryIds }, userId },
    select: { id: true },
  });
  const ownedIds = new Set(ownedCategories.map((c: { id: string }) => c.id));

  await Promise.all(
    Object.entries(limits)
      .filter(([categoryId]) => ownedIds.has(categoryId))
      .map(([categoryId, limit]) =>
        prisma.budget.upsert({
          where: { categoryId_month_year: { categoryId, month, year } },
          update: { limit },
          create: { categoryId, userId, month, year, limit },
        })
      )
  );

  revalidatePath("/budgets");
}