# Progress Tracker

## 1. Estado actual

**Overall status:** DEVELOPMENT

**Completion:** 85%

**Current phase:** Producto usable en local, con la galería de proyectos. Falta el deploy y la prueba con una sesión real.

**Last updated:** 2026-10-30

---

## 2. Completado

- [x] Fundación Next.js 16, TypeScript, Tailwind 4 y tokens de `globals.css`
- [x] Capas `app` / `features` / `lib` y clientes Supabase de plataforma y de portal
- [x] Login con correo y contraseña, y portero `src/proxy.ts` para `/dashboard` y `/project`
- [x] Dashboard: conteos, capacidad, impacto acumulado, energía por periodo, gráfica mensual y mapa de 24 departamentos
- [x] Lista `/project` en una tabla anual, con filtros, orden, edición de varias filas, CRUD y Excel
- [x] Modal de métricas mensuales (rendimiento FV, red y carga) y confirmación al quitar un mes
- [x] Alta de proyecto independiente o existente. El existente se lee del Portal TEC y se guarda solo en esta plataforma
- [x] Filas de proyectos existentes coloreadas. El guardado conserva `insercion` y `portal_proyecto_id`
- [x] CO₂, carbón y árboles persistidos en `proyectos` y sumados en el dashboard
- [x] Migraciones en `supabase/migrations/` para origen, marcas, imagen y registros mensuales
- [x] `README.md` en la raíz del repositorio
- [x] Galería `/gallery`: un bloque por proyecto, orden por fecha de instalación, alta, reemplazo y baja de fotos y videos en Storage

---

## 3. En progreso

- [ ] Pruebas de extremo a extremo con una sesión real (login, alta, edición de varias filas, baja, importación)

---

## 4. Pendiente

- [ ] Deploy en Vercel y dominio
- [ ] Suite `npm test`: `package.json` apunta a `src/tests/`, y esa carpeta no está en el árbol actual
- [ ] Pantallas de registro y de recuperación de contraseña. `proxy.ts` todavía nombra `/register` y `/save_password`, pero no hay páginas para esas rutas

---

## 5. Fuera de esta versión

- Barras de meta anual y mensual, y gauges de avance
- Dos hojas visibles a la vez (registros anuales y registros mensuales)
- Workbook Excel dentro de la página de proyectos

---

## 6. Bugs conocidos

| ID | Description | Severity | Status |
| -- | ----------- | -------- | ------ |
| BUG-001 | Sin variables de Supabase la app abre el login y muestra el error de configuración; no hay datos de demostración locales | Low | Cerrado |

---

## 7. Deudas técnicas

- El acceso de clientes a su propia planta queda pendiente: el RLS deja ver todas las filas a cualquier usuario autenticado.
- `imagen_url` y el bucket `project-images` existen en la base. La columna de imagen de la tabla anual está comentada en `headers.ts`. La galería no usa esa columna: pide su propia fila, con vectores de fotos y de videos, y los archivos en Storage.
- La migración de `registros_mensuales` creó columnas de CO₂, carbón y árboles por mes. La app guarda ese impacto en la fila del proyecto y, por mes, solo rendimiento FV, red y carga.
- El orden de la tabla cubre fecha de instalación. No hay orden por cantidad de paneles.

---

## 8. Architecture Decision Records

### ADR-001 — Ruta `/project` y portero `proxy.ts`

**Contexto:**
Los documentos antiguos nombran la lista como `/project`, `/projects` y `/proyectos`. Next.js 16 usa `proxy.ts` en lugar de `middleware.ts`.

**Decisión:**
La lista vive en `/project`. El portero es `src/proxy.ts`.

**Razón:**
El header y la navegación ya apuntan a esa ruta.

**Consecuencias:**
El enlace del header dice «Lista de proyectos» y apunta a `/project`.

### ADR-002 — Una tabla anual y métricas en modal

**Contexto:**
El diseño v1 mostraba registros anuales y mensuales como dos paneles a la vez.

**Decisión:**
`/project` muestra solo `ProjectAnnualTable`. Los meses se editan en `ProjectMetricsModal`.

**Razón:**
El seguimiento mensual cabe en el proyecto sin duplicar la grilla.

**Consecuencias:**
No existen `project_month.tsx` ni `ExcelWorkbook`.

### ADR-003 — Portal TEC de solo lectura

**Contexto:**
Los proyectos ya cotizados viven en otra base de Supabase.

**Decisión:**
`createPortalClient` solo lee. `updateProject` escribe en la tabla `proyectos` de esta plataforma y conserva `portal_proyecto_id`.

**Razón:**
Esta plataforma no debe alterar la base del portal.

**Consecuencias:**
Hacen falta `NEXT_PUBLIC_PORTAL_SUPABASE_URL` y `NEXT_PUBLIC_PORTAL_SUPABASE_PUBLISHABLE_KEY` para jalar un proyecto existente.

### ADR-004 — Galería en Storage y referencias en PostgreSQL

**Contexto:**
La hoja del 2026-10-30 pide una tabla con el nombre del proyecto y dos vectores, «alojada en Supabase Storage», y un enlace a Google Drive.

**Decisión:**
Las filas viven en PostgreSQL de esta plataforma. Los archivos viven en Supabase Storage. El enlace de Drive solo abre la carpeta MATERIAL - TEC. `imagen_url` queda fuera de la galería.

**Razón:**
Un bucket guarda archivos. Una fila con vectores necesita una tabla. El Drive de la hoja es material externo.

**Consecuencias:**
Hace falta una migración nueva y el nombre de tabla y de bucket en `namingTolerance.ts`. `/gallery` entra en `src/proxy.ts`.
