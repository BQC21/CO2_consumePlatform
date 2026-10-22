import { DashboardMetrics, MonthlyRecordDraft } from "@/lib/types/components/components";
import { Project } from "@/lib/types/supabase/project-types";
import { splitYearMonth, sumOrNull, toNullableNumber } from "../normalization";

export type EnergyPeriod =
  | { mode: "anio"; year: number }
  | { mode: "mes"; month: number };

// Métricas a calcularse
export function computeDashboardMetrics(
  projects: Project[],
): DashboardMetrics {

  return {
    proyectosRegistrados: projects.length,
    proyectosCompletados: projects.filter((project) => project.estado === "completado").length,
    capacidadInstaladaKwp: projects.reduce((total, project) => total + (project.cap_instalada_kwp ?? 0), 0),
    produccionAnualMwh: sumOrNull(projects.map((project) => Number(project.rendimiento_fv_total)/1000)),
    paneles: sumOrNull(projects.map((project) => project.paneles_instalados)),
    co2Kg: sumOrNull(projects.map((project) => project.reduccion_co2)),
    carbonKg: sumOrNull(projects.map((project) => project.reduccion_carbon)),
    arboles: sumOrNull(projects.map((project) => project.arboles)),
  };
}

/** Años presentes en los registros mensuales, del más reciente al más antiguo. */
export function yearsInMonthlyRecords(records: Pick<MonthlyRecordDraft, "mes">[]): number[] {
  const years = new Set<number>();
  for (const record of records) {
    const parts = splitYearMonth(record.mes);
    if (parts) {
      years.add(parts.year);
    }
  }
  return [...years].sort((left, right) => right - left);
}

/** Suma el rendimiento fotovoltaico del año o del mes (en todos los años) y lo pasa a MWh. */
export function energyMwhForPeriod(records: MonthlyRecordDraft[], period: EnergyPeriod): number | null {
  const values = records.flatMap((record) => {
    const parts = splitYearMonth(record.mes);
    if (!parts) {
      return [];
    }
    const matches = period.mode === "anio" ? 
          parts.year === period.year : parts.month === period.month;
    if (!matches) {
      return [];
    }
    const kwh = toNullableNumber(record.rendimiento_fv);
    return kwh === null ? [] : [kwh / 1000];
  });
  if (values.length === 0) {
    return null;
  }
  return values.reduce((total, value) => total + value, 0);
}
