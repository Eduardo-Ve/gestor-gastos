import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import CategoriesClient from "./categories-client";

export default async function CategoriesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);

  const [categories, spentResult] = await Promise.all([
    prisma.category.findMany({ where: { userId } }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId, date: { gte: start } },
      _sum: { amount: true },
    }),
  ]);

  const spentByCategory = Object.fromEntries(
    spentResult.map((s) => [s.categoryId, s._sum.amount ?? 0])
  );

  return <CategoriesClient categories={categories} spentByCategory={spentByCategory} />;
}