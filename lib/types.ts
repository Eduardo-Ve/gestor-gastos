export type Transaction = {
  id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  categoryId: string;
  date: Date;
  description?: string;
  paymentMethod: "cash" | "debit" | "credit" | "transfer";
};

export type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
};