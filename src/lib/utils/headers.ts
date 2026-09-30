/** Títulos visibles. La tabla no inventa otra redacción. */

// Proyectos anuales
export const PROJECT_ANNUAL_HEADERS = [
  "PROYECTO / MES",
  "UBICACIÓN",
  "TIPO DE SISTEMA",
  "POT. NOMINAL (kW)",
  "CAP. INSTALADA (kWp)",
  "FECHA INSTALACIÓN",
  "Marca del inversor",
  "Paneles instalados",
] as const;

// Proyectos mensuales
export const PROJECT_MONTH_HEADERS = [
  "PROYECTO / MES",
  "RENDIMIENTO FV (KWH)",
  "RENDIMIENTO GRID (KWH)",
  "Reducción de CO2 (kg)",
  "Árboles plantados",
  "Ahorro de carbón (kg)",
] as const;

// Para el modal de llenado de mes
export const MONTH_HEADERS = ["Proyecto", "Mes", "TÍPICO DIARIO", "POT. NOMINAL (kW)"] as const;