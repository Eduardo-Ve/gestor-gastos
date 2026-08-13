import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserCreditCards, getCreditCardPageData, getExpenseCategories } from "@/lib/queries";
import CreditCardClient from "./credit-card-client";

export default async function CreditCardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const cards = (await getUserCreditCards(session.user.id)).map((card) => ({
    ...card,
    cardLimit: Number(card.cardLimit.toString()),
  }));

  if (cards.length === 0) {
    return <CreditCardClient cards={[]} pageData={null} categories={[]} />;
  }

  const [pageData, categories] = await Promise.all([
    getCreditCardPageData(session.user.id, cards[0].id),
    getExpenseCategories(session.user.id),
  ]);

  return <CreditCardClient cards={cards} pageData={pageData} categories={categories} />;
}