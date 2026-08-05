import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getDashboardSummary,
  getBudgetsWithSpent,
  getMonthlyEvolution,
  getRecentTransactions,
} from "@/lib/queries";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const [summary, budgets, monthly, recent] = await Promise.all([
    getDashboardSummary(userId),
    getBudgetsWithSpent(userId),
    getMonthlyEvolution(userId),
    getRecentTransactions(userId),
  ]);

  return (
    <DashboardClient summary={summary} budgets={budgets} monthly={monthly} recent={recent} />
  );
}