import {
  Utensils, Car, Film, HeartPulse, GraduationCap, Home,
  ShoppingBag, Plane, Gift, Smartphone, Dumbbell, Wallet,
  Briefcase, TrendingUp, Circle, type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Utensils, Car, Film, HeartPulse, GraduationCap, Home,
  ShoppingBag, Plane, Gift, Smartphone, Dumbbell, Wallet,
  Briefcase, TrendingUp,
};

// Para el selector visual del formulario
export const ICON_OPTIONS = Object.keys(ICON_MAP);

export function getCategoryIcon(key: string): LucideIcon {
  return ICON_MAP[key] ?? Circle;
}

// Paleta fija — evita que el usuario elija colores que no combinan con el resto de la UI
export const COLOR_OPTIONS = [
  "#f43f5e", // rose
  "#f97316", // orange
  "#f59e0b", // amber
  "#10b981", // emerald
  "#14b8a6", // teal
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#0ea5e9", // sky
];