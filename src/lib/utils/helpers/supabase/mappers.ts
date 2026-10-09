// ----------
// MAPEADORES
// ----------

import { PortalProjectOption } from "@/lib/types/supabase/portal-project";
import { DEPARTMENT_OPTIONS } from "../../options";
import { toNullableNumber, toText } from "../normalization";
import { PortalEquipmentRow, PortalJoinRow, PortalProjectRow, PortalZoneRow } from "@/lib/types/supabase/portal-project";

// Normalización de texto (Hola -> h o l a)
export function fold(value: string): string {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Enlazar con departamentos
export function matchDepartment(value: string): string {
    const target = fold(value);
    return DEPARTMENT_OPTIONS.find((option) => fold(option) === target) ?? value.trim();
}

// Enlazar tipo de sistema
export function mapSystem(value: string): string {
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

/** Un módulo registrado como palet trae la cantidad de palets en el join y los paneles de cada palet en el equipo. */
function installedPanels(item: PortalEquipmentRow, quantity: number): number {
    const perPallet = toNullableNumber(item.paneles_palet) ?? 0;
    const label = fold(`${toText(item.descripcion)} ${toText(item.unidad)}`);
    const isPallet = perPallet > 0 && (label.includes("pallet") || label.includes("palet"));
    return isPallet ? quantity * perPallet : quantity;
}

// Enlazamiento general con el Portal TEC
export function mapPortalCatalog(
    projects: PortalProjectRow[],
    zones: PortalZoneRow[],
    joins: PortalJoinRow[],
    equipment: PortalEquipmentRow[],
): PortalProjectOption[] {
    const zoneById = new Map(zones.map((zone) => [zone.id, zone]));
    const equipmentById = new Map(equipment.map((item) => [item.id, item]));

    return projects.map((project) => {
        // valores iniciales
        const zone = project.zona_id === null ? undefined : zoneById.get(project.zona_id);
        let potNominal = 0;
        let capInstalada = 0;
        let panelesInstalados = 0;
        let hasInverter = false;
        let hasModule = false;
        let marca = "";

        // Para cada relación Proyect - EP
        for (const join of joins) {
            if (join.proyecto_id !== project.id || join.equipo_id === null) {
                continue;
            }
            const item = equipmentById.get(join.equipo_id);
            if (!item) {
                continue;
            }
            const tipo = fold(toText(item.tipo_de_producto));
            const quantity = toNullableNumber(join.cantidad) ?? 0;
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
                panelesInstalados += installedPanels(item, quantity);
            }
        }

        return {
            id: project.id,
            nombre: toText(project.nombre),
            version: toText(project.version),
            departamento: matchDepartment(toText(zone?.departamento)),
            distrito: toText(zone?.zona),
            tipo_de_sistema: mapSystem(toText(project.tipo_instalacion)),
            marca_inversor: marca,
            pot_nominal_kw: hasInverter ? potNominal : null,
            cap_instalada_kwp: hasModule ? Number(capInstalada.toFixed(2)) : null,
            paneles_instalados: Math.round(panelesInstalados),
        };
    })
    .filter((project) => project.nombre)
    .sort((left, right) => left.nombre.localeCompare(right.nombre, "es"));
}
