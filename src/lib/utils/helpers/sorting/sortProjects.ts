import type { Project } from "@/lib/types/supabase/project-types";
import type { ProjectSortingOrder } from "@/lib/utils/options";

export function sortProjects(projects: Project[], sorting: ProjectSortingOrder): Project[] {
  const copy = [...projects];
  copy.sort((left, right) => {
    if (sorting === "fecha_asc" || sorting === "fecha_desc") {
      const compare = left.fecha_instalacion.localeCompare(right.fecha_instalacion);
      return sorting === "fecha_asc" ? compare : -compare;
    }
    const compare = left.paneles_instalados - right.paneles_instalados;
    return sorting === "paneles_asc" ? compare : -compare;
  });
  return copy;
}
