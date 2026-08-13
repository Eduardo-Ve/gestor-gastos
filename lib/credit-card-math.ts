export function calculateInstallmentAmount(
  principal: number,
  monthlyRate: number,
  installments: number
): number {
  if (monthlyRate === 0) {
    return principal / installments;
  }
  const factor = monthlyRate / (1 - Math.pow(1 + monthlyRate, -installments));
  return principal * factor;
}

export function getBillingPeriodForDate(purchaseDate: Date, closingDay: number): Date {
  const day = purchaseDate.getDate();
  let billingMonth = purchaseDate.getMonth();
  let billingYear = purchaseDate.getFullYear();

  if (day > closingDay) {
    billingMonth += 1;
    if (billingMonth > 11) {
      billingMonth = 0;
      billingYear += 1;
    }
  }

  return new Date(billingYear, billingMonth, 1);
}