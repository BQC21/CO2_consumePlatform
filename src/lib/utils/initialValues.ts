import type { MetaFormState, ProjectFormState, ProjectMonthFormState } from "@/lib/types/supabase/project-types";

export const INITIAL_PROJECT_FORM: ProjectFormState = {
  nombre: "",
  ubicacion: "",
  distrito: "",
  tipo_de_sistema: "Híbrido",
  pot_nominal_kw: "",
  cap_instalada_kwp: "",
  fecha_instalacion: "",
  marca_inversor: "",
  paneles_instalados: "",
  estado: "en_ejecucion",
  descripcion: "",
};

export const INITIAL_PROJECT_MONTH_FORM: ProjectMonthFormState = {
  proyecto_id: "",
  mes: "",
  tipico_diario: "",
  pot_nominal_kw: "",
};

export const INITIAL_META_FORM: MetaFormState = {
  anio: String(new Date().getFullYear()),
  meta_paneles_anual: "1000",
  meta_paneles_mensual: "100",
};
