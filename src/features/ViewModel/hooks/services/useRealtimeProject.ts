"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";
import {
  createProject,
  createProjects,
  deleteAllProjects,
  deleteProject,
  getProjects,
  updateProject,
} from "@/features/model/services/projectQueries";
import type { Project, ProjectFormData, UseListResult, UseMutationsResult } from "@/lib/types/supabase/project-types";
import { PROJECT_TABLE } from "@/lib/utils/namingTolerance";

const MISSING_ENV = "Configura Supabase para ver los proyectos instalados.";

export function useRealtimeProject(): UseListResult<Project> {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!hasSupabaseEnv()) {
      setItems([]);
      setError(MISSING_ENV);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setItems(await getProjects());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los proyectos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // La lectura inicial no puede hacer setState en el mismo turno del efecto.
    const timer = window.setTimeout(() => {
      void refetch();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refetch]);

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      return;
    }
    const supabase = createClient();
    const channel = supabase
      .channel("proyectos-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: PROJECT_TABLE }, () => {
        void refetch();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refetch]);

  return { items, loading, error, refetch };
}

export function useProjectMutations(): UseMutationsResult<ProjectFormData, Project> & {
  removeAll: () => Promise<void>;
  createMany: (forms: ProjectFormData[]) => Promise<Project[]>;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async <T,>(action: () => Promise<T>, fallback: string) => {
    try {
      setLoading(true);
      setError(null);
      return await action();
    } catch (err) {
      const message = err instanceof Error ? err.message : fallback;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback((form: ProjectFormData) => run(() => createProject(form), "Error al crear el proyecto"), [run]);
  const update = useCallback(
    (id: string, form: ProjectFormData) => run(() => updateProject(id, form), "Error al actualizar el proyecto"),
    [run],
  );
  const remove = useCallback((id: string) => run(() => deleteProject(id), "Error al eliminar el proyecto"), [run]);
  const removeAll = useCallback(() => run(() => deleteAllProjects(), "Error al limpiar los proyectos"), [run]);
  const createMany = useCallback((forms: ProjectFormData[]) => run(() => createProjects(forms), "Error al importar los proyectos"), [run]);

  return { loading, error, create, update, remove, removeAll, createMany };
}
