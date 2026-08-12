-- RenameColumn: FixedExpense (preservando datos existentes)
ALTER TABLE "FixedExpense" RENAME COLUMN "name" TO "description";
ALTER TABLE "FixedExpense" RENAME COLUMN "dayOfMonth" TO "dueDay";
ALTER TABLE "FixedExpense" RENAME COLUMN "isActive" TO "active";

-- ChangeColumnType: estimatedAmount (Int) -> amount (Decimal)
ALTER TABLE "FixedExpense" RENAME COLUMN "estimatedAmount" TO "amount";
ALTER TABLE "FixedExpense" ALTER COLUMN "amount" TYPE DECIMAL(65,30) USING "amount"::decimal;

-- AlterTable: nueva columna
ALTER TABLE "FixedExpense" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "FixedExpensePayment" (
    "id" TEXT NOT NULL,
    "fixedExpenseId" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "transactionId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FixedExpensePayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FixedExpensePayment_transactionId_key" ON "FixedExpensePayment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "FixedExpensePayment_fixedExpenseId_period_key" ON "FixedExpensePayment"("fixedExpenseId", "period");

-- AddForeignKey
ALTER TABLE "FixedExpensePayment" ADD CONSTRAINT "FixedExpensePayment_fixedExpenseId_fkey" FOREIGN KEY ("fixedExpenseId") REFERENCES "FixedExpense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedExpensePayment" ADD CONSTRAINT "FixedExpensePayment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;