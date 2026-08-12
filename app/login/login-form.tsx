"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm bg-card border border-border rounded-lg p-6 flex flex-col gap-3">
        <h1 className="text-lg font-semibold mb-2">Iniciar sesión</h1>

        {error && <p className="text-xs text-rose-500">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input name="email" type="email" placeholder="Correo" required className="bg-background border border-border rounded-md px-3 py-2 text-sm" />
          <input name="password" type="password" placeholder="Contraseña" required className="bg-background border border-border rounded-md px-3 py-2 text-sm" />
          <button type="submit" className="btn-primary mt-1">
            Entrar
          </button>
        </form>

        <div className="flex items-center gap-2 my-1">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-muted-foreground">o</span>
          <div className="h-px bg-border flex-1" />
        </div>
            <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="border border-border text-sm font-medium py-2 rounded-md hover:bg-muted/40 flex items-center justify-center gap-2"
            >
            <svg width="18" height="18" viewBox="0 0 48 48" style={{ display: "block" }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continuar con Google
            </button>

        <p className="text-xs text-muted-foreground text-center mt-2">
          ¿No tienes cuenta? <Link href="/register" className="underline">Crear una</Link>
        </p>
      </div>
    </div>
  );
}