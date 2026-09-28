import * as XLSX from "xlsx";
import { toIsoDate, toNullableNumber, toText, toYearMonth } from "@/lib/utils/helpers/normalization";

export type MassiveColumn = {
  header: string;
  field: string;
  kind: "text" | "number" | "integer" | "date" | "month";
  required?: boolean;
};

function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function readSheetRows(fileBuffer: ArrayBuffer): Record<string, string>[] {
  const workbook = XLSX.read(fileBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("El archivo no tiene hojas.");
  }
  const sheet = workbook.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
    header: 1,
    raw: false,
    defval: "",
  });
  if (matrix.length === 0) {
    throw new Error("La hoja está vacía.");
  }
  const headers = matrix[0].map((cell) => toText(cell));
  return matrix.slice(1).flatMap((row) => {
    const record: Record<string, string> = {};
    let hasValue = false;
    headers.forEach((header, index) => {
      if (!header) {
        return;
      }
      const value = toText(row[index]);
      record[header] = value;
      if (value) {
        hasValue = true;
      }
    });
    return hasValue ? [record] : [];
  });
}

export function assertHeaders(rows: Record<string, string>[], expectedHeaders: readonly string[]): void {
  const present = new Set(Object.keys(rows[0] ?? {}).map(normalizeHeader));
  const missing = expectedHeaders.filter((header) => !present.has(normalizeHeader(header)));
  if (rows.length === 0) {
    throw new Error("No hay filas para importar.");
  }
  if (missing.length > 0) {
    throw new Error(`Faltan columnas: ${missing.join(", ")}.`);
  }
}

export function valueByHeader(row: Record<string, string>, header: string): string {
  const target = normalizeHeader(header);
  const found = Object.entries(row).find(([key]) => normalizeHeader(key) === target);
  return found?.[1] ?? "";
}

export function transformAnnualRow(row: Record<string, string>, index: number): Record<string, string> {
  const nombre = valueByHeader(row, "PROYECTO / MES");
  if (!nombre) {
    throw new Error(`La fila ${index + 2} no tiene nombre de proyecto.`);
  }
  const fecha = valueByHeader(row, "FECHA INSTALACIÓN");
  if (fecha && !toIsoDate(fecha)) {
    throw new Error(`La fila ${index + 2} tiene una fecha que no se puede leer.`);
  }
  const numbers = ["POT. NOMINAL (kW)", "CAP. INSTALADA (kWp)", "Paneles instalados"];
  for (const header of numbers) {
    const raw = valueByHeader(row, header);
    if (raw && toNullableNumber(raw) === null) {
      throw new Error(`La fila ${index + 2} trae texto donde se espera un número (${header}).`);
    }
  }
  return row;
}

export function transformMonthRow(row: Record<string, string>, index: number): Record<string, string> {
  const proyecto = valueByHeader(row, "Proyecto") || valueByHeader(row, "PROYECTO / MES");
  const mes = valueByHeader(row, "Mes");
  if (!proyecto || !toYearMonth(mes)) {
    throw new Error(`La fila ${index + 2} necesita el proyecto y un mes (2026-01 o 01.2026).`);
  }
  const tipico = valueByHeader(row, "TÍPICO DIARIO");
  if (tipico && toNullableNumber(tipico) === null) {
    throw new Error(`La fila ${index + 2} trae texto donde se espera el típico diario.`);
  }
  return row;
}
