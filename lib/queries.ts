import { prisma } from "@/lib/db";

export async function getDashboardSummary(userId: string) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: { userId, date: { gte: start, lt: end } },
    _sum: { amount: true },
  });

  const income = totals.find((t) => t.type === "income")?._sum.amount ?? 0;
  const expenses = totals.find((t) => t.type === "expense")?._sum.amount ?? 0;

  return { income, expenses, balance: income - expenses };
}

export async function getBudgetsWithSpent(userId: string) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const budgets = await prisma.budget.findMany({
    where: { userId, month, year },
    include: { category: true },
  });

  const spentByCategory = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: "expense", date: { gte: start, lt: end } },
    _sum: { amount: true },
  });

  return budgets.map((b) => ({
    ...b,
    spent: spentByCategory.find((s) => s.categoryId === b.categoryId)?._sum.amount ?? 0,
  }));
}

export async function getMonthlyEvolution(userId: string) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: start } },
    select: { amount: true, type: true, date: true },
  });

  const months: { mes: string; ingresos: number; gastos: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("es-CL", { month: "short" });
    const monthTxs = transactions.filter(
      (t) => t.date.getFullYear() === d.getFullYear() && t.date.getMonth() === d.getMonth()
    );
    months.push({
      mes: label.charAt(0).toUpperCase() + label.slice(1).replace(".", ""),
      ingresos: monthTxs.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0),
      gastos: monthTxs.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0),
    });
  }
  return months;
}

export async function getRecentTransactions(userId: string, take = 4) {
  return prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
    take,
  });
}
export async function getBudgetsPageData(userId: string) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const [categories, spentResult, recentTxs] = await Promise.all([
    prisma.category.findMany({
      where: { userId, type: "expense" },
      include: { budgets: { where: { month, year } } },
    }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId, type: "expense", date: { gte: start, lt: end } },
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({
      where: { userId, type: "expense", date: { gte: start, lt: end } },
      orderBy: { date: "desc" },
    }),
  ]);

  const spentMap = Object.fromEntries(spentResult.map((s) => [s.categoryId, s._sum.amount ?? 0]));

  const budgets = categories.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    color: c.color,
    limit: c.budgets[0]?.limit ?? 0,
    spent: spentMap[c.id] ?? 0,
  }));

  return { budgets, recentTxs };
}