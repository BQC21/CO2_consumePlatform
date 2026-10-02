import { DashboardMetrics } from "@/lib/types/components/components";
import { Meta } from "@/lib/types/supabase/meta-types";
import { Project } from "@/lib/types/supabase/project-types";
import { ProjectMonth } from "@/lib/types/supabase/projectMonth-types";

// Separar mes y año de instalación
function installationParts(fecha: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})/.exec(fecha);
  if (!match) {
    return null;
  }
  return { year: Number(match[1]), month: Number(match[2]) };
}

// Referenciar mes
export function referenceMonth(anio: number, today = new Date()): string {
  const month = anio === today.getFullYear() ? today.getMonth() + 1 : 12;
  return `${anio}-${String(month).padStart(2, "0")}`;
}


export function computeDashboardMetrics(
  projects: Project[],
  months: ProjectMonth[],
  meta: Meta,
  today = new Date(),
  selectedMonth?: number,
): DashboardMetrics {

  // Mes de referencia
  const monthKey =
    selectedMonth && selectedMonth >= 1 && selectedMonth <= 12
      ? `${meta.anio}-${String(selectedMonth).padStart(2, "0")}`
      : referenceMonth(meta.anio, today);

  // Producción anual
  const produccionAnualKwh = months
    .filter((row) => row.mes.startsWith(`${meta.anio}-`))
    .reduce((total, row) => total + Number(row.rendimiento_fv) , 0);
  
  // Producción mensual
    const produccionMensualKwh = months
    .filter((row) => row.mes === monthKey)
    .reduce((total, row) => total + Number(row.rendimiento_fv), 0);
  
  return {
    proyectosRegistrados: projects.length,
    proyectosCompletados: projects.filter((project) => project.estado === "completado").length,
    capacidadInstaladaKwp: projects.reduce((total, project) => total + (project.cap_instalada_kwp ?? 0), 0),
    produccionMensualMwh: produccionMensualKwh / 1000,
    produccionAnualMwh: produccionAnualKwh / 1000,
  };
}
