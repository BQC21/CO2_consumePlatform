import type { Project, ProjectMonth } from "@/lib/types/supabase/project-types";

export type ProjectFilters = {
  search: string;
  ubicacion: string;
  marcaInversor: string;
};

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
  const search = filters.search.trim().toLowerCase();
  return projects.filter((project) => {
    const matchesSearch =
      !search ||
      project.nombre.toLowerCase().includes(search) ||
      project.descripcion.toLowerCase().includes(search) ||
      project.distrito.toLowerCase().includes(search);
    const matchesDepartment = !filters.ubicacion || project.ubicacion === filters.ubicacion;
    const matchesBrand = !filters.marcaInversor || project.marca_inversor === filters.marcaInversor;
    return matchesSearch && matchesDepartment && matchesBrand;
  });
}

export function filterMonthsByProjects(months: ProjectMonth[], projects: Project[]): ProjectMonth[] {
  const ids = new Set(projects.map((project) => project.id));
  return months.filter((month) => ids.has(month.proyecto_id));
}
