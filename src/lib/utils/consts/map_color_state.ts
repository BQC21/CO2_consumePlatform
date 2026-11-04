import { MapStatus } from "@/lib/types/components/options";

// Color según estado del proyecto
export const REGION_FILL: Record<MapStatus | "selected", string> = {
    sin_proyecto: "#d5dee7",
    completado: "#7dce6a",
    en_ejecucion: "#f05a1a",
    selected: "#1b7a34",
};
