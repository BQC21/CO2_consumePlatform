import { createPortalClient } from "@/features/model/supabase/portalClient";
import type { PortalProjectOption } from "@/lib/types/supabase/portal-project";
import { mapPortalCatalog } from "@/lib/utils/helpers/supabase/mappers";
import { hasPortalEnv } from "@/lib/utils/helpers/supabase/validator";

export async function getPortalProjects(): Promise<PortalProjectOption[]> {
  // En caso no se conecte con el portal corporativo TEC
  if (!hasPortalEnv()) {
    throw new Error("Configura el portal TEC para jalar un proyecto existente.");
  }
  // Crea el cliente para enlazarlo con el portal corporativo
  const portal = createPortalClient();
  // Reunir qué queremos extraer
  const [projects, zones, joins, equipment] = await Promise.all([
    portal.from("proyectos").select("id, nombre, version, tipo_instalacion, zona_id"),
    portal.from("zonas").select("id, departamento, zona"),
    portal.from("join_proyecto_equipos").select("proyecto_id, equipo_id, cantidad"),
    portal.from("equipo_principales").select("id, tipo_de_producto, marca, potencia_maxima, descripcion, unidad, paneles_palet"),
  ]);
  
  // Errores de lectura
  const error = projects.error || zones.error || joins.error || equipment.error;
  if (error) {
    throw new Error(`Error al leer el portal TEC: ${error.message}`);
  }

  // Enlazar con la información relacionada al proyecto
  return mapPortalCatalog(projects.data ?? [], zones.data ?? [], joins.data ?? [], equipment.data ?? []);
}
