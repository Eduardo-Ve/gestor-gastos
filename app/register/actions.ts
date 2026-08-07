"use server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { seedDefaultCategories } from "@/lib/seed-categories";
export type RegisterState = { error?: string } | undefined;

export async function register(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ese correo ya está registrado" };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, name } });
  await seedDefaultCategories(user.id);
  redirect("/login");
}