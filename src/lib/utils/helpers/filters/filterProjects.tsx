import { ProjectFilters } from "@/lib/types/components/components";
import type { Project } from "@/lib/types/supabase/project-types";
import { brandOrUnbranded } from "../options";

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {

  const search = filters.search.trim().toLowerCase(); // contenido de la barra de búsqueda
  
  return projects.filter((project) => {
    const matchesSearch =
      !search ||
      project.nombre.toLowerCase().includes(search) ||
      project.descripcion.toLowerCase().includes(search) ||
      project.distrito.toLowerCase().includes(search);
    const matchesDepartment = !filters.ubicacion || project.ubicacion === filters.ubicacion;
    const matchesBrand = !filters.marcaInversor || project.marca_inversor === filters.marcaInversor;
    const matchesPanel = !filters.marcaPanel || brandOrUnbranded(project.marca_panel) === filters.marcaPanel;
    const matchesBattery = !filters.marcaBateria || brandOrUnbranded(project.marca_bateria) === filters.marcaBateria;
    const matchesType = !filters.tipo || project.tipo_de_sistema === filters.tipo;
    const matchesStatus = !filters.estado || project.estado === filters.estado;

    // Retorno
    return matchesSearch && matchesDepartment && matchesBrand && 
          matchesPanel && matchesBattery && matchesType && matchesStatus;
  });
}