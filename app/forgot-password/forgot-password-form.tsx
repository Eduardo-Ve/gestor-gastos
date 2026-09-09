"use client";

import { useActionState } from "react";
import { requestPasswordReset, type ForgotPasswordState } from "./actions";

const initialState: ForgotPasswordState = {};

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.error && <p className="text-xs text-rose-500">{state.error}</p>}
      {state.success && <p className="text-xs text-emerald-500">{state.success}</p>}
      <input
        name="email"
        type="email"
        placeholder="Correo electrónico"
        autoComplete="email"
        required
        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-primary-foreground text-sm font-medium py-2 rounded-md hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Enviar enlace"}
      </button>
    </form>
  );
}
