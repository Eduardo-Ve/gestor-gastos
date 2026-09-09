"use server";

import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(72),
});

export type ResetPasswordState = {
  error?: string;
  success?: boolean;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function resetPassword(
  _previousState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const tokenRecord = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash: hashToken(parsed.data.token),
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: { id: true, userId: true },
  });

  if (!tokenRecord) {
    return { error: "El enlace no es válido o ya expiró. Solicita uno nuevo." };
  }

  const password = await bcrypt.hash(parsed.data.password, 10);

  await prisma.$transaction([
    prisma.user.update({ where: { id: tokenRecord.userId }, data: { password } }),
    prisma.passwordResetToken.update({ where: { id: tokenRecord.id }, data: { usedAt: new Date() } }),
    prisma.passwordResetToken.deleteMany({
      where: { userId: tokenRecord.userId, id: { not: tokenRecord.id } },
    }),
  ]);

  return { success: true };
}
