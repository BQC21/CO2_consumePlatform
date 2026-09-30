import { ProjectMonth, ProjectMonthFormState, SupabaseProjectMonthRow } from "@/lib/types/supabase/projectMonth-types";
import { numberToInput, toNullableNumber, toNumber, toText, toYearMonth } from "../../../lib/utils/helpers/normalization";

export function mapSupabaseRowToProjectMonth(row: SupabaseProjectMonthRow): ProjectMonth {
  return {
    id: String(row.id ?? ""),
    proyecto_id: toText(row.proyecto_id),
    mes: toYearMonth(row.mes),
    rendimiento_fv: toNumber(row.rendimiento_fv),
    rendimiento_grid: toNullableNumber(row.rendimiento_grid),
    reduccion_co2: toNullableNumber(row.reduccion_co2),
    reduccion_carbon: toNullableNumber(row.reduccion_carbon),
    arboles: toNullableNumber(row.arboles),
    updated_at: toText(row.updated_at),
  };
}

export function createProjectMonthFormStateFromProjectMonth(month: ProjectMonth): ProjectMonthFormState {
  return {
    proyecto_id: month.proyecto_id,
    mes: month.mes,
    rendimiento_fv: numberToInput(month.rendimiento_fv),
    rendimiento_grid: numberToInput(month.rendimiento_grid),
    reduccion_co2: numberToInput(month.reduccion_co2),
    reduccion_carbon: numberToInput(month.reduccion_carbon),
    arboles: numberToInput(month.arboles),
  };
}

export function mapProjectMonthToSupabaseRow(form: ProjectMonthFormState): Record<string, unknown> {
  return {
    proyecto_id: toText(form.proyecto_id) || null,
    mes: toYearMonth(form.mes),
    rendimiento_fv: toNumber(form.rendimiento_fv),
    rendimiento_grid: toNullableNumber(form.rendimiento_grid),
    reduccion_co2: toNullableNumber(form.reduccion_co2),
    reduccion_carbon: toNullableNumber(form.reduccion_carbon),
    arboles: toNullableNumber(form.arboles),
    updated_at: new Date().toISOString(),
  };
}
