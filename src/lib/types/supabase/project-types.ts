import type { ProjectStatus } from "@/lib/types/components/options";

export type ProjectOrigin = "independiente" | "existente";

/** Fila de `proyectos` tal como llega de Supabase. */
export type SupabaseProjectRow = {
  id?: string;
  nombre: string | null;
  ubicacion: string | null;
  distrito: string | null;
  tipo_de_sistema: string | null;
  pot_nominal_kw: number | string | null;
  cap_instalada_kwp: number | string | null;
  fecha_instalacion: string | null;
  marca_inversor: string | null;
  paneles_instalados: number | string | null;
  rendimiento_fv_total: number | string | null;
  rendimiento_grid_total: number | string | null;
  carga_consumida_total: number | string | null;
  reduccion_co2: number | string | null;
  reduccion_carbon: number | string | null;
  arboles: number | string | null;
  estado: string | null;
  descripcion: string | null;
  insercion?: string | null;
  portal_proyecto_id?: number | string | null;
  imagen_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Project = {
  id: string;
  nombre: string;
  ubicacion: string;
  distrito: string;
  tipo_de_sistema: string;
  pot_nominal_kw: number | null;
  cap_instalada_kwp: number | null;
  fecha_instalacion: string;
  marca_inversor: string;
  paneles_instalados: number | null;
  rendimiento_fv_total: number | null;
  rendimiento_grid_total: number | null;
  carga_consumida_total: number | null;
  reduccion_co2: number | null;
  reduccion_carbon: number | null; 
  arboles: number | null;
  estado: ProjectStatus;
  descripcion: string;
  insercion: ProjectOrigin;
  portal_proyecto_id: number | null;
  imagen_url: string;
  created_at: string;
  updated_at: string;
};

/** Los números editables viajan como texto para no perder lo que el usuario está escribiendo. */
export type ProjectFormState = {
  nombre: string;
  ubicacion: string;
  distrito: string;
  tipo_de_sistema: string;
  pot_nominal_kw: string;
  cap_instalada_kwp: string;
  fecha_instalacion: string;
  marca_inversor: string;
  paneles_instalados: string;
  rendimiento_fv_total: string;
  rendimiento_grid_total: string;
  carga_consumida_total: string;
  reduccion_co2: string;
  reduccion_carbon: string;
  arboles: string;
  estado: ProjectStatus;
  descripcion: string;
  insercion: ProjectOrigin;
  portal_proyecto_id: string;
  created_at: string;
  updated_at: string;
};

export type ProjectFormData = ProjectFormState;

