import * as XLSX from "xlsx-js-style";

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
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Plantilla");
  XLSX.writeFile(workbook, filename);
}
