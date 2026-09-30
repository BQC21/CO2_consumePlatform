import { DashboardMetrics } from "@/lib/types/components/components";
import { Meta } from "@/lib/types/supabase/meta-types";
import { Project } from "@/lib/types/supabase/project-types";
import { ProjectMonth } from "@/lib/types/supabase/projectMonth-types";

// Calcular el progreso
export function computeProgress(actual: number, meta: number): number {
  if (meta <= 0) {
    return 0;
  }
  return (actual / meta) * 100;
}

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

  // Paneles por año
  const panelesAnio = projects.reduce((total, project) => {
    const parts = installationParts(project.fecha_instalacion);
    return parts?.year === meta.anio ? total + project.paneles_instalados : total;
  }, 0);

  // Paneles por mes
  const panelesMes = projects.reduce((total, project) => {
    const parts = installationParts(project.fecha_instalacion);
    const key = parts ? `${parts.year}-${String(parts.month).padStart(2, "0")}` : "";
    return key === monthKey ? total + project.paneles_instalados : total;
  }, 0);

  // Producción anual
  const produccionAnualKwh = months
    .filter((row) => row.mes.startsWith(`${meta.anio}-`))
    .reduce((total, row) => total + Number(row.rendimiento_fv) , 0);
  
  // Producción mensual
    const produccionMensualKwh = months
    .filter((row) => row.mes === monthKey)
    .reduce((total, row) => total + Number(row.rendimiento_fv), 0);
  
  // Carbón anual
  const carbonAnualKg = months
    .filter((row) => row.mes.startsWith(`${meta.anio}-`))
    .reduce((total, row) => total + Number(row.reduccion_carbon), 0);
  
  // Carbon acumulado
  const carbonAcumuladoKg = months.reduce((total, row) => total + Number(row.reduccion_carbon), 0);

  return {
    proyectosRegistrados: projects.length,
    proyectosCompletados: projects.filter((project) => project.estado === "completado").length,
    capacidadInstaladaKwp: projects.reduce((total, project) => total + (project.cap_instalada_kwp ?? 0), 0),
    panelesAnio,
    panelesMes,
    panelesAcumulados: projects.reduce((total, project) => total + project.paneles_instalados, 0),
    produccionMensualMwh: produccionMensualKwh / 1000,
    produccionAnualMwh: produccionAnualKwh / 1000,
    carbonAnualMg: carbonAnualKg / 1000,
    carbonAcumuladoMg: carbonAcumuladoKg / 1000,
    avanceAnual: computeProgress(panelesAnio, meta.meta_paneles_anual),
    avanceMensual: computeProgress(panelesMes, meta.meta_paneles_mensual),
  };
}
