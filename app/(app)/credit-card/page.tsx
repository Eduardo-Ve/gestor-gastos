import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserCreditCards, getCreditCardPageData, getExpenseCategories } from "@/lib/queries";
import CreditCardClient from "./credit-card-client";

export default async function CreditCardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const cards = (await getUserCreditCards(userId)).map((card) => ({
    ...card,
    cardLimit: Number(card.cardLimit.toString()),
  }));

  if (cards.length === 0) {
    return <CreditCardClient cards={[]} pageDataByCard={{}} categories={[]} />;
  }

  const [pageDataList, categories] = await Promise.all([
    Promise.all(cards.map((c) => getCreditCardPageData(userId, c.id))),
    getExpenseCategories(userId),
  ]);

  const pageDataByCard = Object.fromEntries(pageDataList.map((pd) => [pd.card.id, pd]));

  return <CreditCardClient cards={cards} pageDataByCard={pageDataByCard} categories={categories} />;
}