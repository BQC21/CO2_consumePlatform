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

  /** Conserva una marca que llega del portal y no está en el catálogo. */
export function optionsIncludingValue(options: readonly string[], value: string): string[] {
    if (!value || options.includes(value)) {
        return [...options];
    }
    return [value, ...options];
}