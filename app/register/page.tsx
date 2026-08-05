import { register } from "./actions";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <form action={register} className="w-full max-w-sm bg-card border border-border rounded-lg p-6 flex flex-col gap-3">
        <h1 className="text-lg font-semibold mb-2">Crear cuenta (test)</h1>

        <input
          name="name"
          placeholder="Nombre"
          className="bg-background border border-border rounded-md px-3 py-2 text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Correo"
          required
          className="bg-background border border-border rounded-md px-3 py-2 text-sm"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña (mín. 6 caracteres)"
          required
          minLength={6}
          className="bg-background border border-border rounded-md px-3 py-2 text-sm"
        />

        <button
          type="submit"
          className="bg-primary text-primary-foreground text-sm font-medium py-2 rounded-md mt-2 hover:opacity-90"
        >
          Crear cuenta
        </button>
      </form>
    </div>
  );
}