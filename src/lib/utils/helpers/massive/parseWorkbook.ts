import * as XLSX from "xlsx";
import type { ImportedProjectBlock, MonthlyRecordDraft } from "@/lib/types/components/components";
import { toIsoDate, toNullableNumber, toText, toYearMonth } from "@/lib/utils/helpers/normalization";
import { sortMonthRecords } from "@/lib/utils/helpers/render/monthTable";

type SheetCell = string | number | boolean | Date | null;
type SheetMatrix = SheetCell[][];

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
  const sheetName = workbook.SheetNames.find((name) => name.includes("Rendimiento FV (kWh)"));

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

// Obtener text de la celda
function cellText(value: SheetCell | undefined): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  return toText(value);
}

/** Número de celda. "25 toneladas" y "2 mil" pasan a kg o unidades; la celda vacía queda vacía. */
function metricInput(value: SheetCell | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }
  const text = cellText(value).toLowerCase();
  if (!text || text === "—" || text === "-") {
    return "";
  }
  const toneladas = /\btoneladas?\b/.test(text);
  const mil = /\bmil\b/.test(text);
  const numeric = toNullableNumber(text.replace(/\b(toneladas?|kg|mil)\b/gi, " "));
  if (numeric === null) {
    return "";
  }
  return String(toneladas || mil ? numeric * 1000 : numeric);
}

// Fecha de instalación
function installationDate(value: SheetCell | undefined): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${value.getFullYear()}-${month}-${day}`;
  }
  return toIsoDate(cellText(value));
}

// Matriz de hojas
function sheetMatrix(sheet: XLSX.WorkSheet): SheetMatrix {
  return XLSX.utils.sheet_to_json<SheetCell[]>(sheet, {
    header: 1,
    raw: true,
    defval: null,
    blankrows: true,
  });
}

// Encontrar columnas a partir de los encabezados
function findColumn(headers: string[], matches: (header: string) => boolean): number {
  return headers.findIndex(matches);
}

// Leer contenido de los bloques de proyecto
function readBlocksFromMatrix(matrix: SheetMatrix, headerIndex: number): ImportedProjectBlock[] {
  const headers = (matrix[headerIndex] ?? []).map((cell) => normalizeHeader(cellText(cell)));
  const columns = {
    fv: findColumn(headers, (header) => header.includes("rendimiento fv")),
    grid: findColumn(headers, (header) => header.includes("importada") || header.includes("rendimiento grid")),
    carga: findColumn(headers, (header) => header.includes("consumo de carga") || header.includes("rendimiento de la carga")),
    co2: findColumn(headers, (header) => header.includes("co2")),
    arboles: findColumn(headers, (header) => header.includes("arbol")),
    carbon: findColumn(headers, (header) => header.includes("carbon")),
    tipo: findColumn(headers, (header) => header.includes("tipo de sistema")),
    pot: findColumn(headers, (header) => header.includes("nominal")),
    cap: findColumn(headers, (header) => header.includes("capacidad instalada")),
    fecha: findColumn(headers, (header) => header.includes("fecha instalacion")),
  };

  if (columns.fv < 0 || columns.grid < 0 || columns.carga < 0) {
    throw new Error("La hoja no trae las columnas de rendimiento FV, red y carga.");
  }

  const blocks: ImportedProjectBlock[] = [];
  let current: { nombre: string; months: MonthlyRecordDraft[] } | null = null;

  for (let index = headerIndex + 1; index < matrix.length; index += 1) {
    const row = matrix[index] ?? [];
    const label = cellText(row[0]);
    if (!label) {
      continue;
    }
    const rowNumber = index + 1;
    const month = toYearMonth(label);
    if (month) {
      if (!current) {
        throw new Error(`La fila ${rowNumber} tiene un mes sin proyecto.`);
      }
      if (current.months.some((record) => record.mes === month)) {
        throw new Error(`La fila ${rowNumber} repite el mes ${month} en ${current.nombre}.`);
      }
      current.months.push({
        mes: month,
        rendimiento_fv: metricInput(row[columns.fv]),
        rendimiento_grid: metricInput(row[columns.grid]),
        rendimiento_carga: metricInput(row[columns.carga]),
      });
      continue;
    }
    if (normalizeHeader(label) === "total") {
      if (!current) {
        throw new Error(`La fila ${rowNumber} cierra un bloque sin nombre de proyecto.`);
      }
      const valueAt = (column: number) => (column < 0 ? "" : metricInput(row[column]));
      blocks.push({
        nombre: current.nombre,
        months: sortMonthRecords(current.months),
        tipo_de_sistema: columns.tipo < 0 ? "" : cellText(row[columns.tipo]),
        pot_nominal_kw: valueAt(columns.pot),
        cap_instalada_kwp: valueAt(columns.cap),
        fecha_instalacion: columns.fecha < 0 ? "" : installationDate(row[columns.fecha]),
        rendimiento_fv_total: valueAt(columns.fv),
        rendimiento_grid_total: valueAt(columns.grid),
        carga_consumida_total: valueAt(columns.carga),
        reduccion_co2: valueAt(columns.co2),
        reduccion_carbon: valueAt(columns.carbon),
        arboles: valueAt(columns.arboles),
      });
      current = null;
      continue;
    }
    if (current) {
      throw new Error(`El proyecto ${current.nombre} no cierra con una fila Total.`);
    }
    current = { nombre: label, months: [] };
  }

  if (current) {
    throw new Error(`El proyecto ${current.nombre} no cierra con una fila Total.`);
  }
  if (blocks.length === 0) {
    throw new Error("No hay proyectos para importar.");
  }
  return blocks;
}

// identificar bloques de proyecto
export function readProjectBlocks(fileBuffer: ArrayBuffer): ImportedProjectBlock[] {
  const workbook = XLSX.read(fileBuffer, { type: "array", cellDates: true });
  for (const sheetName of workbook.SheetNames) {
    const matrix = sheetMatrix(workbook.Sheets[sheetName]);
    const headerIndex = matrix.findIndex((row) => {
      const headers = row.map((cell) => normalizeHeader(cellText(cell)));
      return headers.some((header) => header.includes("rendimiento fv")) && 
            headers.some((header) => header.includes("fecha instalacion"));
    });
    if (headerIndex >= 0) {
      return readBlocksFromMatrix(matrix, headerIndex);
    }
  }
  throw new Error("No se encontró la hoja con los bloques de proyectos.");
}
