# CO2_consumePlatform / Energy Track

Plataforma de TEC Energy Solutions para registrar sistemas fotovoltaicos ya instalados, seguir la meta de paneles del año y ver la cobertura por departamento del Perú.

## Features
1. Ingreso con correo y contraseña, registro, recuperación y cambio de contraseña.
2. Vista principal con métricas, meta anual y mensual, mapa de los 24 departamentos y ficha de la planta.
3. Lista de proyectos en dos hojas visibles: registros anuales y registros mensuales, con filtro, orden, edición en celda y carga Excel.
4. Cálculo de reducción de CO2, árboles equivalentes y ahorro de carbón a partir del típico diario.
5. Sincronización en tiempo real con Supabase.

## Stack
1. Visualización: Next.js 16, React 19 y Tailwind CSS 4.
2. Capa lógica: `app` / `features/view` / `features/model` / `features/ViewModel` / `lib`.
3. Base de datos: PostgreSQL en Supabase, sin ORM.
4. Seguridad: Supabase Auth, cookies SSR y RLS para usuarios autenticados.
5. Despliegue: Vercel.
6. Virtualización: no aplica en esta versión.
7. Orquestación: Route Handler solo para cerrar el callback de Auth. El CRUD va directo a Supabase.

## Database Schema

#### `proyectos`
- `id` (UUID, Primary Key)
- `nombre`, `ubicacion`, `distrito`, `tipo_de_sistema`, `marca_inversor`, `estado`, `descripcion`
- `pot_nominal_kw`, `cap_instalada_kwp` (numeric, nullable)
- `fecha_instalacion` (date, nullable)
- `paneles_instalados` (integer)
- `created_at`, `updated_at`

#### `registros_mensuales`
- `id` (UUID, Primary Key)
- `proyecto_id` (UUID, Foreign Key a `proyectos`, cascade)
- `mes` (`YYYY-MM`)
- `tipico_diario`, `pot_nominal_kw`
- Unique `(proyecto_id, mes)`

#### `metas`
- `id` (UUID, Primary Key)
- `anio` (integer, unique)
- `meta_paneles_anual`, `meta_paneles_mensual`

El CO2, los árboles y el carbón no se guardan: se calculan al leer.

# Authentication
* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

La clave de servicio no se usa en el navegador. 

---

## Prerequisites
- Node.js 20 o superior
- npm
- Un proyecto de Supabase

## Installation

#### 1. Clone repository
```bash
git clone https://github.com/BQC21/CO2_consumePlatform
cd CO2_consumePlatform
```

#### 2. Database Setup - Supabase
1. Crea un proyecto en Supabase.
2. En el SQL editor, ejecuta `supabase/schema.sql`.
3. En Authentication, deja activo el proveedor de correo.
4. Copia la URL del proyecto y la publishable key.
5. En Authentication → URL configuration, agrega `http://localhost:3000/callback` y, en producción, `https://<tu-dominio>/callback`.

#### 3. Install dependencies
```bash
npm install
cp .env.example .env.local
```
Completa las dos variables en `.env.local`.

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
2. Define `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Cuando el build quede verde, apunta el dominio. Recién entonces actualiza el DNS en Hostinger.
4. Agrega esa URL de producción en los redirects de Supabase Auth.
5. Si un deploy falla, vuelve en Vercel al último build verde. Eso no revierte filas ni políticas de Supabase: respalda el SQL antes de un cambio destructivo.

<!-- ## Cálculo
El típico diario está en kWh/día. La energía del mes es ese valor por los días del periodo. Sobre esa energía: 0,997 kg de CO2 por kWh, 0,404 kg de carbón por kWh y un árbol equivalente cada 18,3 kg de CO2. -->
