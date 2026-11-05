import { MapStatus } from "@/lib/types/components/options";


// Clase de diseño para el campo editable
export const editClass = "h-9 w-full min-w-24 rounded-lg border border-[var(--color-secondary)] bg-white px-2 text-sm";

// Clase de diseño para el campo bloqueado
export const lockedClass = "h-9 w-full min-w-24 rounded-lg border border-[#b7d4ea] bg-[#d7ebf8] px-2 text-sm text-[#1e4f86]";

// Color de las barras para el gráfico de la vista principal
export const BAR_COLOR = "#f07a1a";

// Diseño para las tarjetas de métricas (vista moderna)
export const tones = {
    blue: {
        card: "bg-[linear-gradient(160deg,#eef4ff_0%,#ffffff_68%)] ring-[#d5e4fb]",
        mark: "bg-[var(--color-secondary)]",
        value: "text-[var(--color-secondary)]",
    },
    green: {
        card: "bg-[linear-gradient(160deg,#f3fbe9_0%,#ffffff_68%)] ring-[#d7efc4]",
        mark: "bg-[var(--color-success)]",
        value: "text-[#1f7a32]",
    },
    orange: {
        card: "bg-[linear-gradient(160deg,#fff4ec_0%,#ffffff_68%)] ring-[#ffd7c2]",
        mark: "bg-[var(--color-primary)]",
        value: "text-[var(--color-primary)]",
    },
} as const;

// Color según estado del proyecto
export const REGION_FILL: Record<MapStatus | "selected", string> = {
    sin_proyecto: "#d5dee7",
    completado: "#7dce6a",
    en_ejecucion: "#f05a1a",
    selected: "#1b7a34",
};