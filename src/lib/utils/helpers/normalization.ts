import { SelectFieldOptions, SelectOption } from "@/lib/types/components/components";

// ----------------
// -- Números ------
// ----------------

// Convertir a número
export function toNumber(value: unknown, fallback = 0): number {
  return toNullableNumber(value) ?? fallback;
}

/** Convierte lo que escribe una persona o una celda Excel a número, o a null si no hay dato. */
export function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  let cleaned = String(value).trim().replace(/\s/g, "");
  if (cleaned.includes(",") && cleaned.includes(".")) {
    cleaned = cleaned.replace(/,/g, "");
  } else {
    cleaned = cleaned.replace(",", ".");
  }
  if (!cleaned || cleaned === "—" || cleaned === "-") {
    return null;
  }
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

// Convertr a un entero nulo
export function toNullableInteger(value: unknown): number | null {
  const parsed = toNullableNumber(value);
  if (parsed === null) {
    return null;
  }
  return Math.trunc(parsed);
}

// Convertir a entero
export function toInteger(value: unknown, fallback = 0): number {
  return toNullableInteger(value) ?? fallback;
}

// Convertir a texto
export function toText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

// Convertir número a String para mostrarlo en pantalla
export function numberToInput(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

// Acumular el total de algo
export function sumOrNull(values: Array<number | null>): number | null {
  const present = values.filter((value): value is number => value !== null);
  if (present.length === 0) {
    return null;
  }
  return present.reduce((total, value) => total + value, 0);
}

// ----------------
// -- Fechas ------
// ----------------

/** Acepta 2026-05-03, 03/05/2026 y 03.05.2026. Devuelve ISO yyyy-mm-dd. */
export function toIsoDate(value: unknown): string {
  const text = toText(value);
  if (!text) {
    return "";
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10);
  }
  const slash = text.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
  if (slash) {
    const day = slash[1].padStart(2, "0");
    const month = slash[2].padStart(2, "0");
    return `${slash[3]}-${month}-${day}`;
  }
  return "";
}

/** Acepta 2026-01 y 09.2026. Devuelve yyyy-mm. */
export function toYearMonth(value: unknown): string {
  const text = toText(value);
  if (!text) {
    return "";
  }
  const iso = text.match(/^(\d{4})-(\d{2})/);
  if (iso) {
    return `${iso[1]}-${iso[2]}`;
  }
  const dotted = text.match(/^(\d{1,2})[./](\d{4})$/);
  if (dotted) {
    return `${dotted[2]}-${dotted[1].padStart(2, "0")}`;
  }
  return "";
}

// Rescatar la fecha sin considerar el días
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// Separar Mes y Año
export function splitYearMonth(mes: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(mes);
  if (!match) {
    return null;
  }
  return { year: Number(match[1]), month: Number(match[2]) };
}

// Formato de fecha
export function toTimestamp(value: string): string {
  const text = value.trim();
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
    return text;
  }
  return toIsoDate(text);
}


// ----------------
// -- Celdas ------
// ----------------

import { EMPTY_MARK } from "../empty";

// Indicador de celda vacía
export function isEmptyValue(value: unknown): boolean {
    return value === null || value === undefined || value === "";
}

// Qué mostrar según la existencia de contenida en la celda
export function displayOrEmpty(value: string | number | null | undefined): string {
    if (isEmptyValue(value)) {
        return EMPTY_MARK;
    }
    return String(value);
}

// Normaliza las opciones a mostrarse en el selector
export function normalizeSelectOptions(options: SelectFieldOptions): SelectOption[] {
  return options.map((option) =>
      typeof option === "string" ? { value: option, label: option } : option
  );
}