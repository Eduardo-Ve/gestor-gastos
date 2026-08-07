// lib/avatar-icons.ts
import { User, Cat, Dog, Ghost, Rocket, Star, Heart, Bot, Smile, Sun } from "lucide-react";

export const AVATAR_ICONS = {
  user: User,
  cat: Cat,
  dog: Dog,
  ghost: Ghost,
  rocket: Rocket,
  star: Star,
  heart: Heart,
  bot: Bot,
  smile: Smile,
  sun: Sun,
} as const;


export const AVATAR_COLORS: Record<AvatarIconKey, string> = {
  user: "bg-slate-500",
  cat: "bg-orange-500",
  dog: "bg-amber-600",
  ghost: "bg-violet-500",
  rocket: "bg-sky-500",
  star: "bg-yellow-500",
  heart: "bg-rose-500",
  bot: "bg-teal-500",
  smile: "bg-lime-500",
  sun: "bg-fuchsia-500",
};

export type AvatarIconKey = keyof typeof AVATAR_ICONS;

const ICON_PREFIX = "icon:";

export function toIconSentinel(key: AvatarIconKey): string {
  return `${ICON_PREFIX}${key}`;
}

export function getAvatarIconKey(image: string | null | undefined): AvatarIconKey | null {
  if (!image || !image.startsWith(ICON_PREFIX)) return null;
  const key = image.slice(ICON_PREFIX.length);
  return key in AVATAR_ICONS ? (key as AvatarIconKey) : null;
}