import { UNBRANDED } from "../../options";
import { brandOrUnbranded } from "../options";

// Función para mostrar la marca del panel
export function displayBrand(value: string): string {
    const brand = brandOrUnbranded(value);
    return brand === UNBRANDED ? "—" : brand;
}

// Función para mostrar el estado del proyecto
export function StatusPill({ completed }: { completed: boolean }) {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${completed ? "bg-[#e5f6e8] text-[#1f7a32]" : "bg-[#fff1e8] text-[#c44712]"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${completed ? "bg-[#3caf53]" : "bg-[#f05a1a]"}`} />
        {completed ? "Completado" : "En ejecución"}
        </span>
    );
}

// Función para mostrar el chevron
export function Chevron({ open }: { open: boolean }) {
    return (
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M6 3.5 11 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}