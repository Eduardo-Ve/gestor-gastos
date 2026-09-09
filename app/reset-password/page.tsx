import Link from "next/link";
import { ResetPasswordForm } from "./reset-password-form";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-5">
      <div className="w-full max-w-sm bg-card border border-border rounded-lg p-6">
        <h1 className="text-lg font-semibold">Crear nueva contraseña</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Elige una contraseña nueva para volver a entrar a tu cuenta.
        </p>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p className="text-sm text-rose-500">El enlace de recuperación no es válido.</p>
        )}
        <Link href="/login" className="block text-center text-sm text-muted-foreground hover:text-foreground mt-5">
          Volver al inicio de sesión
        </Link>
      </div>
    </main>
  );
}
