import { mapProjectToSupabaseRow, mapSupabaseRowToProject } from "@/features/model/mapping/mapping_project";
import { createClient } from "@/features/model/supabase/client";
import type { Project, ProjectFormData, SupabaseProjectRow } from "@/lib/types/supabase/project-types";
import { PROJECT_TABLE } from "@/lib/utils/namingTolerance";

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_TABLE).select("*").order("fecha_instalacion", { ascending: false });
  if (error) {
    throw new Error(`Error al leer los proyectos: ${error.message}`);
  }
  return (data as SupabaseProjectRow[]).map(mapSupabaseRowToProject);
}

export async function getProjectById(id: string): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_TABLE).select("*").eq("id", id).single();
  if (error) {
    throw new Error(`Error al leer el proyecto: ${error.message}`);
  }
  return mapSupabaseRowToProject(data as SupabaseProjectRow);
}

export async function createProject(form: ProjectFormData): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_TABLE).insert(mapProjectToSupabaseRow(form)).select().single();
  if (error) {
    throw new Error(`Error al crear el proyecto: ${error.message}`);
  }
  return mapSupabaseRowToProject(data as SupabaseProjectRow);
}

export async function createProjects(forms: ProjectFormData[]): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_TABLE).insert(forms.map(mapProjectToSupabaseRow)).select();
  if (error) {
    throw new Error(`Error al importar los proyectos: ${error.message}`);
  }
  return (data as SupabaseProjectRow[]).map(mapSupabaseRowToProject);
}

export async function updateProject(id: string, form: ProjectFormData): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase.from(PROJECT_TABLE).update(mapProjectToSupabaseRow(form)).eq("id", id).select().single();
  if (error) {
    throw new Error(`Error al actualizar el proyecto: ${error.message}`);
  }
  return mapSupabaseRowToProject(data as SupabaseProjectRow);
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(PROJECT_TABLE).delete().eq("id", id);
  if (error) {
    throw new Error(`Error al eliminar el proyecto: ${error.message}`);
  }
}

export async function deleteAllProjects(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(PROJECT_TABLE).delete().not("id", "is", null);
  if (error) {
    throw new Error(`Error al limpiar los proyectos: ${error.message}`);
  }
}
