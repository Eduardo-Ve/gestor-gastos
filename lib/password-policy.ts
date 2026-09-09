import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 72;
export const PASSWORD_REQUIREMENTS = [
  `Al menos ${PASSWORD_MIN_LENGTH} caracteres`,
  "Una letra mayúscula",
  "Una letra minúscula",
  "Un número",
  "Un carácter especial",
] as const;

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`)
  .max(PASSWORD_MAX_LENGTH, `La contraseña no puede superar los ${PASSWORD_MAX_LENGTH} caracteres`)
  .regex(/[A-Z]/, "La contraseña debe incluir una letra mayúscula")
  .regex(/[a-z]/, "La contraseña debe incluir una letra minúscula")
  .regex(/[0-9]/, "La contraseña debe incluir un número")
  .regex(/[^A-Za-z0-9]/, "La contraseña debe incluir un carácter especial");
