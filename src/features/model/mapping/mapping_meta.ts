import type { Meta, MetaFormState, SupabaseMetaRow } from "../../../lib/types/supabase/project-types";
import { numberToInput, toInteger } from "../../../lib/utils/helpers/normalization";

export function mapSupabaseRowToMeta(row: SupabaseMetaRow): Meta {
  return {
    id: String(row.id ?? ""),
    anio: toInteger(row.anio),
    meta_paneles_anual: toInteger(row.meta_paneles_anual, 1000),
    meta_paneles_mensual: toInteger(row.meta_paneles_mensual, 100),
  };
}

export function createMetaFormStateFromMeta(meta: Meta): MetaFormState {
  return {
    anio: numberToInput(meta.anio),
    meta_paneles_anual: numberToInput(meta.meta_paneles_anual),
    meta_paneles_mensual: numberToInput(meta.meta_paneles_mensual),
  };
}

export function mapMetaToSupabaseRow(form: MetaFormState): Record<string, unknown> {
  return {
    anio: toInteger(form.anio),
    meta_paneles_anual: toInteger(form.meta_paneles_anual, 1000),
    meta_paneles_mensual: toInteger(form.meta_paneles_mensual, 100),
    updated_at: new Date().toISOString(),
  };
}
