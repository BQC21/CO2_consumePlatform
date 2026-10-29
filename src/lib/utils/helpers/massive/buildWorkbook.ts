import * as XLSX from "xlsx-js-style";

/** Margen para que el encabezado en negrita no quede cortado. */
const COLUMN_PADDING = 2;

/** Ancho de cada columna según el texto más largo del encabezado o de sus celdas. */
export function workbookColumnWidths(headers: string[], rows: string[][]): { wch: number }[] {
  return headers.map((header, index) => {
    const longest = rows.reduce((max, row) => Math.max(max, (row[index] ?? "").length), header.length);
    return { wch: longest + COLUMN_PADDING };
  });
}

// descargar workbook
export function downloadWorkbook(filename: string, headers: string[], rows: string[][]): void {
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  headers.forEach((_, index) => {
    const cell = sheet[XLSX.utils.encode_cell({ r: 0, c: index })];
    if (cell) {
      cell.s = {
        font: { bold: true, color: { rgb: "122134" } },
        fill: { fgColor: { rgb: "FCF4EC" } },
      };
    }
  });
  sheet["!cols"] = workbookColumnWidths(headers, rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Plantilla");
  XLSX.writeFile(workbook, filename);
}
