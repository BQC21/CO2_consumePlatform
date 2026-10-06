import { DashboardMetrics } from "@/lib/types/components/components";
import { MonthlyEnergy } from "@/lib/types/supabase/monthly-energy";
import { Project } from "@/lib/types/supabase/project-types";

// Acumular el total de algo
function sumOrNull(values: Array<number | null>): number | null {
  const present = values.filter((value): value is number => value !== null);
  if (present.length === 0) {
    return null;
  }
  return present.reduce((total, value) => total + value, 0);
}

// Métricas a calcularse
export function computeDashboardMetrics(
  projects: Project[],
  months: MonthlyEnergy[],
  today = new Date(),
): DashboardMetrics {
  const year = today.getFullYear();
  const monthKey = `${year}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const yearRows = months.filter((row) => row.mes.startsWith(`${year}-`));
  const monthRows = months.filter((row) => row.mes === monthKey);

  return {
    proyectosRegistrados: projects.length,
    proyectosCompletados: projects.filter((project) => project.estado === "completado").length,
    capacidadInstaladaKwp: projects.reduce((total, project) => total + (project.cap_instalada_kwp ?? 0), 0),
    produccionMensualMwh: monthRows.reduce((total, row) => total + row.rendimiento_fv, 0) / 1000,
    produccionAnualMwh: yearRows.reduce((total, row) => total + row.rendimiento_fv, 0) / 1000,
    co2Kg: sumOrNull(projects.map((project) => project.reduccion_co2)),
    carbonKg: sumOrNull(projects.map((project) => project.reduccion_carbon)),
    arboles: sumOrNull(projects.map((project) => project.arboles)),
  };
}
