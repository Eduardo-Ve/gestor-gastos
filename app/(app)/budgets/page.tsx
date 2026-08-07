import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBudgetsPageData } from "@/lib/queries";
import BudgetsClient from "./budgets-client";

export default async function BudgetsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { budgets, recentTxs } = await getBudgetsPageData(session.user.id);

  return <BudgetsClient budgets={budgets} recentTxs={recentTxs} />;
}