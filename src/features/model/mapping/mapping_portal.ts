import type { PortalProjectOption } from "@/lib/types/supabase/portal-project";
import { DEPARTMENT_OPTIONS } from "@/lib/utils/options";
import { toNullableNumber, toText } from "@/lib/utils/helpers/normalization";

// Tipado -- tabla Proyectos
export type PortalProjectRow = {
  id: number;
  nombre: string | null;
  tipo_instalacion: string | null;
  zona_id: number | null;
};

// Tipado -- tabla Zonas
export type PortalZoneRow = {
  id: number;
  departamento: string | null;
  zona: string | null;
};

// Tipado -- tabla Join Proyecto_equipos
export type PortalJoinRow = {
  proyecto_id: number | null;
  equipo_id: number | null;
  cantidad: number | string | null;
};

// Tipado -- tabla Equipos Principales
export type PortalEquipmentRow = {
  id: number;
  tipo_de_producto: string | null;
  marca: string | null;
  potencia_maxima: number | string | null;
};
