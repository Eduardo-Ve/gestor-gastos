"use server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { seedDefaultCategories } from "@/lib/seed-categories";
import { passwordSchema } from "@/lib/password-policy";
export type RegisterState = { error?: string } | undefined;

export async function register(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const passwordResult = passwordSchema.safeParse(password);
  if (!passwordResult.success) {
    return { error: passwordResult.error.issues[0]?.message ?? "La contraseña no cumple los requisitos" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ese correo ya está registrado" };
  }

  const hashed = await bcrypt.hash(passwordResult.data, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, name } });
  await seedDefaultCategories(user.id);
  redirect("/login");
}