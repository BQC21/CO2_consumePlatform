import { ProjectFormState } from "../types/supabase/project-types";

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
  rendimiento_fv_total: "",
  rendimiento_grid_total: "",
  carga_consumida_total: "",
  reduccion_co2: "",
  reduccion_carbon: "",
  arboles: "",
  estado: "en_ejecucion",
  descripcion: "",
  insercion: "independiente",
  portal_proyecto_id: "",
  created_at: "",
  updated_at: "",
};