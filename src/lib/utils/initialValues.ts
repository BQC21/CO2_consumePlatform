import { MetaFormState } from "../types/supabase/meta-types";
import { ProjectFormState } from "../types/supabase/project-types";
import { ProjectMonthFormState } from "../types/supabase/projectMonth-types";

// Proyectos anuales
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
  reduccion_co2: "",
  reduccion_carbon: "",
  arboles: "",
  estado: "en_ejecucion",
  descripcion: "",
};

// Proyectos mensuales
export const INITIAL_PROJECT_MONTH_FORM: ProjectMonthFormState = {
  proyecto_id: "",
  mes: "",
  rendimiento_fv: "",
  rendimiento_grid: "",
  consumo_carga: "",
};

// Meta 
export const INITIAL_META_FORM: MetaFormState = {
  anio: String(new Date().getFullYear()),
  mes: String(new Date().getMonth()),
  meta_paneles_anual: "1000",
  meta_paneles_mensual: "100",
};
