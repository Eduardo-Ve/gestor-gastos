import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFixedExpensesPageData } from "@/lib/queries";
import FixedExpensesClient from "./fixed-expenses-client";

export default async function FixedExpensesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { fixedExpenses, categories } = await getFixedExpensesPageData(session.user.id);

  return <FixedExpensesClient fixedExpenses={fixedExpenses} categories={categories} />;
}