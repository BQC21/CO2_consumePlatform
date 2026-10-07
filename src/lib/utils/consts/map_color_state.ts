import { MapStatus } from "@/lib/types/components/options";

// Estado del proyecto
export const STATUS_LABEL = {
    en_ejecucion: "En ejecución",
    completado: "Completado",
    sin_proyecto: "Sin proyecto",
} as const;

// Color según estado del proyecto
export const FILL: Record<MapStatus, string> = {
    en_ejecucion: "var(--color-primary)",
    completado: "var(--color-accent-green)",
    sin_proyecto: "#2f6fbf",
};

// Colores para colorear los puntos del mapa según estado del proyecto
export const DOT_COLOR = {
    en_ejecucion: "#f05a1a",
    completado: "#3caf53",
} as const;