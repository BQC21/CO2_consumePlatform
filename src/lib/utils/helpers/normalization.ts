import type { SelectFieldOptions, SelectOption } from "@/lib/types/components/components";
import { MONTH_SHORT } from "@/lib/utils/consts/monthNames";

// ----------------
// -- Números ------
// ----------------

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

// Convertir a formato de comas
export function formatNumber(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  const fixed = value.toFixed(digits);
  const [whole, fraction] = fixed.split(".");
  const withThousands = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${withThousands}.${fraction}` : withThousands;
}

// Mostrar la métrica en pantalla
export function displayMetric(value: string): string {
  const parsed = toNullableNumber(value);
  return parsed === null ? "—" : formatNumber(parsed, 2);
}

// ------------------
// -- Unidades ------
// ------------------

/** kg se muestran como toneladas solo cuando el valor supera 1000. */
export function massFromKg(kg: number | null): { amount: number | null; unit: "kg" | "t" } {
  if (kg !== null && kg > 1000) {
    return { amount: kg / 1000, unit: "t" };
  }
  return { amount: kg, unit: "kg" };
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

/** Formato pedido en el modal de métricas: 10.2026. */
export function isSuggestedMonth(value: string): boolean {
  return /^(0[1-9]|1[0-2])\.\d{4}$/.test(value.trim());
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

export function formatDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  if (!match) {
    return "—";
  }
  return `${match[3]}/${match[2]}/${match[1]}`;
}

/** 12 oct 2026. Acepta yyyy-mm-dd y timestamps. */
export function formatDayMonthYear(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate.trim());
  if (match) {
    const month = Number(match[2]);
    if (month >= 1 && month <= 12) {
      return `${Number(match[3])} ${MONTH_SHORT[month - 1]} ${match[1]}`;
    }
  }
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }
  return `${parsed.getDate()} ${MONTH_SHORT[parsed.getMonth()]} ${parsed.getFullYear()}`;
}

export function formatMonthLabel(mes: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(mes);
  if (!match) {
    return mes || "—";
  }
  return `${match[2]}.${match[1]}`;
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "TE";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

// ----------------
// -- Celdas ------
// ----------------

// Normaliza las opciones a mostrarse en el selector
export function normalizeSelectOptions(options: SelectFieldOptions): SelectOption[] {
  return options.map((option) =>
      typeof option === "string" ? { value: option, label: option } : option
  );
}