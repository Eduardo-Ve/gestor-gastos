"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword, type ResetPasswordState } from "./actions";

const initialState: ResetPasswordState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(resetPassword, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-emerald-500">Tu contraseña fue actualizada correctamente.</p>
        <Link href="/login" className="text-sm text-foreground underline hover:opacity-80">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="token" value={token} />
      {state.error && <p className="text-xs text-rose-500">{state.error}</p>}
      <input
        name="password"
        type="password"
        placeholder="Nueva contraseña"
        autoComplete="new-password"
        minLength={6}
        required
        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-primary-foreground text-sm font-medium py-2 rounded-md hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Actualizando..." : "Guardar contraseña"}
      </button>
    </form>
  );
}
