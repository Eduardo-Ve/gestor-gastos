"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check } from "lucide-react";
import { AuthDivider } from "@/components/auth/auth-divider";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export function LoginForm({ googleErrorMessage }: { googleErrorMessage?: string }) {
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

          <AuthDivider />
          <GoogleSignInButton errorMessage={googleErrorMessage} />

          <p className="text-center text-[13px] text-muted-foreground mt-5">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-foreground font-medium hover:opacity-80 underline">
              Regístrate gratis
            </Link>
          </p>

          <p className="text-center text-[11px] text-muted-foreground/60 mt-6">
            Al continuar aceptas nuestros{" "}
            <Link href="/terms" className="underline hover:text-muted-foreground">
              Términos de Servicio
            </Link>{" "}
            y nuestra{" "}
            <Link href="/privacy" className="underline hover:text-muted-foreground">
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}