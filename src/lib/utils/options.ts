import { Impact } from "../types/components/options";

// Opciones del tipo de sistema
export const SYSTEM_TYPE_OPTIONS = ["On-grid", "Híbrido", "Off-grid", "BESS"] as const;

// Opciones para la marca del inversor
export const INVERTER_BRAND_OPTIONS = ["LIVOLTEK", "GOODWE", "SOLIS", "FELICITY"] as const;

const INVERTER_PORTALS: Record<(typeof INVERTER_BRAND_OPTIONS)[number], string> = {
  SOLIS: "https://v4.soliscloud.com/login",
  GOODWE: "https://us-semsplus.goodwe.com/#/login",
  LIVOLTEK: "https://www.livoltek-portal.com/#/",
  FELICITY: "https://shine.felicitysolar.com/login",
};

export function inverterPortalUrl(brand: string): string | null {
  const key = brand.trim().toUpperCase();
  if (key in INVERTER_PORTALS) {
    return INVERTER_PORTALS[key as keyof typeof INVERTER_PORTALS];
  }
  return null;
}

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

export const IMPACT_OPTIONS: { value: Impact; label: string; unit: string }[] = [
  { value: "co2", label: "CO2 reducido", unit: "kg" },
  { value: "carbon", label: "Carbón reducido", unit: "kg" },
  { value: "arboles", label: "Árboles reducidos", unit: "" },
];