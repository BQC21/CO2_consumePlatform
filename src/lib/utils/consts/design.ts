import { MapStatus } from "@/lib/types/components/options";


// Clase de diseño para el campo editable
export const editClass = "h-9 w-full min-w-24 rounded-lg border border-[var(--color-secondary)] bg-white px-2 text-sm";

// Clase de diseño para el campo bloqueado
export const lockedClass = "h-9 w-full min-w-24 rounded-lg border border-[var(--color-secondary)] bg-[color-mix(in_srgb,var(--color-secondary)_16%,white)] px-2 text-sm text-[var(--color-secondary-active)]";

// Color de las barras para el gráfico de la vista principal
export const BAR_COLOR = "#eda30f";

// Diseño para las tarjetas de métricas (vista moderna)
export const tones = {
    blue: {
        card: "bg-[linear-gradient(160deg,#eef4ff_0%,#ffffff_68%)] ring-[var(--color-secondary)]",
        mark: "bg-[var(--color-secondary)]",
        value: "text-[var(--color-secondary)]",
    },
    green: {
        card: "bg-[linear-gradient(160deg,#f3fbe9_0%,#ffffff_68%)] ring-[var(--color-accent-green)]",
        mark: "bg-[var(--color-success)]",
        value: "text-[var(--color-text-brand-green)]",
    },
    orange: {
        card: "bg-[linear-gradient(160deg,#fff8e6_0%,#ffffff_68%)] ring-[var(--color-primary)]",
        mark: "bg-[var(--color-primary)]",
        value: "text-[var(--color-primary)]",
    },
} as const;

// Color según estado del proyecto
export const REGION_FILL: Record<MapStatus | "selected", string> = {
    sin_proyecto: "#d5dee7",
    completado: "#8dbe23",
    en_ejecucion: "#eda30f",
    selected: "#3d6b12",
};