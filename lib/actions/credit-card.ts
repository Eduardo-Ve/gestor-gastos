"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { calculateInstallmentAmount, getBillingPeriodForDate } from "@/lib/credit-card-math";
import { revalidatePath } from "next/cache";
import { z } from "zod";


export async function createCreditCardPurchase(input: {
  cardId: string;
  description: string;
  totalAmount: number;
  installmentsCount: number;
  monthlyInterestRate: number;
  categoryId: string;
  purchaseDate: Date;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  const userId = session.user.id;

  if (input.totalAmount <= 0) {
    return { success: false, error: "El monto debe ser mayor a 0" };
  }

  const installmentAmount = calculateInstallmentAmount(
    input.totalAmount,
    input.monthlyInterestRate,
    input.installmentsCount
  );

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Traer la tarjeta y validar que sea del usuario
      const card = await tx.creditCard.findFirst({
        where: { id: input.cardId, userId },
      });

      if (!card) {
        throw new Error("Tarjeta no encontrada");
      }

      // 2. Calcular cupo usado: suma de cuotas NO pagadas de todas
      // las compras activas de esta tarjeta (eso es lo que compromete cupo)
      const pending = await tx.creditCardInstallment.aggregate({
        where: {
          purchase: { cardId: input.cardId },
          paid: false,
        },
        _sum: { amount: true },
      });

      const cupoUsado = pending._sum.amount ?? 0;
      const cupoDisponible = Number(card.cardLimit) - Number(cupoUsado);

      // 3. Validar contra el monto total de la nueva compra
      if (input.totalAmount > cupoDisponible) {
        throw new Error(
          `Cupo insuficiente. Disponible: $${cupoDisponible.toLocaleString("es-CL")}`
        );
      }

      // 4. Crear la compra
      const purchase = await tx.creditCardPurchase.create({
        data: {
          description: input.description,
          totalAmount: input.totalAmount,
          installmentsCount: input.installmentsCount,
          monthlyInterestRate: input.monthlyInterestRate,
          purchaseDate: input.purchaseDate,
          categoryId: input.categoryId,
          cardId: input.cardId,
          userId,
        },
      });

      const installmentsData = Array.from({ length: input.installmentsCount }, (_, i) => {
        const billingPeriod = new Date(input.purchaseDate);
        billingPeriod.setMonth(billingPeriod.getMonth() + i + 1);
        billingPeriod.setDate(1);

        return {
          purchaseId: purchase.id,
          installmentNumber: i + 1,
          amount: installmentAmount,
          billingPeriod,
        };
      });

      await tx.creditCardInstallment.createMany({ data: installmentsData });
    });

    revalidatePath("/credit-card");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Ocurrió un error al guardar la compra" };
  }
}

const CreditCardSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(50),
  cardLimit: z.coerce.number().positive("El cupo debe ser mayor a 0"),
  closingDay: z.coerce.number().int().min(1).max(31),
  dueDay: z.coerce.number().int().min(1).max(31),
});

export async function createCreditCard(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  const parsed = CreditCardSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await prisma.creditCard.create({
    data: {
      name: parsed.data.name,
      cardLimit: parsed.data.cardLimit,
      closingDay: parsed.data.closingDay,
      dueDay: parsed.data.dueDay,
      userId: session.user.id,
    },
  });

  revalidatePath("/credit-card");
  return { success: true };
}

export async function toggleInstallmentPaid(installmentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  const userId = session.user.id;

  const installment = await prisma.creditCardInstallment.findUniqueOrThrow({
    where: { id: installmentId },
    include: { purchase: true },
  });

  if (installment.purchase.userId !== userId) throw new Error("No autorizado");

  if (installment.paid && installment.transactionId) {
    await prisma.$transaction([
      prisma.creditCardInstallment.update({
        where: { id: installmentId },
        data: { paid: false, transactionId: null },
      }),
      prisma.transaction.delete({ where: { id: installment.transactionId } }),
    ]);
  } else {
    await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          description: `${installment.purchase.description} (cuota ${installment.installmentNumber}/${installment.purchase.installmentsCount})`,
          amount: Number(installment.amount),
          type: "expense",
          paymentMethod: "credit",
          date: new Date(),
          categoryId: installment.purchase.categoryId,
          userId,
        },
      });

      await tx.creditCardInstallment.update({
        where: { id: installmentId },
        data: { paid: true, transactionId: transaction.id },
      });
    });
  }

  revalidatePath("/credit-card");
  revalidatePath("/");
  return { success: true };
}