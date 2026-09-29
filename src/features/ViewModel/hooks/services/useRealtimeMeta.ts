"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";
import { getMetas, saveMeta } from "@/features/model/services/metaQueries";
import type { Meta, MetaFormData } from "@/lib/types/supabase/meta-types";
import { META_TABLE } from "@/lib/utils/namingTolerance";
import { fallbackMeta } from "@/lib/utils/consts/fallbacks";

export function useRealtimeMeta() {
  const [metas, setMetas] = useState<Meta[]>([]);
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
      setMetas(rows);
      setMeta((current) => {
        const sameRow = current.id ? rows.find((row) => row.id === current.id) : undefined;
        if (sameRow) {
          return sameRow;
        }
        const currentYear = new Date().getFullYear();
        return rows.find((row) => row.anio === currentYear) ?? rows[0] ?? fallbackMeta();
      });
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

  const save = useCallback(async (form: MetaFormData, existingId?: string) => {
    const saved = await saveMeta(form, existingId);
    setMeta(saved);
    setMetas((current) => {
      const index = current.findIndex((row) => row.id === saved.id);
      if (index === -1) {
        return [...current, saved].sort((left, right) => right.anio - left.anio);
      }
      return current.map((row) => (row.id === saved.id ? saved : row));
    });
    return saved;
  }, []);

  return { meta, metas, loading, error, refetch, save };
}
