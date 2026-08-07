// app/(auth)/login/page.tsx
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
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
          <button type="submit" className="bg-primary text-primary-foreground text-sm font-medium py-2 rounded-md mt-1">
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
          className="border border-border text-sm font-medium py-2 rounded-md hover:bg-muted/40"
        >
          Continuar con Google
        </button>

        <p className="text-xs text-muted-foreground text-center mt-2">
          ¿No tienes cuenta? <Link href="/register" className="underline">Crear una</Link>
        </p>
      </div>
    </div>
  );
}