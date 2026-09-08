import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wallet, Receipt, PiggyBank, Repeat, CreditCard, ShieldCheck, Lock, KeyRound } from "lucide-react";
import { MobileNav } from "@/components/ui/landing/mobile-nav";
import { DashboardMockup, CreditCardMockup } from "@/components/ui/landing/mockups";

// TODO: reemplazar por el dominio real cuando esté disponible
const SITE_URL = "https://finanzas-app.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Finanzas — Controla tus gastos, presupuestos y cuotas en un solo lugar",
  description:
    "Registra tus movimientos, arma presupuestos por categoría y no pierdas de vista tus gastos fijos ni las cuotas de tu tarjeta de crédito. Gratis para empezar.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Finanzas — Controla tus gastos, presupuestos y cuotas en un solo lugar",
    description:
      "Registra tus movimientos, arma presupuestos por categoría y no pierdas de vista tus gastos fijos ni las cuotas de tu tarjeta.",
    url: "/",
    siteName: "Finanzas",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finanzas — Controla tus gastos, presupuestos y cuotas",
    description: "Registra tus movimientos y presupuestos, y trackea tus cuotas. Gratis para empezar.",
  },
};

const faqs = [
  {
    q: "¿Es gratis?",
    a: "Sí, crear una cuenta y usar las funciones principales (movimientos, presupuestos, gastos fijos y tarjeta de crédito) no tiene costo.",
  },
  {
    q: "¿Necesito ingresar los datos completos de mi tarjeta de crédito?",
    a: "No. Solo pedimos el nombre de la tarjeta, el cupo y las fechas de cierre y vencimiento para poder trackear tus cuotas. Nunca el número de tarjeta ni el CVV.",
  },
  {
    q: "¿Puedo usarla desde el celular?",
    a: "Sí, la aplicación funciona desde el navegador de tu teléfono sin instalar nada.",
  },
  {
    q: "¿Sirve si ya llevo mis gastos en una planilla?",
    a: "La diferencia es que acá los presupuestos y gastos fijos se actualizan solos con cada movimiento que registras, sin fórmulas que mantener a mano.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Finanzas",
        url: SITE_URL,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />


      <a
        href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#22C55E] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#0A0A0B]"
      >
      Saltar al contenido principal
      </a>

      <div className="min-h-screen bg-[#0A0A0B] text-[#F2F2F3]">
        <Header />
        <main id="main-content">
          <Hero />
          <ProblemSolution />
          <Features />
          <HowItWorks />
          <Spotlight />
          <Security />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </>
  );
}

/* ---------- Header ---------- */

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1E1E21] bg-[#0A0A0B]/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F2F2F3] text-[#0A0A0B]">
            <Wallet className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-semibold">Finanzas</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 sm:flex">
          <a href="#beneficios" className="text-sm text-[#9195A0] transition-colors hover:text-[#F2F2F3]">
            Beneficios
          </a>
          <a href="#como-funciona" className="text-sm text-[#9195A0] transition-colors hover:text-[#F2F2F3]">
            Cómo funciona
          </a>
          <a href="#seguridad" className="text-sm text-[#9195A0] transition-colors hover:text-[#F2F2F3]">
            Seguridad
          </a>
          <a href="#faq" className="text-sm text-[#9195A0] transition-colors hover:text-[#F2F2F3]">
            Preguntas frecuentes
          </a>
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          <Link
            href="/login"
            className="rounded-sm text-sm text-[#9195A0] transition-colors hover:text-[#F2F2F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-[#F2F2F3] px-4 py-2 text-sm font-medium text-[#0A0A0B] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]"
          >
            Crear cuenta
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}


function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-28">
      <div className="opacity-0 motion-safe:animate-[fadeUp_0.6s_ease-out_forwards]">
        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Sabes en qué se te fue la plata, antes de que se te vuelva a ir.
        </h1>
        <p className="mt-5 max-w-md text-lg text-[#9195A0]">
          Registra tus movimientos, arma presupuestos por categoría y no pierdas de vista los gastos fijos ni las
          cuotas de la tarjeta. Todo en un solo lugar.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/register"
            className="rounded-md bg-[#22C55E] px-5 py-3 text-sm font-medium text-[#0A0A0B] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B]"
          >
            Crear cuenta gratis
          </Link>
          <Link
            href="/login"
            className="rounded-sm text-sm font-medium text-[#F2F2F3] underline decoration-[#232327] underline-offset-4 transition-colors hover:decoration-[#F2F2F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>

      <div className="opacity-0 motion-safe:animate-[fadeUp_0.6s_ease-out_0.15s_forwards]" aria-hidden="true">
        <DashboardMockup />
      </div>
    </section>
  );
}

/* ---------- Problema / Solución ---------- */

function ProblemSolution() {
  return (
    <section className="border-t border-[#1E1E21] px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Llevar la cuenta a mano no funciona</h2>
          <p className="mt-4 text-[#9195A0]">
            Una planilla se desordena a la segunda semana. La app del banco solo muestra tu tarjeta, no tus otros
            gastos. Y las cuotas de distintas compras se pierden entre cartolas mensuales que hay que revisar una por
            una.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Finanzas junta todo eso en un solo lugar</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#9195A0]">
            <li>— Un resumen que se actualiza solo con cada movimiento que registras.</li>
            <li>— Presupuestos por categoría, sin fórmulas que mantener.</li>
            <li>— Gastos fijos y cuotas de tarjeta, visibles antes de que lleguen.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Beneficios ---------- */

function Features() {
  const items = [
    {
      icon: <Receipt className="h-5 w-5" aria-hidden="true" />,
      title: "Movimientos",
      desc: "Todo tu historial de ingresos y gastos, filtrable por tipo y categoría.",
    },
    {
      icon: <PiggyBank className="h-5 w-5" aria-hidden="true" />,
      title: "Presupuestos",
      desc: "Define un límite por categoría y mira el avance en tiempo real.",
    },
    {
      icon: <Repeat className="h-5 w-5" aria-hidden="true" />,
      title: "Gastos fijos",
      desc: "Arriendo, servicios, suscripciones: todo lo que se repite cada mes, en un solo lugar.",
    },
    {
      icon: <CreditCard className="h-5 w-5" aria-hidden="true" />,
      title: "Tarjeta de crédito",
      desc: "Trackea tus compras en cuotas sin perderte entre el estado de cuenta.",
    },
  ];

  return (
    <section id="beneficios" className="border-t border-[#1E1E21] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-semibold tracking-tight">Todo lo que necesitas para ordenar tu plata</h2>
        <ul className="mt-8 divide-y divide-[#1E1E21] border-y border-[#1E1E21]">
          {items.map((item) => (
            <li key={item.title} className="flex items-start gap-4 py-6 sm:items-center">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-[#232327] bg-[#151517]">
                {item.icon}
              </span>
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-1 text-sm text-[#9195A0]">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Cómo funciona ---------- */

function HowItWorks() {
  const steps = [
    { title: "Crea tu cuenta", desc: "Regístrate con tu correo o Google en menos de un minuto." },
    { title: "Registra tus movimientos", desc: "Anota ingresos y gastos a medida que ocurren, por categoría." },
    {
      title: "Revisa tu resumen",
      desc: "Mira cuánto te queda, en qué se te fue la plata y qué presupuestos se están pasando.",
    },
  ];

  return (
    <section id="como-funciona" className="border-t border-[#1E1E21] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-semibold tracking-tight">Cómo funciona</h2>
        <ol className="mt-10 grid gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#232327] text-sm font-semibold">
                {i + 1}
              </div>
              <h3 className="mt-4 font-medium">{step.title}</h3>
              <p className="mt-1.5 text-sm text-[#9195A0]">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Sección destacada: cuotas ---------- */

function Spotlight() {
  return (
    <section className="border-t border-[#1E1E21] px-6 py-20">
      <article className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="order-2 lg:order-1">
          <CreditCardMockup />
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-2xl font-semibold tracking-tight">Todas tus cuotas, en un solo lugar</h2>
          <p className="mt-4 text-[#9195A0]">
            Cada compra en cuotas queda registrada con su avance: cuánto llevas pagado, cuánto te falta y cuánto
            representa en tu presupuesto del mes. Nada de sumar cartolas a mano.
          </p>
        </div>
      </article>
    </section>
  );
}

/* ---------- Seguridad ---------- */

function Security() {
  const points = [
    {
      icon: <Lock className="h-5 w-5" aria-hidden="true" />,
      title: "Nunca pedimos tu número de tarjeta",
      desc: "Para trackear tus cuotas solo necesitamos el nombre, el cupo y las fechas de cierre y vencimiento.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
      title: "Tus datos son tuyos",
      desc: "No compartimos ni vendemos tu información financiera a terceros.",
    },
    {
      icon: <KeyRound className="h-5 w-5" aria-hidden="true" />,
      title: "Contraseñas protegidas",
      desc: "Tu contraseña nunca se guarda en texto plano.",
    },
  ];

  return (
    <section id="seguridad" className="border-t border-[#1E1E21] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-semibold tracking-tight">Tu información, resguardada</h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {points.map((p) => (
            <li key={p.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#232327] bg-[#151517]">
                {p.icon}
              </span>
              <h3 className="mt-4 font-medium">{p.title}</h3>
              <p className="mt-1.5 text-sm text-[#9195A0]">{p.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

function Faq() {
  return (
    <section id="faq" className="border-t border-[#1E1E21] px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">Preguntas frecuentes</h2>
        <div className="mt-8 divide-y divide-[#1E1E21] border-y border-[#1E1E21]">
          {faqs.map((f) => (
            <article key={f.q}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] rounded-sm">
                  <h3 className="text-base font-medium">{f.q}</h3>
                  <span className="ml-4 flex-none text-[#9195A0] transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#9195A0]">{f.a}</p>
              </details>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA final ---------- */

function FinalCta() {
  return (
    <section className="border-t border-[#1E1E21] px-6 py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-xl border border-[#232327] bg-[#111113] p-10 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Empieza a ordenar tu plata hoy</h2>
          <p className="mt-2 text-sm text-[#9195A0]">Gratis, sin tarjeta de crédito.</p>
        </div>
        <Link
          href="/register"
          className="whitespace-nowrap rounded-md bg-[#22C55E] px-5 py-3 text-sm font-medium text-[#0A0A0B] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111113]"
        >
          Crear cuenta gratis
        </Link>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer className="border-t border-[#1E1E21] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[#9195A0] sm:flex-row">
        <span>Finanzas  {new Date().getFullYear()}</span>
        <nav aria-label="Pie de página" className="flex gap-4">
          <Link href="/login" className="hover:text-[#F2F2F3]">
            Iniciar sesión
          </Link>
          <Link href="/register" className="hover:text-[#F2F2F3]">
            Crear cuenta
          </Link>
        </nav>
      </div>
    </footer>
  );
}