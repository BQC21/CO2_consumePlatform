"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";
import { getMetas, saveMeta } from "@/features/model/services/metaQueries";
import type { Meta, MetaFormData } from "@/lib/types/supabase/project-types";
import { META_TABLE } from "@/lib/utils/namingTolerance";

const fallbackMeta = (): Meta => ({
  id: "",
  anio: new Date().getFullYear(),
  meta_paneles_anual: 1000,
  meta_paneles_mensual: 100,
});

export function useRealtimeMeta() {
  const [meta, setMeta] = useState<Meta>(fallbackMeta);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!hasSupabaseEnv()) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const rows = await getMetas();
      const currentYear = new Date().getFullYear();
      setMeta(rows.find((row) => row.anio === currentYear) ?? rows[0] ?? fallbackMeta());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la meta");
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
      .channel("metas-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: META_TABLE }, () => {
        void refetch();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refetch]);

  const save = useCallback(
    async (form: MetaFormData) => {
      const saved = await saveMeta(form, meta.id || undefined);
      setMeta(saved);
      return saved;
    },
    [meta.id],
  );

  return { meta, loading, error, refetch, save };
}
