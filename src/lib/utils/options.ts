export const SYSTEM_TYPE_OPTIONS = ["On-grid", "Híbrido"] as const;

export const INVERTER_BRAND_OPTIONS = ["LIVOLTEK", "GOODWE", "SOLIS", "FELICITY"] as const;

export const PROJECT_STATUS_OPTIONS = [
  { value: "en_ejecucion", label: "En ejecución" },
  { value: "completado", label: "Completado" },
] as const;

export const SORTING_OPTIONS = [
  { value: "fecha_desc", label: "Fecha de instalación · reciente" },
  { value: "fecha_asc", label: "Fecha de instalación · antigua" },
  { value: "paneles_desc", label: "Paneles · mayor a menor" },
  { value: "paneles_asc", label: "Paneles · menor a mayor" },
] as const;

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
