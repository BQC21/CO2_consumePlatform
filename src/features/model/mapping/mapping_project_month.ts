import type { ProjectMonth, ProjectMonthFormState, SupabaseProjectMonthRow } from "../../../lib/types/supabase/project-types";
import { numberToInput, toNullableNumber, toNumber, toText, toYearMonth } from "../../../lib/utils/helpers/normalization";

export function mapSupabaseRowToProjectMonth(row: SupabaseProjectMonthRow): ProjectMonth {
  return {
    id: String(row.id ?? ""),
    proyecto_id: toText(row.proyecto_id),
    mes: toYearMonth(row.mes),
    tipico_diario: toNumber(row.tipico_diario),
    pot_nominal_kw: toNullableNumber(row.pot_nominal_kw),
    updated_at: toText(row.updated_at),
  };
}

export function createProjectMonthFormStateFromProjectMonth(month: ProjectMonth): ProjectMonthFormState {
  return {
    proyecto_id: month.proyecto_id,
    mes: month.mes,
    tipico_diario: numberToInput(month.tipico_diario),
    pot_nominal_kw: numberToInput(month.pot_nominal_kw),
  };
}

export function mapProjectMonthToSupabaseRow(form: ProjectMonthFormState): Record<string, unknown> {
  return {
    proyecto_id: toText(form.proyecto_id) || null,
    mes: toYearMonth(form.mes),
    tipico_diario: toNumber(form.tipico_diario),
    pot_nominal_kw: toNullableNumber(form.pot_nominal_kw),
    updated_at: new Date().toISOString(),
  };
}
