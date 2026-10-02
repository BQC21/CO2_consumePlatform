/** Títulos visibles. La tabla no inventa otra redacción. */

// Proyectos anuales
export const PROJECT_ANNUAL_HEADERS = [
  "PROYECTO / MES",
  "UBICACIÓN",
  "TIPO DE SISTEMA",
  // "POT. NOMINAL (kW)",
  "CAP. INSTALADA (kWp)",
  "FECHA INSTALACIÓN",
  "MARCA DEL INVERSOR",
  // "PANELES INSTALADOS",
  "RENDIMIENTO FV TOTAL",
  "RENDIMIENTO GRID TOTAL",
  "CONSUMO CARGA TOTAL",
  "REDUCCIÓN CO2 TOTAL", 
  "REDUCCIÓN CARBON TOTAL",
  "ÁRBOLES TOTALES"
] as const;

// Proyectos mensuales
export const PROJECT_MONTH_HEADERS = [
  "PROYECTO / MES",
  "RENDIMIENTO FV (KWH)",
  "RENDIMIENTO GRID (KWH)",
  "CONSUMO CARGA (KWH)",
] as const;

// Para el modal de llenado de mes
export const MONTH_HEADERS = ["Proyecto", "Mes", "TÍPICO DIARIO", "POT. NOMINAL (kW)"] as const;