import type { MonthlyEnergy } from "@/lib/types/supabase/monthly-energy";

export type EnergyTotals = {
  fv: number;
  grid: number;
  carga: number;
};

export type SeriesPoint = EnergyTotals & {
  label: string;
};

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function sum(rows: MonthlyEnergy[]): EnergyTotals {
  return rows.reduce(
    (total, row) => ({
      fv: total.fv + row.rendimiento_fv,
      grid: total.grid + row.rendimiento_grid,
      carga: total.carga + row.consumo_carga,
    }),
    { fv: 0, grid: 0, carga: 0 },
  );
}

export function totalsByProject(rows: MonthlyEnergy[]): Map<string, EnergyTotals> {
  const grouped = new Map<string, MonthlyEnergy[]>();
  for (const row of rows) {
    const current = grouped.get(row.proyecto_id) ?? [];
    current.push(row);
    grouped.set(row.proyecto_id, current);
  }
  return new Map([...grouped.entries()].map(([id, items]) => [id, sum(items)]));
}

export function monthPoint(rows: MonthlyEnergy[], projectId: string, year: number, month: number): EnergyTotals {
  const key = `${year}-${String(month).padStart(2, "0")}`;
  return sum(rows.filter((row) => row.proyecto_id === projectId && row.mes === key));
}

export function yearSeries(rows: MonthlyEnergy[], projectId: string, year: number): SeriesPoint[] {
  return MONTH_LABELS.map((label, index) => ({
    label,
    ...monthPoint(rows, projectId, year, index + 1),
  }));
}

export function multiYearSeries(rows: MonthlyEnergy[], projectId: string, today = new Date()): SeriesPoint[] {
  const years = new Set<number>([today.getFullYear()]);
  for (const row of rows) {
    if (row.proyecto_id !== projectId) {
      continue;
    }
    const year = Number(row.mes.slice(0, 4));
    if (Number.isFinite(year) && year > 0) {
      years.add(year);
    }
  }
  return [...years].sort((left, right) => left - right).map((year) => ({
    label: String(year),
    ...sum(rows.filter((row) => row.proyecto_id === projectId && row.mes.startsWith(`${year}-`))),
  }));
}

export function seriesHasValues(points: SeriesPoint[]): boolean {
  return points.some((point) => point.fv > 0 || point.grid > 0 || point.carga > 0);
}
