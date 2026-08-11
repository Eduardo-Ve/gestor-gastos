-- AlterTable
ALTER TABLE "Budget" ALTER COLUMN "limit" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fixedExpenseId" TEXT;

-- CreateTable
CREATE TABLE "FixedExpense" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "estimatedAmount" INTEGER NOT NULL,
    "dayOfMonth" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FixedExpense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FixedExpense_userId_idx" ON "FixedExpense"("userId");

-- CreateIndex
CREATE INDEX "Transaction_fixedExpenseId_idx" ON "Transaction"("fixedExpenseId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fixedExpenseId_fkey" FOREIGN KEY ("fixedExpenseId") REFERENCES "FixedExpense"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedExpense" ADD CONSTRAINT "FixedExpense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedExpense" ADD CONSTRAINT "FixedExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
