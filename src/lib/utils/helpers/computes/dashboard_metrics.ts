import type { Meta, Project, ProjectMonth } from "../../../types/supabase/project-types";
import { computeMonthEnergy, type MonthEnergy } from "./energy_total";

export type DashboardMetrics = {
  proyectosRegistrados: number;
  proyectosCompletados: number;
  capacidadInstaladaKwp: number;
  panelesAnio: number;
  panelesMes: number;
  panelesAcumulados: number;
  produccionMensualMwh: number;
  produccionAnualMwh: number;
  carbonAnualMg: number;
  carbonAcumuladoMg: number;
  avanceAnual: number;
  avanceMensual: number;
};

export function computeProgress(actual: number, meta: number): number {
  if (meta <= 0) {
    return 0;
  }
  return (actual / meta) * 100;
}

function installationParts(fecha: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})/.exec(fecha);
  if (!match) {
    return null;
  }
  return { year: Number(match[1]), month: Number(match[2]) };
}

export function referenceMonth(anio: number, today = new Date()): string {
  const month = anio === today.getFullYear() ? today.getMonth() + 1 : 12;
  return `${anio}-${String(month).padStart(2, "0")}`;
}

export function computeDashboardMetrics(
  projects: Project[],
  months: ProjectMonth[],
  meta: Meta,
  today = new Date(),
): DashboardMetrics {
  const monthKey = referenceMonth(meta.anio, today);
  const energies: MonthEnergy[] = months.map((row) => computeMonthEnergy(row.tipico_diario, row.mes));

  const panelesAnio = projects.reduce((total, project) => {
    const parts = installationParts(project.fecha_instalacion);
    return parts?.year === meta.anio ? total + project.paneles_instalados : total;
  }, 0);

  const panelesMes = projects.reduce((total, project) => {
    const parts = installationParts(project.fecha_instalacion);
    const key = parts ? `${parts.year}-${String(parts.month).padStart(2, "0")}` : "";
    return key === monthKey ? total + project.paneles_instalados : total;
  }, 0);

  const produccionAnualKwh = energies
    .filter((row) => row.mes.startsWith(`${meta.anio}-`))
    .reduce((total, row) => total + row.energiaKwh, 0);
  const produccionMensualKwh = energies
    .filter((row) => row.mes === monthKey)
    .reduce((total, row) => total + row.energiaKwh, 0);
  const carbonAnualKg = energies
    .filter((row) => row.mes.startsWith(`${meta.anio}-`))
    .reduce((total, row) => total + row.carbonKg, 0);
  const carbonAcumuladoKg = energies.reduce((total, row) => total + row.carbonKg, 0);

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
