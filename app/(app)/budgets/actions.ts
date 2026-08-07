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

  await Promise.all(
    Object.entries(limits).map(([categoryId, limit]) =>
      prisma.budget.upsert({
        where: { categoryId_month_year: { categoryId, month, year } },
        update: { limit },
        create: { categoryId, userId, month, year, limit },
      })
    )
  );

  revalidatePath("/budgets");
}