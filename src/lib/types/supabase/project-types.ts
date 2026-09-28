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

/** Fila de `registros_mensuales`. */
export type SupabaseProjectMonthRow = {
  id?: string;
  proyecto_id: string | null;
  mes: string | null;
  tipico_diario: number | string | null;
  pot_nominal_kw: number | string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

/** Fila de `metas`. */
export type SupabaseMetaRow = {
  id?: string;
  anio: number | string | null;
  meta_paneles_anual: number | string | null;
  meta_paneles_mensual: number | string | null;
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

export type ProjectMonth = {
  id: string;
  proyecto_id: string;
  mes: string;
  tipico_diario: number;
  pot_nominal_kw: number | null;
  updated_at: string;
};

export type ProjectMonthFormState = {
  proyecto_id: string;
  mes: string;
  tipico_diario: string;
  pot_nominal_kw: string;
};

export type ProjectMonthFormData = ProjectMonthFormState;

export type Meta = {
  id: string;
  anio: number;
  meta_paneles_anual: number;
  meta_paneles_mensual: number;
};

export type MetaFormState = {
  anio: string;
  meta_paneles_anual: string;
  meta_paneles_mensual: string;
};

export type MetaFormData = MetaFormState;

export type UseListResult<T> = {
  items: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export type UseMutationsResult<TForm, TItem> = {
  loading: boolean;
  error: string | null;
  create: (form: TForm) => Promise<TItem>;
  update: (id: string, form: TForm) => Promise<TItem>;
  remove: (id: string) => Promise<void>;
};
