import { MapStatus } from "@/lib/types/components/options";

export const FILL: Record<MapStatus, string> = {
    en_ejecucion: "var(--color-primary)",
    completado: "var(--color-accent-green)",
    sin_proyecto: "#2f6fbf",
};

export const STATUS_LABEL = {
    en_ejecucion: "En ejecución",
    completado: "Completado",
    sin_proyecto: "Sin proyecto",
} as const;