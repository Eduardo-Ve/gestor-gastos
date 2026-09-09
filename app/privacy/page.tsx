import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — Tu Saldo",
  description: "Cómo Tu Saldo recopila, usa y protege tu información.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-slate-800 dark:text-slate-100">
      <h1 className="mb-2 text-3xl font-bold">Política de Privacidad — Tu Saldo</h1>
      <p className="mb-10 text-sm text-slate-500 dark:text-slate-400">
        Última actualización: 9 de septiembre de 2026
      </p>

      <p className="mb-8">
        Esta Política de Privacidad describe cómo Tu Saldo (&quot;la aplicación&quot;,
        &quot;nosotros&quot;) recopila, usa y protege la información de las personas
        usuarias que acceden a través de finanzas.devportftool.dpdns.org.
      </p>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">1. Información que recopilamos</h2>
        <p className="mb-3">
          Al crear una cuenta y usar la aplicación, podemos recopilar:
        </p>
        <ul className="mb-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Datos de cuenta</strong>: nombre, correo electrónico y foto de
            perfil, obtenidos directamente si te registras con correo y contraseña,
            o a través de tu cuenta de Google si eliges &quot;Iniciar sesión con
            Google&quot;.
          </li>
          <li>
            <strong>Datos financieros que tú ingresas voluntariamente</strong>:
            transacciones, categorías de gasto, presupuestos, tarjetas de crédito y
            sus movimientos, gastos fijos, y cualquier otro dato que registres
            dentro de la app para llevar tu control financiero personal.
          </li>
          <li>
            <strong>Datos técnicos básicos</strong>: información de sesión
            necesaria para mantenerte conectado de forma segura (cookies de
            autenticación).
          </li>
        </ul>
        <p>
          No recopilamos ni solicitamos números de tarjeta reales, claves
          bancarias, ni credenciales de acceso a tus cuentas bancarias. Los
          &quot;montos&quot; y &quot;tarjetas&quot; que registras son datos que tú
          ingresas manualmente para tu propio seguimiento; la aplicación no se
          conecta a instituciones financieras.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">2. Cómo usamos tu información</h2>
        <p className="mb-3">Usamos la información recopilada exclusivamente para:</p>
        <ul className="mb-3 list-disc space-y-2 pl-6">
          <li>Permitirte iniciar sesión y acceder a tu cuenta de forma segura.</li>
          <li>
            Mostrar, calcular y organizar tus datos financieros dentro de la
            aplicación (presupuestos, gráficos, resúmenes).
          </li>
          <li>
            Enviar notificaciones o resúmenes relacionados con tu actividad dentro
            de la app, si esa función está habilitada.
          </li>
          <li>Mejorar el funcionamiento y la seguridad del servicio.</li>
        </ul>
        <p>
          No vendemos, alquilamos ni compartimos tu información personal o
          financiera con terceros con fines publicitarios o comerciales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">3. Autenticación con Google</h2>
        <p>
          Si eliges iniciar sesión con Google, solicitamos acceso únicamente a tu
          nombre, correo electrónico y foto de perfil públicos, con el único fin de
          crear y autenticar tu cuenta. No accedemos a tu Gmail, Google Drive,
          contactos, ni ningún otro servicio de Google.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">4. Almacenamiento y seguridad</h2>
        <p>
          Tus datos se almacenan en una base de datos administrada (PostgreSQL en
          Neon), con conexión cifrada. Las contraseñas se almacenan utilizando
          métodos de hash seguros y nunca en texto plano. Tomamos medidas
          razonables para proteger tu información, aunque ningún sistema es 100%
          infalible.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">
          5. Retención y eliminación de datos
        </h2>
        <p>
          Conservamos tu información mientras tu cuenta permanezca activa. Si
          deseas eliminar tu cuenta y todos los datos asociados, puedes
          solicitarlo escribiendo a{" "}
          <a className="underline" href="mailto:contacto.eduardoa.v@gmail.com">
            contacto.eduardoa.v@gmail.com
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">6. Tus derechos</h2>
        <p className="mb-3">
          Puedes acceder, corregir o eliminar tus datos personales en cualquier
          momento desde la configuración de tu cuenta, o contactándonos
          directamente.
        </p>
        <p className="mb-3">
          Actualmente estos derechos están reconocidos por la Ley N° 19.628 sobre
          Protección de la Vida Privada de Chile. A partir del 1 de diciembre de
          2026 entra en vigencia la Ley N° 21.719, que reemplaza a la Ley 19.628,
          amplía tus derechos (acceso, rectificación, cancelación, oposición y
          portabilidad de tus datos) y crea la Agencia de Protección de Datos
          Personales como organismo fiscalizador.
        </p>
        <p>
          Nos comprometemos a adecuar nuestras prácticas de tratamiento de datos a
          la Ley 21.719 dentro de los plazos que ésta establezca.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">7. Cambios a esta política</h2>
        <p>
          Podemos actualizar esta Política de Privacidad ocasionalmente.
          Notificaremos cambios relevantes a través de la aplicación o por correo
          electrónico.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">8. Contacto</h2>
        <p>
          Si tienes preguntas sobre esta Política de Privacidad, puedes
          contactarnos en:{" "}
          <a className="underline" href="mailto:contacto.eduardoa.v@gmail.com">
            contacto.eduardoa.v@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}