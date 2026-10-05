// Opciones del tipo de sistema
export const SYSTEM_TYPE_OPTIONS = ["On-grid", "Híbrido", "Off-grid"] as const;

// Opciones para la marca del inversor
export const INVERTER_BRAND_OPTIONS = ["LIVOLTEK", "GOODWE", "SOLIS", "FELICITY"] as const;

// Opciones del estado del proyecto
export const PROJECT_STATUS_OPTIONS = [
  { value: "en_ejecucion", label: "En ejecución" },
  { value: "completado", label: "Completado" },
] as const;

// Opciones para ordenar tablas
export const SORTING_OPTIONS = [
  { value: "fecha_desc", label: "Fecha de instalación · reciente" },
  { value: "fecha_asc", label: "Fecha de instalación · antigua" },
] as const;

// Opciones para seleccionar depertamento
export const DEPARTMENT_OPTIONS = [
  "Amazonas",
  "Áncash",
  "Apurímac",
  "Arequipa",
  "Ayacucho",
  "Cajamarca",
  "Cusco",
  "Huancavelica",
  "Huánuco",
  "Ica",
  "Junín",
  "La Libertad",
  "Lambayeque",
  "Lima",
  "Loreto",
  "Madre de Dios",
  "Moquegua",
  "Pasco",
  "Piura",
  "Puno",
  "San Martín",
  "Tacna",
  "Tumbes",
  "Ucayali",
] as const;
