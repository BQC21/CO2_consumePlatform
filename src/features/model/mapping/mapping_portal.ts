import type { PortalProjectOption } from "@/lib/types/supabase/portal-project";
import { DEPARTMENT_OPTIONS } from "@/lib/utils/options";
import { toNullableNumber, toText } from "@/lib/utils/helpers/normalization";

// Tipado -- tabla Proyectos
type PortalProjectRow = {
  id: number;
  nombre: string | null;
  tipo_instalacion: string | null;
  zona_id: number | null;
};

// Tipado -- tabla Zonas
type PortalZoneRow = {
  id: number;
  departamento: string | null;
  zona: string | null;
};

// Tipado -- tabla Join Proyecto_equipos
type PortalJoinRow = {
  proyecto_id: number | null;
  equipo_id: number | null;
  cantidad: number | string | null;
};

// Tipado -- tabla Equipos Principales
type PortalEquipmentRow = {
  id: number;
  tipo_de_producto: string | null;
  marca: string | null;
  potencia_maxima: number | string | null;
};

// ----------
// MAPEADORES
// ----------

function fold(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function matchDepartment(value: string): string {
  const target = fold(value);
  return DEPARTMENT_OPTIONS.find((option) => fold(option) === target) ?? value.trim();
}

function mapSystem(value: string): string {
  const text = fold(value);
  if (text.includes("off")) {
    return "Off-grid";
  }
  if (text.includes("hibrid")) {
    return "Híbrido";
  }
  if (text.includes("on")) {
    return "On-grid";
  }
  return value.trim();
}

export function mapPortalCatalog(
  projects: PortalProjectRow[],
  zones: PortalZoneRow[],
  joins: PortalJoinRow[],
  equipment: PortalEquipmentRow[],
): PortalProjectOption[] {
  const zoneById = new Map(zones.map((zone) => [zone.id, zone]));
  const equipmentById = new Map(equipment.map((item) => [item.id, item]));

  return projects
    .map((project) => {
      const zone = project.zona_id === null ? undefined : zoneById.get(project.zona_id);
      let potNominal = 0;
      let capInstalada = 0;
      let hasInverter = false;
      let hasModule = false;
      let marca = "";

      for (const join of joins) {
        if (join.proyecto_id !== project.id || join.equipo_id === null) {
          continue;
        }
        const item = equipmentById.get(join.equipo_id);
        if (!item) {
          continue;
        }
        const tipo = fold(toText(item.tipo_de_producto));
        const power = (toNullableNumber(item.potencia_maxima) ?? 0) * (toNullableNumber(join.cantidad) ?? 1);
        if (tipo === "inversor") {
          hasInverter = true;
          potNominal += power;
          if (!marca) {
            marca = toText(item.marca);
          }
        }
        if (tipo === "modulo fv") {
          hasModule = true;
          capInstalada += power;
        }
      }

      return {
        id: project.id,
        nombre: toText(project.nombre),
        departamento: matchDepartment(toText(zone?.departamento)),
        distrito: toText(zone?.zona),
        tipo_de_sistema: mapSystem(toText(project.tipo_instalacion)),
        marca_inversor: marca,
        pot_nominal_kw: hasInverter ? potNominal : null,
        cap_instalada_kwp: hasModule ? capInstalada : null,
      };
    })
    .filter((project) => project.nombre)
    .sort((left, right) => left.nombre.localeCompare(right.nombre, "es"));
}
