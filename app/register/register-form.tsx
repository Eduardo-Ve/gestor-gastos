"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, LockKeyhole, Mail, UserRound } from "lucide-react";
import { register, type RegisterState } from "./actions";

const initialState: RegisterState = undefined;

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <div className="flex flex-col md:flex-row w-full max-w-[900px] md:min-h-[520px] bg-muted/20 md:border md:border-border md:rounded-2xl overflow-hidden">
      <div className="flex-1 flex flex-col justify-center px-7 py-10 md:px-10 text-center md:text-left items-center md:items-start">
        <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-4">
          Finanzas personales
        </span>
        <h1 className="text-2xl md:text-[32px] font-medium leading-tight tracking-tight mb-4">
          Empieza a ordenar tus finanzas
        </h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-[340px]">
          Crea tu cuenta y lleva el control de tus movimientos, presupuestos y gastos recurrentes.
        </p>
        <ul className="flex flex-col gap-3.5 items-center md:items-start">
          {["Configuración rápida y simple", "Presupuestos por categoría", "Tus datos protegidos"].map((text) => (
            <li key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                <Check size={11} className="text-white" strokeWidth={3} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full md:w-[380px] px-7 py-8 md:px-9 md:py-12 bg-card md:border-l md:border-border flex flex-col justify-center">
        <h2 className="text-xl font-medium mb-1">Crear cuenta</h2>
        <p className="text-sm text-muted-foreground mb-7">Configura tu espacio financiero</p>

        <form action={formAction} autoComplete="on" className="flex flex-col gap-4">
          {state?.error && (
            <p role="alert" className="text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-md px-3 py-2">
              {state.error}
            </p>
          )}

          <label className="relative block">
            <span className="sr-only">Nombre</span>
            <UserRound size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
            <input
              name="name"
              placeholder="Tu nombre"
              autoComplete="name"
              className="w-full pl-10 pr-3.5 py-3.5 bg-background border border-border rounded-md text-[15px] outline-none transition-colors focus:border-border-hover focus:ring-2 focus:ring-white/5"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Correo electrónico</span>
            <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              autoComplete="email"
              required
              className="w-full pl-10 pr-3.5 py-3.5 bg-background border border-border rounded-md text-[15px] outline-none transition-colors focus:border-border-hover focus:ring-2 focus:ring-white/5"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Contraseña</span>
            <LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
            <input
              name="password"
              type="password"
              placeholder="Contraseña (mín. 6 caracteres)"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full pl-10 pr-3.5 py-3.5 bg-background border border-border rounded-md text-[15px] outline-none transition-colors focus:border-border-hover focus:ring-2 focus:ring-white/5"
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-foreground text-background rounded-md text-[15px] font-medium hover:opacity-90 active:scale-[0.985] transition-all disabled:opacity-50"
          >
            {isPending ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <Link href="/login" className="flex items-center justify-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground mt-5 transition-colors">
          <ArrowLeft size={14} /> Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}