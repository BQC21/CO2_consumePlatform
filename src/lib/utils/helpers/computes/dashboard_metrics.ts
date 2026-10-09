import { DashboardMetrics } from "@/lib/types/components/components";
import { Project } from "@/lib/types/supabase/project-types";
import { sumOrNull } from "../normalization";

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
