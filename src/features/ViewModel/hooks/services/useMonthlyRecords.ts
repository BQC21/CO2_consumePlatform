"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";
import { getAllMonthlyRecords } from "@/features/model/services/monthlyRecordQueries";
import type { MonthlyRecordDraft } from "@/lib/types/components/components";
import type { UseListResult } from "@/lib/types/hooks/hooks";
import { MONTH_TABLE } from "@/lib/utils/namingTolerance";

const MISSING_ENV = "Configura Supabase para ver los registros mensuales.";

export function useMonthlyRecords(): UseListResult<MonthlyRecordDraft> {
  const [items, setItems] = useState<MonthlyRecordDraft[]>([]);
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
      setItems(await getAllMonthlyRecords());
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
      .on("postgres_changes", { event: "*", schema: "public", table: MONTH_TABLE }, () => {
        void refetch();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refetch]);

  return { items, loading, error, refetch };
}
