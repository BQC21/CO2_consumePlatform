/** Valores vacíos que la tabla muestra como raya, no como cero inventado. */
export const EMPTY_MARK = "—";

export function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === "";
}

export function displayOrEmpty(value: string | number | null | undefined): string {
  if (isEmptyValue(value)) {
    return EMPTY_MARK;
  }
  return String(value);
}
