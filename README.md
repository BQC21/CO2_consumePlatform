# CO2_consumePlatform / Energy Track

Plataforma de TEC Energy Solutions para registrar sistemas fotovoltaicos instalados, ver su impacto ambiental y la cobertura por departamento del Perú.

## Features

1. Ingreso con correo y contraseña. `/` entra al dashboard si hay sesión y, si no, a `/login`.
2. Vista principal con proyectos registrados, completados, capacidad instalada, mapa de los 24 departamentos y ficha del departamento elegido.
3. Tarjeta de impacto ambiental acumulado. CO₂, carbón y árboles salen del total de proyectos. La pastilla de periodo solo cambia la energía generada. La gráfica mensual tiene su propio selector de año.
4. Lista de proyectos en una tabla anual: búsqueda, filtros, orden, alta, baja, edición de varias filas a la vez y métricas mensuales por proyecto. También hay carga, descarga y limpieza masiva en Excel.
5. Cada proyecto es independiente o existente. Los existentes se leen del Portal TEC del repositorio [https://github.com/BQC21/Portal_TEC_general](https://github.com/BQC21/Portal_TEC_general)  y se pueden editar aquí. Esa edición se guarda en la base de esta plataforma y conserva el vínculo con el portal.
6. Sincronización en tiempo real con Supabase.

## Stack

1. Visualización: Next.js 16, React 19 y Tailwind CSS 4.
2. Capa lógica: `app` / `features/view` / `features/model` / `features/ViewModel` / `lib`.
3. Base de datos: PostgreSQL en Supabase, sin ORM.
4. Seguridad: Supabase Auth, cookies SSR y RLS para usuarios autenticados. `src/proxy.ts` protege `/dashboard` y `/project`.
5. Despliegue: Vercel.
6. El CRUD va directo a Supabase desde el cliente de la plataforma.

## Database Schema

La tabla base es `public.proyectos`. Los cambios posteriores están en `supabase/migrations/`, en orden de fecha.

#### `proyectos`

- `id` (UUID, Primary Key)
- `nombre`, `ubicacion`, `distrito`, `tipo_de_sistema`, `marca_inversor`, `marca_panel`, `marca_bateria`, `estado`, `descripcion`
- `pot_nominal_kw`, `cap_instalada_kwp` (numeric, nullable)
- `fecha_instalacion` (date, nullable)
- `paneles_instalados` (integer)
- `rendimiento_fv_total`, `rendimiento_grid_total`, `carga_consumida_total` (numeric, nullable)
- `reduccion_co2`, `reduccion_carbon`, `arboles` (numeric, nullable)
- `insercion`: `independiente` o `existente`
- `portal_proyecto_id` (integer, nullable): proyecto del Portal TEC, solo lectura desde esta plataforma
- `imagen_url` (text, nullable)
- `created_at`, `updated_at`

#### `registros_mensuales`

- `id` (UUID, Primary Key)
- `proyecto_id` (UUID, Foreign Key a `proyectos`, cascade)
- `mes` (date, primer día del mes)
- `rendimiento_fv`, `rendimiento_grid`, `rendimiento_carga` (numeric, nullable)
- Unique `(proyecto_id, mes)`

El dashboard suma CO₂, carbón y árboles desde `proyectos`. La energía generada suma `rendimiento_fv` de `registros_mensuales` y la muestra en MWh.

# Authentication

Plataforma:

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Portal TEC, solo para leer proyectos existentes:

* `NEXT_PUBLIC_PORTAL_SUPABASE_URL`
* `NEXT_PUBLIC_PORTAL_SUPABASE_PUBLISHABLE_KEY`

El navegador usa la publishable key. Guardar un proyecto existente no escribe en el Portal TEC.

---

## Prerequisites

- Node.js 20 o superior
- npm
- Un proyecto de Supabase para esta plataforma
- Acceso de lectura al proyecto de Supabase del Portal TEC, si se van a vincular proyectos existentes

## Installation

#### 1. Clone repository

```bash
git clone https://github.com/BQC21/CO2_consumePlatform
cd CO2_consumePlatform
```

#### 2. Database Setup - Supabase

1. Crea un proyecto en Supabase.
2. Confirma que exista `public.proyectos`.
3. En el SQL editor, ejecuta los archivos de `supabase/migrations/` del más antiguo al más reciente.
4. En Authentication, deja activo el proveedor de correo.
5. Copia la URL del proyecto y la publishable key.
6. En Authentication → URL configuration, agrega `http://localhost:3000` y, en producción, la URL del dominio.

#### 3. Install dependencies

```bash
npm install
cp .env.example .env.local
```

Completa las variables de la plataforma en `.env.local`. Las del portal hacen falta para jalar un proyecto existente.

#### 4. Run development app

```bash
npm run dev
```

#### 5. Open localhost url on browser

```bash
http://localhost:3000
```

## Deploy en Vercel

1. Importa el repositorio en Vercel. El comando de build es `next build`.
2. Define `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Si se usan proyectos existentes, define también `NEXT_PUBLIC_PORTAL_SUPABASE_URL` y `NEXT_PUBLIC_PORTAL_SUPABASE_PUBLISHABLE_KEY`.
3. Cuando el build quede verde, apunta el dominio. Recién entonces actualiza el DNS en Hostinger.
4. Agrega esa URL de producción en la configuración de URLs de Supabase Auth.
5. Si un deploy falla, vuelve en Vercel al último build verde. Eso no revierte filas ni políticas de Supabase: respalda el SQL antes de un cambio destructivo.
