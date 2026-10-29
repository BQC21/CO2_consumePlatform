import { MapStatus } from "@/lib/types/components/options";
import { Project } from "@/lib/types/supabase/project-types";

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