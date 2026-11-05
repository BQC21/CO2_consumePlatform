import { MapStatus } from "@/lib/types/components/options";


// Clase de diseño para el campo editable
export const editClass = "h-9 w-full min-w-24 rounded-lg border border-[var(--color-secondary)] bg-white px-2 text-sm";

// Clase de diseño para el campo bloqueado
export const lockedClass = "h-9 w-full min-w-24 rounded-lg border border-[#b7d4ea] bg-[#d7ebf8] px-2 text-sm text-[#1e4f86]";

// Color de las barras para el gráfico de la vista principal
export const BAR_COLOR = "#f07a1a";

// Color según estado del proyecto
export const REGION_FILL: Record<MapStatus | "selected", string> = {
    sin_proyecto: "#d5dee7",
    completado: "#7dce6a",
    en_ejecucion: "#f05a1a",
    selected: "#1b7a34",
};