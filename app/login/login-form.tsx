"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) setError("Correo o contraseña incorrectos");
    else router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-stretch md:items-center justify-center bg-background md:p-6">
      <div className="flex flex-col md:flex-row w-full max-w-[900px] md:min-h-[520px] bg-muted/20 md:border md:border-border md:rounded-2xl overflow-hidden">
        {/* Panel izquierdo: marketing */}
        <div className="flex-1 flex flex-col justify-center px-7 py-10 md:px-10 text-center md:text-left items-center md:items-start">
          <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-4">
            Finanzas personales
          </span>
          <h1 className="text-2xl md:text-[32px] font-medium leading-tight tracking-tight mb-4">
            Toma el control de tu dinero
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-[340px]">
            Registra tus gastos e ingresos, arma presupuestos por categoría y visualiza tu flujo mensual en un solo lugar.
          </p>
          <ul className="flex flex-col gap-3.5 items-center md:items-start">
            {[
              "Categorías y presupuestos personalizados",
              "Gastos fijos recurrentes automatizados",
              "Reportes mensuales de ingresos y gastos",
            ].map((text) => (
              <li key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-white" strokeWidth={3} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Panel derecho: formulario */}
        <div className="w-full md:w-[380px] px-7 py-8 md:px-9 md:py-12 bg-card md:border-l md:border-border flex flex-col justify-center">
          <h2 className="text-xl font-medium mb-1">Iniciar sesión</h2>
          <p className="text-sm text-muted-foreground mb-7">Ingresa para continuar</p>

          <form onSubmit={handleSubmit} autoComplete="on" className="flex flex-col">
            {error && <p className="text-xs text-rose-500 mb-3">{error}</p>}

            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                required
                autoComplete="email"
                className="w-full px-3.5 py-3.5 bg-background border border-border rounded-md text-[15px] outline-none transition-colors focus:border-border-hover focus:ring-2 focus:ring-white/5"
              />
            </div>

            <div className="relative mb-1.5">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                required
                autoComplete="current-password"
                className="w-full px-3.5 py-3.5 bg-background border border-border rounded-md text-[15px] outline-none transition-colors focus:border-border-hover focus:ring-2 focus:ring-white/5"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="text-right mb-4">
              <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-foreground text-background rounded-md text-[15px] font-medium hover:opacity-90 active:scale-[0.985] transition-all"
            >
              Continuar
            </button>
          </form>

          <div className="flex items-center gap-3 my-5 text-xs font-medium text-muted-foreground/50">
            <div className="h-px bg-border flex-1" />
            o
            <div className="h-px bg-border flex-1" />
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full py-3 border border-border rounded-md text-sm font-medium text-muted-foreground flex items-center justify-center gap-2.5 hover:border-border-hover hover:bg-white/[0.02] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" style={{ display: "block" }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continuar con Google
          </button>

          <p className="text-center text-[13px] text-muted-foreground mt-5">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-foreground font-medium hover:opacity-80 underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}