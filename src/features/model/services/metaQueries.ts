import { mapMetaToSupabaseRow, mapSupabaseRowToMeta } from "@/features/model/mapping/mapping_meta";
import { createClient } from "@/features/model/supabase/client";
import type { Meta, MetaFormData, SupabaseMetaRow } from "@/lib/types/supabase/meta-types";
import { META_TABLE } from "@/lib/utils/namingTolerance";

export async function getMetas(): Promise<Meta[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from(META_TABLE).select("*").order("anio", { ascending: false });
  if (error) {
    throw new Error(`Error al leer la meta: ${error.message}`);
  }
  return (data as SupabaseMetaRow[]).map(mapSupabaseRowToMeta);
}

export async function saveMeta(form: MetaFormData, existingId?: string): Promise<Meta> {
  const supabase = createClient();
  const row = mapMetaToSupabaseRow(form);
  const query = existingId
    ? supabase.from(META_TABLE).update(row).eq("id", existingId)
    : supabase.from(META_TABLE).insert(row);
  const { data, error } = await query.select().single();
  if (error) {
    throw new Error(`Error al guardar la meta: ${error.message}`);
  }
  return mapSupabaseRowToMeta(data as SupabaseMetaRow);
}
