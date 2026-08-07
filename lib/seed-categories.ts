import { prisma } from "@/lib/db";
import { DEFAULT_CATEGORIES } from "@/lib/default-categories";

export async function seedDefaultCategories(userId: string) {
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((c) => ({ ...c, userId })),
  });
}