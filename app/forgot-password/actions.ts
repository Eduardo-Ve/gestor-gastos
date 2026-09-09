"use server";

import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ingresa un correo válido"),
});

export type ForgotPasswordState = {
  error?: string;
  success?: string;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(
  _previousState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ingresa un correo válido" };
  }

  const successMessage = "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.";
  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, email: true, password: true },
  });

  if (!user?.password) {
    return { success: successMessage };
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const resetUrl = `${appUrl.replace(/\/$/, "")}/reset-password?token=${rawToken}`;

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetToken.create({ data: { tokenHash, userId: user.id, expiresAt } }),
  ]);

  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch (error) {
    console.error("No se pudo enviar el correo de recuperación", error);
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    if (process.env.NODE_ENV !== "production") {
      return {
        error: error instanceof Error ? error.message : "No se pudo enviar el correo",
      };
    }
  }

  return { success: successMessage };
}
