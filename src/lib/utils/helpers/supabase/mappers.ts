// ----------
// MAPEADORES
// ----------

import { PortalProjectOption } from "@/lib/types/supabase/portal-project";
import { DEPARTMENT_OPTIONS } from "../../options";
import { toNullableNumber, toText } from "../normalization";
import { PortalEquipmentRow, PortalJoinRow, PortalProjectRow, PortalQuotationRow, PortalZoneRow } from "@/lib/types/supabase/portal-project";

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
    if (text.includes("bess")) {
        return "BESS";
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
        let marcaPanel = "";
        let marcaBateria = "";

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
                if (!marcaPanel) {
                    marcaPanel = toText(item.marca);
                }
            }
            if (tipo === "bateria" && !marcaBateria) {
                marcaBateria = toText(item.marca);
            }
        }

        return {
            id: project.id,
            proyectoId: project.id,
            nombre: toText(project.nombre),
            version: toText(project.version),
            departamento: matchDepartment(toText(zone?.departamento)),
            distrito: toText(zone?.zona),
            tipo_de_sistema: mapSystem(toText(project.tipo_instalacion)),
            marca_inversor: marca,
            marca_panel: marcaPanel,
            marca_bateria: marcaBateria,
            pot_nominal_kw: hasInverter ? potNominal : null,
            cap_instalada_kwp: hasModule ? Number(capInstalada.toFixed(2)) : null,
            paneles_instalados: Math.round(panelesInstalados),
        };
    })
    .filter((project) => project.nombre)
    .sort((left, right) => left.nombre.localeCompare(right.nombre, "es"));
}

// Número de la versión de la cotización
function versionNumber(version: string | null): number {
    return toNullableNumber(version) ?? -1;
}

// Extraer el nombre de cotización para cotizaciones asociada a proyectos
function quotationGroupKey(quote: PortalQuotationRow): string {
    if (quote.proyecto_id !== null) {
        return `proyecto:${quote.proyecto_id}`;
    }
    const name = fold(toText(quote.nombre_cotizacion));
    return name ? `nombre:${name}` : `cotizacion:${quote.id}`;
}

// Verifica si la versión siguiente es mayor a la actual
function quoteOutranks(next: PortalQuotationRow, current: PortalQuotationRow): boolean {
    const nextVersion = versionNumber(next.version);
    const currentVersion = versionNumber(current.version);
    if (nextVersion !== currentVersion) {
        return nextVersion > currentVersion;
    }
    return toText(next.updated_at) > toText(current.updated_at);
}

// Cálculo del número de paneles a partir de Costos manuales 
function panelsFromManualCosts(costos: unknown): number {
    if (!costos || typeof costos !== "object") {
        return 0;
    }
    const equipos = (costos as { Recursos?: { equipos_seleccionados?: unknown } }).Recursos?.equipos_seleccionados;
    if (!Array.isArray(equipos)) {
        return 0;
    }
    let total = 0;
    for (const entry of equipos) {
        if (!entry || typeof entry !== "object") {
            continue;
        }
        const row = entry as { cantidad?: unknown; equipo_info?: PortalEquipmentRow | null };
        const item = row.equipo_info;
        if (!item || fold(toText(item.tipo_de_producto)) !== "modulo fv") {
            continue;
        }
        total += installedPanels(item, toNullableNumber(row.cantidad) ?? 0);
    }
    return Math.round(total);
}

function brandsFromSelectedEquipment(costos: unknown): { marca_panel: string; marca_bateria: string } {
    const empty = { marca_panel: "", marca_bateria: "" };
    if (!costos || typeof costos !== "object") {
        return empty;
    }
    const equipos = (costos as { Recursos?: { equipos_seleccionados?: unknown } }).Recursos?.equipos_seleccionados;
    if (!Array.isArray(equipos)) {
        return empty;
    }
    let marca_panel = "";
    let marca_bateria = "";
    for (const entry of equipos) {
        if (!entry || typeof entry !== "object") {
            continue;
        }
        const item = (entry as { equipo_info?: PortalEquipmentRow | null }).equipo_info;
        if (!item) {
            continue;
        }
        const tipo = fold(toText(item.tipo_de_producto));
        const marca = toText(item.marca);
        if (tipo === "modulo fv" && !marca_panel) {
            marca_panel = marca;
        }
        if (tipo === "bateria" && !marca_bateria) {
            marca_bateria = marca;
        }
    }
    return { marca_panel, marca_bateria };
}

/** Una fila por proyecto: si hay varias versiones de cotización, se conserva la más reciente. */
export function mapPortalQuotations(
    quotes: PortalQuotationRow[],
    projects: PortalProjectRow[],
    zones: PortalZoneRow[],
    joins: PortalJoinRow[],
    equipment: PortalEquipmentRow[],
): PortalProjectOption[] {
    const projectById = new Map(mapPortalCatalog(projects, zones, joins, equipment).map((item) => [item.id, item]));
    const chosen = new Map<string, PortalQuotationRow>();

    for (const quote of quotes) {
        const current = chosen.get(quotationGroupKey(quote));
        if (!current || quoteOutranks(quote, current)) {
            chosen.set(quotationGroupKey(quote), quote);
        }
    }

    return [...chosen.values()].flatMap((quote) => {
        const quoteName = toText(quote.nombre_cotizacion);
        const project = quote.proyecto_id === null ? undefined : projectById.get(quote.proyecto_id);
        const selectedBrands = brandsFromSelectedEquipment(quote.costos_manuales);
        const nombre = quoteName || project?.nombre || "";
        if (!nombre) {
            return [];
        }
        return [{
            id: quote.id,
            proyectoId: quote.proyecto_id,
            nombre,
            version: toText(quote.version),
            departamento: project?.departamento ?? "",
            distrito: project?.distrito ?? "",
            tipo_de_sistema: project?.tipo_de_sistema ?? "",
            marca_inversor: project?.marca_inversor ?? "",
            marca_panel: selectedBrands.marca_panel || project?.marca_panel || "",
            marca_bateria: selectedBrands.marca_bateria || project?.marca_bateria || "",
            pot_nominal_kw: project?.pot_nominal_kw ?? null,
            cap_instalada_kwp: project?.cap_instalada_kwp ?? null,
            paneles_instalados: panelsFromManualCosts(quote.costos_manuales),
        }];
    }).sort((left, right) => left.nombre.localeCompare(right.nombre, "es"));
}
