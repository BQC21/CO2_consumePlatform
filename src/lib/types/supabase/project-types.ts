import type { ProjectStatus } from "@/lib/utils/options";

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
  estado: string | null;
  descripcion: string | null;
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
  paneles_instalados: number;
  estado: ProjectStatus;
  descripcion: string;
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
  estado: ProjectStatus;
  descripcion: string;
};

export type ProjectFormData = ProjectFormState;

