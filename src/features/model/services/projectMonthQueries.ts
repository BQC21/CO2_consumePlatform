import { mapProjectMonthToSupabaseRow, mapSupabaseRowToProjectMonth } from "@/features/model/mapping/mapping_project_month";
import { createClient } from "@/features/model/supabase/client";
import type { ProjectMonth, ProjectMonthFormData, SupabaseProjectMonthRow } from "@/lib/types/supabase/project-types";
import { PROJECT_MONTH_TABLE } from "@/lib/utils/namingTolerance";

export async function getProjectMonths(): Promise<ProjectMonth[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_MONTH_TABLE).select("*").order("mes", { ascending: false });
  if (error) {
    throw new Error(`Error al leer los registros mensuales: ${error.message}`);
  }
  return (data as SupabaseProjectMonthRow[]).map(mapSupabaseRowToProjectMonth);
}

export async function createProjectMonth(form: ProjectMonthFormData): Promise<ProjectMonth> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_MONTH_TABLE).insert(mapProjectMonthToSupabaseRow(form)).select().single();
  if (error) {
    throw new Error(`Error al crear el registro mensual: ${error.message}`);
  }
  return mapSupabaseRowToProjectMonth(data as SupabaseProjectMonthRow);
}

export async function createProjectMonths(forms: ProjectMonthFormData[]): Promise<ProjectMonth[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_MONTH_TABLE).insert(forms.map(mapProjectMonthToSupabaseRow)).select();
  if (error) {
    throw new Error(`Error al importar los registros mensuales: ${error.message}`);
  }
  return (data as SupabaseProjectMonthRow[]).map(mapSupabaseRowToProjectMonth);
}

export async function updateProjectMonth(id: string, form: ProjectMonthFormData): Promise<ProjectMonth> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_MONTH_TABLE).update(mapProjectMonthToSupabaseRow(form)).eq("id", id).select().single();
  if (error) {
    throw new Error(`Error al actualizar el registro mensual: ${error.message}`);
  }
  return mapSupabaseRowToProjectMonth(data as SupabaseProjectMonthRow);
}

export async function deleteProjectMonth(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(PROJECT_MONTH_TABLE).delete().eq("id", id);
  if (error) {
    throw new Error(`Error al eliminar el registro mensual: ${error.message}`);
  }
}

export async function deleteAllProjectMonths(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(PROJECT_MONTH_TABLE).delete().not("id", "is", null);
  if (error) {
    throw new Error(`Error al limpiar los registros mensuales: ${error.message}`);
  }
}
