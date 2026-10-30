import { MapStatus } from "@/lib/types/components/options";
import { Project } from "@/lib/types/supabase/project-types";
import { formatDayMonthYear } from "@/lib/utils/helpers/normalization";

/** Estado del departamento */
export function departmentStatus(nombre: string, projects: Project[]): MapStatus {
  const local = projects.filter((project) => project.ubicacion === nombre);
  if (local.some((project) => project.estado === "en_ejecucion")) {
    return "en_ejecucion";
  }
  if (local.some((project) => project.estado === "completado")) {
    return "completado";
  }
  return "sin_proyecto";
}

/** Duración de un video, en m:ss. */
export function formatMediaDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "";
  }
  const seconds = Math.round(totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

/** Tamaño de archivo para la lista de subida. */
export function formatByteSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  const megabytes = bytes / (1024 * 1024);
  return `${megabytes >= 10 ? Math.round(megabytes) : megabytes.toFixed(1)} MB`;
}

/** Fecha de instalación en el bloque de la galería. */
export function formatGalleryInstallation(isoDate: string): string {
  const label = formatDayMonthYear(isoDate);
  return label === "—" ? "Sin fecha de instalación" : label;
}

/** Fecha de actualización debajo de la de instalación. */
export function formatGalleryUpdated(isoDate: string): string {
  const label = formatDayMonthYear(isoDate);
  return label === "—" ? "Sin actualización" : `Actualizado ${label}`;
}

/** Potencia mostrada en el modal de un proyecto. */
export function formatGalleryPower(kwp: number | null): string {
  if (kwp == null || !Number.isFinite(kwp)) {
    return "";
  }
  const text = kwp.toLocaleString("es-PE", { maximumFractionDigits: 2 });
  return `${text} kWp`;
}