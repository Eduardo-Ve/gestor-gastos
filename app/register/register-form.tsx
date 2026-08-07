"use client";

import { useActionState } from "react";
import { register, type RegisterState } from "./actions";

const initialState: RegisterState = undefined;

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <form
      action={formAction}
      className="w-full max-w-sm bg-card border border-border rounded-lg p-6 flex flex-col gap-3"
    >
      <h1 className="text-lg font-semibold mb-2">Te damos la bienvenida</h1>

      {state?.error && <p className="text-xs text-rose-500">{state.error}</p>}

      <input
        name="name"
        placeholder="Tu nombre"
        className="bg-background border border-border rounded-md px-3 py-2 text-sm"
      />
      <input
        name="email"
        type="email"
        placeholder="Tu correo"
        required
        className="bg-background border border-border rounded-md px-3 py-2 text-sm"
      />
      <input
        name="password"
        type="password"
        placeholder="y una contraseña (mín. 6 caracteres)"
        required
        minLength={6}
        className="bg-background border border-border rounded-md px-3 py-2 text-sm"
      />

      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-primary-foreground text-sm font-medium py-2 rounded-md mt-2 hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Creando cuenta..." : "Crear cuenta"}
      </button>
            <div className="back"> <h2> <a href="/login" className="text-primary hover:underline">
        ← volver al  login
        </a></h2>

      </div>
    </form>
  );
}