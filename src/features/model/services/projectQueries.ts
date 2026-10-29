import { mapProjectToSupabaseRow, mapSupabaseRowToProject } from "@/features/model/mapping/mapping_project";
import { createClient } from "@/features/model/supabase/client";
import type { Project, ProjectFormData, SupabaseProjectRow } from "@/lib/types/supabase/project-types";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_IMAGE_LABEL } from "@/lib/utils/consts/image_props";
import { PROJECT_IMAGE_BUCKET, PROJECT_TABLE } from "@/lib/utils/namingTolerance";

/** Obtiene todos los proyectos ordenados por fecha de instalación de forma descendente. */
export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_TABLE).select("*").order("fecha_instalacion", { ascending: false });
  if (error) {
    throw new Error(`Error al leer los proyectos: ${error.message}`);
  }
  return (data as SupabaseProjectRow[]).map(mapSupabaseRowToProject);
}

/** Crea un nuevo proyecto en la base de datos. */
export async function createProject(form: ProjectFormData): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_TABLE).insert(mapProjectToSupabaseRow(form)).select().single();
  if (error) {
    throw new Error(`Error al crear el proyecto: ${error.message}`);
  }
  return mapSupabaseRowToProject(data as SupabaseProjectRow);
}

/** Crea varios proyectos en la base de datos. */
export async function createProjects(forms: ProjectFormData[]): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_TABLE).insert(forms.map(mapProjectToSupabaseRow)).select();
  if (error) {
    throw new Error(`Error al importar los proyectos: ${error.message}`);
  }
  return (data as SupabaseProjectRow[]).map(mapSupabaseRowToProject);
}

/** Actualiza un proyecto existente en la base de datos. */
export async function updateProject(id: string, form: ProjectFormData): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_TABLE).update(mapProjectToSupabaseRow(form)).eq("id", id).select().single();
  if (error) {
    throw new Error(`Error al actualizar el proyecto: ${error.message}`);
  }
  return mapSupabaseRowToProject(data as SupabaseProjectRow);
}

/** Elimina un proyecto existente de la base de datos. */
export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(PROJECT_TABLE).delete().eq("id", id);
  if (error) {
    throw new Error(`Error al eliminar el proyecto: ${error.message}`);
  }
}

/** Elimina todos los proyectos de la base de datos. */
export async function deleteAllProjects(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(PROJECT_TABLE).delete().not("id", "is", null);
  if (error) {
    throw new Error(`Error al limpiar los proyectos: ${error.message}`);
  }
}
