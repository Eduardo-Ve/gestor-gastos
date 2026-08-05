"use server";

import { categorySchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { addCategory, updateCategory, deleteCategory } from "@/lib/mock-store";
import { randomUUID } from "crypto";

export async function createCategory(formData: Record<string, unknown>) {
  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const session = await auth();
  if (!session?.user?.id) return { error: { general: ["No autorizado"] } };

  const category = addCategory({
    id: randomUUID(),
    ...parsed.data,
  });

  return { data: category };
}

export async function editCategory(id: string, formData: Record<string, unknown>) {
  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const session = await auth();
  if (!session?.user?.id) return { error: { general: ["No autorizado"] } };

  const updated = updateCategory(id, parsed.data);
  if (!updated) return { error: { general: ["Categoría no encontrada"] } };

  return { data: updated };
}

export async function removeCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: { general: ["No autorizado"] } };

  const result = deleteCategory(id);
  if ("error" in result) return { error: { general: [result.error] } };

  return { success: true };
}