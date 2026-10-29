import { UNBRANDED } from "../options";

// Determina si el producto (inversor, panel o batería) tiene marca o no
export function brandOrUnbranded(value: string): string {
    const text = value.trim();
    return text || UNBRANDED;
}

// Es un sistema off-grid?
export function isOffGrid(systemType: string): boolean {
    return systemType.trim().toLowerCase() === "off-grid";
}

function comparableBrand(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}

/** Marca del catálogo cuando coincide sin distinguir mayúsculas ni tildes. */
export function catalogOption(options: readonly string[], value: string): string {
    const text = value.trim();
    const target = comparableBrand(text);
    return options.find((option) => comparableBrand(option) === target) ?? text;
}

/** Conserva una marca que llega del portal y no está en el catálogo. */
export function optionsIncludingValue(options: readonly string[], value: string): string[] {
    const text = value.trim();
    if (!text || options.some((option) => comparableBrand(option) === comparableBrand(text))) {
        return [...options];
    }
    return [text, ...options];
}