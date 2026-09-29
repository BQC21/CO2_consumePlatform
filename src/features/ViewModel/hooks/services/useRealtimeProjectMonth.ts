"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";
import {
  createProjectMonth,
  createProjectMonths,
  deleteAllProjectMonths,
  deleteProjectMonth,
  getProjectMonths,
  updateProjectMonth,
} from "@/features/model/services/projectMonthQueries";
import { PROJECT_MONTH_TABLE } from "@/lib/utils/namingTolerance";
import { UseListResult, UseMutationsResult } from "@/lib/types/hooks/hooks";
import { ProjectMonth, ProjectMonthFormData } from "@/lib/types/supabase/projectMonth-types";

export function useRealtimeProjectMonth(): UseListResult<ProjectMonth> {
  const [items, setItems] = useState<ProjectMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!hasSupabaseEnv()) {
      setItems([]);
      setError(null);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setItems(await getProjectMonths());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los registros mensuales");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
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
      .channel("registros-mensuales-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: PROJECT_MONTH_TABLE }, () => {
        void refetch();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refetch]);

  return { items, loading, error, refetch };
}

export function useProjectMonthMutations(): UseMutationsResult<ProjectMonthFormData, ProjectMonth> & {
  removeAll: () => Promise<void>;
  createMany: (forms: ProjectMonthFormData[]) => Promise<ProjectMonth[]>;
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

  const create = useCallback(
    (form: ProjectMonthFormData) => run(() => createProjectMonth(form), "Error al crear el registro mensual"),
    [run],
  );
  const update = useCallback(
    (id: string, form: ProjectMonthFormData) => run(() => updateProjectMonth(id, form), "Error al actualizar el registro mensual"),
    [run],
  );
  const remove = useCallback((id: string) => run(() => deleteProjectMonth(id), "Error al eliminar el mes"), [run]);
  const removeAll = useCallback(() => run(() => deleteAllProjectMonths(), "Error al limpiar los meses"), [run]);
  const createMany = useCallback(
    (forms: ProjectMonthFormData[]) => run(() => createProjectMonths(forms), "Error al importar los registros mensuales"),
    [run],
  );

  return { loading, error, create, update, remove, removeAll, createMany };
}
