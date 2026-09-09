import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de Servicio — Tu Saldo",
  description: "Condiciones de uso de la aplicación Tu Saldo.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-800 dark:text-slate-100">
      <Link href="/login" className="mb-6 inline-block text-sm text-slate-500 underline hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        ← Volver a iniciar sesión
      </Link>
      <h1 className="mb-2 text-3xl font-bold">Términos de Servicio — Tu Saldo</h1>
      <p className="mb-10 text-sm text-slate-500 dark:text-slate-400">
        Última actualización: 9 de septiembre de 2026
      </p>

      <p className="mb-8">
        Al acceder o usar Tu Saldo (&quot;la aplicación&quot;), disponible en
        tusaldo.online, aceptas los siguientes Términos de Servicio. Si no estás de
        acuerdo con ellos, no debes usar la aplicación.
      </p>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">1. Descripción del servicio</h2>
        <p>
          Tu Saldo es una aplicación de gestión de finanzas personales que permite
          registrar transacciones, definir presupuestos, hacer seguimiento de
          tarjetas de crédito y gastos fijos. Es una herramienta de uso personal y
          no constituye asesoría financiera, contable ni legal.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">2. Cuentas de usuario</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Debes proporcionar información veraz al registrarte.</li>
          <li>
            Eres responsable de mantener la confidencialidad de tu contraseña y de
            toda la actividad que ocurra en tu cuenta.
          </li>
          <li>
            Debes notificarnos si detectas un uso no autorizado de tu cuenta.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">3. Uso aceptable</h2>
        <p className="mb-3">Te comprometes a no usar la aplicación para:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Actividades ilegales o fraudulentas.</li>
          <li>
            Intentar acceder sin autorización a cuentas de otras personas o a los
            sistemas de la aplicación.
          </li>
          <li>
            Cargar contenido malicioso o interferir con el funcionamiento normal
            del servicio.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">
          4. Naturaleza de los datos financieros
        </h2>
        <p>
          Toda la información financiera (transacciones, tarjetas, presupuestos)
          que registras es ingresada manualmente por ti. Tu Saldo no se conecta a
          bancos ni instituciones financieras, no verifica la exactitud de los
          datos ingresados, y no se hace responsable por decisiones financieras
          tomadas con base en la información registrada en la app.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">5. Disponibilidad del servicio</h2>
        <p>
          Hacemos un esfuerzo razonable por mantener la aplicación disponible, pero
          no garantizamos un funcionamiento ininterrumpido o libre de errores.
          Podemos suspender o modificar el servicio en cualquier momento, con o sin
          previo aviso.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">
          6. Limitación de responsabilidad
        </h2>
        <p>
          Tu Saldo se ofrece &quot;tal cual&quot;, sin garantías de ningún tipo. En
          la máxima medida permitida por la ley, no seremos responsables por daños
          indirectos, pérdida de datos o perjuicios derivados del uso o la
          imposibilidad de uso de la aplicación.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">7. Propiedad intelectual</h2>
        <p>
          El código, diseño y contenido de Tu Saldo son propiedad de su
          desarrollador. Los datos que tú ingresas siguen siendo tuyos; no
          reclamamos propiedad sobre tu información financiera personal.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">8. Terminación de cuenta</h2>
        <p>
          Puedes dejar de usar la aplicación y solicitar la eliminación de tu
          cuenta en cualquier momento. Nos reservamos el derecho de suspender
          cuentas que violen estos Términos.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">9. Cambios a estos Términos</h2>
        <p>
          Podemos actualizar estos Términos de Servicio ocasionalmente. El uso
          continuado de la aplicación después de un cambio implica la aceptación
          de los nuevos términos.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">10. Contacto</h2>
        <p>
          Para consultas sobre estos Términos de Servicio, escríbenos a:{" "}
          <a className="underline" href="mailto:contacto.eduardoa.v@gmail.com">
            contacto.eduardoa.v@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}