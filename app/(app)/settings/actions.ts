"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { toIconSentinel, getAvatarIconKey, type AvatarIconKey } from "@/lib/avatar-icons";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");
  return session.user.id;
}

export async function getProfile() {
  const userId = await requireUserId();

  const [user, googleAccount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, password: true },
    }),
    prisma.account.findFirst({ where: { userId, provider: "google" } }),
  ]);

  if (!user) throw new Error("Usuario no encontrado");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    hasPassword: !!user.password,
    hasGoogleAccount: !!googleAccount,
    selectedIcon: getAvatarIconKey(user.image),
  };
}

export async function updateProfile(data: { name: string; avatarIcon: AvatarIconKey | null }) {
  const userId = await requireUserId();

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      // avatarIcon null significa "no tocar el avatar" (dejar la foto de Google tal cual está, o el que ya tenía)
      ...(data.avatarIcon ? { image: toIconSentinel(data.avatarIcon) } : {}),
    },
  });

  revalidatePath("/settings");
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  const userId = await requireUserId();

  if (data.newPassword.length < 8) {
    throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Usuario no encontrado");

  if (user.password) {
    const valid = await bcrypt.compare(data.currentPassword, user.password);
    if (!valid) throw new Error("La contraseña actual es incorrecta");
  }

  const hashed = await bcrypt.hash(data.newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
}