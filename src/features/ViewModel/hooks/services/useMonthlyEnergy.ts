"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";
import { getMonthlyEnergy } from "@/features/model/services/monthlyEnergyQueries";
import type { MonthlyEnergy } from "@/lib/types/supabase/monthly-energy";
import { MONTH_TABLE } from "@/lib/utils/namingTolerance";

export function useMonthlyEnergy(): {
  items: MonthlyEnergy[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [items, setItems] = useState<MonthlyEnergy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!hasSupabaseEnv()) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setItems(await getMonthlyEnergy());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la energía mensual");
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
      .channel("energia-mensual")
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
