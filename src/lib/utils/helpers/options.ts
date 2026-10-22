import { UNBRANDED } from "../options";

export function brandOrUnbranded(value: string): string {
    const text = value.trim();
    return text || UNBRANDED;
}

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