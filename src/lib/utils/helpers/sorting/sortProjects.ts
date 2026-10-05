import { ProjectSortingOrder } from "@/lib/types/components/options";
import type { Project } from "@/lib/types/supabase/project-types";

export function sortProjects(projects: Project[], sorting: ProjectSortingOrder): Project[] {
  const copy = [...projects];
  copy.sort((left, right) => {
    const compare = left.fecha_instalacion.localeCompare(right.fecha_instalacion);
    return sorting === "fecha_asc" ? compare : -compare;
  });
  return copy;
}
