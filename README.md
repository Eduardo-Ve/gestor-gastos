# Finanzas

Aplicacion web de finanzas personales para registrar movimientos, organizar categorias, controlar presupuestos, administrar gastos fijos y hacer seguimiento de compras con tarjeta de credito.

Construida con Next.js y PostgreSQL sobre Neon, con autenticacion mediante Google OAuth o credenciales locales.

## Tecnologias utilizadas

[![Next.js](https://img.shields.io/badge/Next.js-16.3.0-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-UI_components-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Lucide](https://img.shields.io/badge/Lucide-icons-F56565?logo=lucide&logoColor=white)](https://lucide.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-3-22C55E?logo=react&logoColor=white)](https://recharts.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9.1-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL_serverless-00E599?logo=postgresql&logoColor=111111)](https://neon.tech/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-000000?logo=auth0&logoColor=white)](https://authjs.dev/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-Gmail_SMTP-0F9D58?logo=gmail&logoColor=white)](https://nodemailer.com/)
[![Zod](https://img.shields.io/badge/Zod-validation-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)
[![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)](https://git-scm.com/)

## Funcionalidades

- Landing page publica con informacion del producto y navegacion responsive.
- Autenticacion con Google OAuth y credenciales locales mediante Auth.js v5.
- Registro con politica de contrasenas segura.
- Recuperacion y restablecimiento de contrasena mediante Gmail SMTP y Nodemailer.
- Tokens de recuperacion con hash SHA-256, expiracion de 60 minutos y uso unico.
- Movimientos de ingresos y gastos con categoria, fecha, metodo de pago y descripcion.
- Formateo de montos en pesos chilenos (CLP).
- Categorias personalizables para ingresos y gastos.
- Presupuestos mensuales por categoria con progreso, alertas y distribucion grafica.
- Gastos fijos y suscripciones con fecha de vencimiento, activacion y registro de pago.
- Tarjetas de credito, compras en cuotas, intereses, ciclos de facturacion y cupo disponible.
- Dashboard con resumen financiero y graficos interactivos mediante Recharts.
- Perfil de usuario con nombre y avatar personalizado.
- Interfaz responsive para desktop y dispositivos moviles.

## Como funciona

### Autenticacion

La aplicacion usa Auth.js v5 con dos formas de acceso:

- **Google OAuth** para usuarios que prefieren iniciar sesion con su cuenta Google.
- **Credenciales locales** para usuarios registrados con correo y contrasena.

Las rutas privadas estan protegidas por `proxy.ts` y redirigen a `/login` cuando no existe una sesion valida.

### Recuperacion de contrasena

El flujo de recuperacion utiliza Gmail SMTP mediante Nodemailer:

1. El usuario solicita recuperar su contrasena en `/forgot-password`.
2. El servidor genera un token aleatorio y guarda solamente su hash en PostgreSQL.
3. El token expira despues de 60 minutos y se invalida despues de utilizarse.
4. Nodemailer envia un correo con enlace hacia `/reset-password`.
5. La nueva contrasena se valida con la politica de seguridad y se almacena con bcrypt.

La respuesta de solicitud es generica para no revelar si un correo existe en la base de datos.

### Operaciones financieras

Las pantallas autenticadas consumen consultas server-side y Server Actions por modulo:

- `transactions`: ingresos, gastos y metodos de pago.
- `categories`: categorias de ingresos y gastos.
- `budgets`: limites mensuales, progreso y alertas por categoria.
- `fixed-expenses`: suscripciones, gastos recurrentes y pagos del periodo.
- `credit-card`: tarjetas, compras, cuotas, intereses y cupo comprometido.
- `dashboard`: resumen, distribuciones y movimientos recientes.

## Arquitectura

El proyecto usa el App Router de Next.js. Las lecturas se realizan desde Server Components y las mutaciones desde Server Actions. Prisma y las credenciales privadas permanecen del lado servidor.

```text
Navegador
   |
   v
Next.js App Router
   |
   +--> Server Components --> Queries --> Prisma Client
   |
   +--> Client Components --> Server Actions
   |                              |
   |                              +--> Auth.js / validaciones Zod
   |                              +--> Prisma Client
   |                              +--> Nodemailer / Gmail
   |
   v
PostgreSQL en Neon
```

### Estructura principal

```text
app/
  (app)/
    dashboard/        Dashboard financiero y graficos
    transactions/     Registro y listado de movimientos
    categories/       CRUD de categorias
    budgets/          Presupuestos mensuales por categoria
    fixed-expenses/   Gastos fijos y pagos recurrentes
    credit-card/      Tarjetas, compras y cuotas
    settings/         Perfil y cambio de contrasena
  api/auth/           Route Handler de Auth.js
  forgot-password/    Solicitud de recuperacion
  reset-password/     Restablecimiento mediante token
  login/              Inicio de sesion
  register/           Registro de usuarios
  page.tsx            Landing page publica
  layout.tsx          Layout global y providers

components/
  landing/             Componentes de la landing publica
  ui/                  Componentes UI reutilizables

lib/
  auth.ts              Configuracion server-side de Auth.js
  auth.config.ts       Providers y callbacks de autenticacion
  db.ts                Cliente singleton de Prisma con adapter PostgreSQL
  mailer.ts            Transporter Gmail mediante Nodemailer
  password-policy.ts   Politica compartida de contrasenas
  queries.ts            Consultas de lectura para Server Components
  validations.ts        Schemas de validacion con Zod
  credit-card-math.ts  Calculos de cuotas y periodos de facturacion
  format.ts             Formateo y parseo de moneda CLP

prisma/
  schema.prisma        Modelos y relaciones de PostgreSQL
  migrations/          Historial de migraciones
```

## Modelo de datos

- **User**: usuarios, credenciales, sesiones y relaciones de la aplicacion.
- **Account**: cuentas OAuth vinculadas, incluyendo Google.
- **Session**: sesiones administradas por Auth.js.
- **Category**: categorias de ingresos y gastos por usuario.
- **Transaction**: movimientos financieros individuales.
- **Budget**: limites mensuales por categoria, mes y ano.
- **FixedExpense**: gastos recurrentes y sus pagos.
- **CreditCard**: tarjetas de credito con cupo y fechas de ciclo.
- **CreditCardPurchase**: compras realizadas con tarjeta.
- **CreditCardInstallment**: cuotas, periodos de facturacion y estado de pago.
- **PasswordResetToken**: tokens hasheados, temporales y de uso unico.

## Requisitos previos

- Node.js 18.17 o superior.
- npm.
- Una base de datos PostgreSQL en Neon o cualquier instancia PostgreSQL compatible.
- Un proyecto OAuth de Google para el inicio de sesion.
- Una cuenta Gmail exclusiva para enviar correos de recuperacion.
- Una contrasena de aplicacion de Gmail o credenciales OAuth2 para Nodemailer.

## Instalacion

Clonar el repositorio:

```bash
git clone https://github.com/Eduardo-Ve/gestor-gastos.git
cd gestor-gastos
```

Instalar dependencias:

```bash
npm install
```

Crear las variables de entorno:

```bash
cp .env.example .env
```

Completar `.env` con valores reales:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NEXTAUTH_SECRET="..."
APP_URL="http://localhost:3000"
GMAIL_USER="cuenta.emisora@gmail.com"
GMAIL_APP_PASSWORD="..."
```

`GMAIL_APP_PASSWORD` debe ser una contrasena de aplicacion generada en Google con la verificacion en dos pasos activa. Como alternativa, se pueden configurar `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET` y `GMAIL_REFRESH_TOKEN` para OAuth2.

No compartas `.env`, contrasenas de aplicacion, refresh tokens ni secretos OAuth. Las variables privadas no deben usar el prefijo `NEXT_PUBLIC_`.

Generar el cliente Prisma y aplicar migraciones:

```bash
npx prisma generate
npx prisma migrate dev
```

## Desarrollo

Iniciar el servidor con Turbopack:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Para explorar la base de datos:

```bash
npx prisma studio
```

## Scripts y validaciones

| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo con Turbopack |
| `npm run build` | Build de produccion de Next.js |
| `npm run start` | Servidor de produccion |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Verificacion de TypeScript |
| `npx prisma generate` | Generar Prisma Client |
| `npx prisma validate` | Validar el schema de Prisma |
| `npx prisma migrate dev` | Crear y aplicar migraciones en desarrollo |
| `npx prisma studio` | Explorador visual de la base de datos |

Antes de abrir un Pull Request se recomienda ejecutar:

```bash
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
```

## Seguridad

- Las acciones de servidor validan autenticacion y ownership de los recursos.
- Las contrasenas se almacenan con bcrypt y nunca en texto plano.
- La politica de contrasenas se aplica en registro, cambio y recuperacion.
- Los tokens de recuperacion se almacenan como hash, expiran y solo pueden usarse una vez.
- Las credenciales de Gmail se utilizan exclusivamente en el servidor.
- Las operaciones de Prisma y el acceso a Neon permanecen fuera de Client Components.
- Las respuestas de recuperacion no revelan si un correo esta registrado.

## Estado del proyecto

El proyecto incluye los modulos principales de gestion financiera, autenticacion, recuperacion de contrasena, gastos fijos y tarjetas de credito. Las migraciones de Prisma mantienen el historial de cambios del schema y la aplicacion esta preparada para ejecutarse sobre PostgreSQL en Neon.

## Licencia

Proyecto personal de portafolio.
