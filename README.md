# Gestor de Gastos

Aplicación web de finanzas personales para registrar transacciones, controlar presupuestos por categoría, y trackear gastos fijos mensuales. Proyecto desarrollado como parte de mi portafolio para postulaciones a roles de Data Analyst.

## Características

- Autenticación con Google OAuth y credenciales (email/password) vía Auth.js v5
- Transacciones: registro de ingresos y gastos con categorización
- Presupuestos: límites mensuales por categoría con alertas visuales al acercarse o excederse
- Gastos fijos: trackeo de suscripciones y pagos recurrentes (Netflix, arriendo, servicios básicos)
- Dashboard: visualización de gastos con gráficos interactivos (Recharts)
- Diseño dark-mode-first con shadcn y Tailwind CSS

## Stack Tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | Next.js 16.3 (App Router) |
| Lenguaje | TypeScript 5 |
| UI | React 19.2 |
| Estilos | Tailwind CSS 4 + shadcn |
| Base de datos | PostgreSQL (Neon) |
| ORM | Prisma 7.9 |
| Autenticación | Auth.js v5 (beta) — Google OAuth + Credentials |
| Validación | Zod |
| Gráficos | Recharts 3 |
| Hashing de contraseñas | bcryptjs |

## Arquitectura

El proyecto usa Server Actions de Next.js para toda la lógica de mutación de datos (sin API routes tradicionales), manteniendo la lógica de negocio cerca de los componentes que la consumen.

```
app/
  (app)/
    dashboard/        Vista principal con resumen y gráficos
    budgets/           Gestión de presupuestos por categoría
      fixed-expenses/  Gastos fijos y suscripciones recurrentes
    categories/        CRUD de categorías
    transactions/      Registro y listado de movimientos
    settings/          Perfil de usuario y configuración de cuenta
  api/auth/[...nextauth]/  Endpoints de Auth.js
  login/
  register/
lib/
  actions/             Server Actions (mutaciones)
  prisma.ts            Instancia singleton de Prisma Client
  auth.ts              Configuración de Auth.js
  queries.ts           Queries de lectura para Server Components
prisma/
  schema.prisma        Modelo de datos
  migrations/           Historial de migraciones
```

## Modelo de datos

Entidades principales:

- **User**: usuarios de la aplicación (soporta login con Google o credenciales)
- **Category**: categorías de ingreso/gasto, personalizables por usuario
- **Transaction**: movimientos individuales (ingresos y gastos)
- **Budget**: límite mensual de gasto por categoría
- **FixedExpense**: gastos recurrentes mensuales (suscripciones, servicios) vinculados opcionalmente a sus transacciones reales

## Requisitos previos

- Node.js 18.17 o superior
- Cuenta en [Neon](https://neon.tech) (PostgreSQL serverless) o cualquier instancia de PostgreSQL
- Credenciales OAuth de Google (para login con Google)

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Eduardo-Ve/gestor-gastos
cd gestor-gastos
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo de variables de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

Completar en `.env` las variables necesarias (ver `.env.example` para la lista completa): connection string de la base de datos (pooled y directa), secreto de Auth.js, y credenciales de Google OAuth.

Generar el cliente de Prisma y aplicar las migraciones:

```bash
npx prisma generate
npx prisma migrate dev
```

## Desarrollo

Levantar el servidor de desarrollo:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

Para explorar la base de datos visualmente:

```bash
npx prisma studio
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linter con ESLint |
| `npx prisma studio` | Explorador visual de la base de datos |
| `npx prisma migrate dev` | Aplicar migraciones en desarrollo |

## Roadmap

- Conectar gastos fijos con transacciones reales (marcar como pagado)
- Sistema de trackeo de tarjetas de crédito con soporte para múltiples tarjetas y ciclos de facturación independientes
- Landing page pública en la ruta raíz
- Reforzar protección de rutas autenticadas

