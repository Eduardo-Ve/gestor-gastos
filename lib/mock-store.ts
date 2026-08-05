import type { Transaction } from "./types";
import { mockTransactions } from "./mock-data";

export const transactionStore: Transaction[] = [...mockTransactions];

export function addTransaction(transaction: Transaction) {
  transactionStore.unshift(transaction);
  return transaction;
}