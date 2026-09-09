import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-5">
      <div className="w-full max-w-sm bg-card border border-border rounded-lg p-6">
        <h1 className="text-lg font-semibold">Recuperar contraseña</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
        </p>
        <ForgotPasswordForm />
        <Link href="/login" className="block text-center text-sm text-muted-foreground hover:text-foreground mt-5">
          Volver al inicio de sesión
        </Link>
      </div>
    </main>
  );
}
