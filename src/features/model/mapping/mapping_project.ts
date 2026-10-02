import type { Project, ProjectFormState, SupabaseProjectRow } from "../../../lib/types/supabase/project-types";
import type { ProjectStatus } from "../../../lib/types/components/options";
import { numberToInput, toInteger, toIsoDate, toNullableNumber, toText } from "../../../lib/utils/helpers/normalization";

function toStatus(value: string): ProjectStatus {
  return value === "completado" ? "completado" : "en_ejecucion";
}

export function mapSupabaseRowToProject(row: SupabaseProjectRow): Project {
  return {
    id: String(row.id ?? ""),
    nombre: toText(row.nombre),
    ubicacion: toText(row.ubicacion),
    distrito: toText(row.distrito),
    tipo_de_sistema: toText(row.tipo_de_sistema),
    pot_nominal_kw: toNullableNumber(row.pot_nominal_kw),
    cap_instalada_kwp: toNullableNumber(row.cap_instalada_kwp),
    fecha_instalacion: toIsoDate(row.fecha_instalacion),
    marca_inversor: toText(row.marca_inversor),
    rendimiento_fv_total: toNullableNumber(row.rendimiento_fv_total),
    rendimiento_grid_total: toNullableNumber(row.rendimiento_grid_total),
    carga_consumida_total: toNullableNumber(row.carga_consumida_total),
    paneles_instalados: toNullableNumber(row.paneles_instalados),
    reduccion_co2: toNullableNumber(row.reduccion_co2),
    reduccion_carbon: toNullableNumber(row.reduccion_carbon),
    arboles: toNullableNumber(row.arboles),
    estado: toStatus(toText(row.estado)),
    descripcion: toText(row.descripcion),
    updated_at: toText(row.updated_at),
  };
}

export function createProjectFormStateFromProject(project: Project): ProjectFormState {
  return {
    nombre: project.nombre,
    ubicacion: project.ubicacion,
    distrito: project.distrito,
    tipo_de_sistema: project.tipo_de_sistema,
    pot_nominal_kw: numberToInput(project.pot_nominal_kw),
    cap_instalada_kwp: numberToInput(project.cap_instalada_kwp),
    fecha_instalacion: project.fecha_instalacion,
    marca_inversor: project.marca_inversor,
    paneles_instalados: numberToInput(project.paneles_instalados),
    rendimiento_fv_total: numberToInput(project.rendimiento_fv_total),
    rendimiento_grid_total: numberToInput(project.rendimiento_grid_total),
    carga_consumida_total: numberToInput(project.carga_consumida_total),
    reduccion_co2: numberToInput(project.reduccion_co2),
    reduccion_carbon: numberToInput(project.reduccion_carbon),
    arboles: numberToInput(project.arboles),
    estado: project.estado,
    descripcion: project.descripcion,
  };
}

export function mapProjectToSupabaseRow(form: ProjectFormState): Record<string, unknown> {
  return {
    nombre: toText(form.nombre),
    ubicacion: toText(form.ubicacion),
    distrito: toText(form.distrito),
    tipo_de_sistema: toText(form.tipo_de_sistema),
    pot_nominal_kw: toNullableNumber(form.pot_nominal_kw),
    cap_instalada_kwp: toNullableNumber(form.cap_instalada_kwp),
    fecha_instalacion: toIsoDate(form.fecha_instalacion) || null,
    marca_inversor: toText(form.marca_inversor),
    paneles_instalados: toNullableNumber(form.paneles_instalados),
    rendimiento_fv_total: toNullableNumber(form.rendimiento_fv_total),
    rendimiento_grid_total: toNullableNumber(form.rendimiento_grid_total),
    carga_consumida_total: toNullableNumber(form.carga_consumida_total),
    reduccion_co2: toNullableNumber(form.reduccion_co2),
    reduccion_carbon: toNullableNumber(form.reduccion_carbon),
    arboles: toNullableNumber(form.arboles),
    estado: toStatus(form.estado),
    descripcion: toText(form.descripcion),
    updated_at: new Date().toISOString(),
  };
}
