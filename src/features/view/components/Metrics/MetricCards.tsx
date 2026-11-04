"use client";

import { DashboardMetrics } from "@/lib/types/components/components";
import { formatNumber } from "@/lib/utils/helpers/normalization";

export function MetricCards({
  metrics,
  departmentCount,
}: {
  metrics: DashboardMetrics;
  departmentCount: number;
}) {
  const registered = metrics.proyectosRegistrados;
  const completed = metrics.proyectosCompletados;

  return (
    <div className="@container/metrics grid min-w-0 gap-3">
      <article className="min-w-0 rounded-2xl bg-white px-4 py-4 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] @md/metrics:px-8">
        <p className="mt-3 text-2xl font-medium leading-snug text-balance text-[var(--color-text-secondary)] @md/metrics:text-3xl @2xl/metrics:text-5xl">
          Proyectos registrados: <span className="font-bold text-[var(--color-text-primary)]">{registered}</span>
        </p>
        <p className="mt-4 text-lg text-[var(--color-text-secondary)] @md/metrics:text-2xl @2xl/metrics:text-3xl">
          en {departmentCount} {departmentCount === 1 ? "departamento" : "departamentos"}
        </p>
        <p className="mt-6 text-xl font-medium leading-snug text-balance text-[var(--color-text-secondary)] @md/metrics:mt-8 @md/metrics:text-3xl @2xl/metrics:text-4xl">
          Completados: <span className="font-bold text-[var(--color-text-primary)]">{completed}</span>
        </p>
      </article>
      <div className="grid grid-cols-1 gap-3">
        <article className="min-w-0 rounded-2xl bg-white px-4 py-4 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
          <p className="text-xl font-medium leading-snug text-balance text-[var(--color-text-secondary)] @md/metrics:text-3xl @2xl/metrics:text-4xl">
            Capacidad instalada <span className="font-bold text-[blue]">ACUMULADA</span>
          </p>
          <p className="numeric mt-4 text-2xl font-bold leading-none @md/metrics:text-3xl">
            <span className="text-3xl @2xl/metrics:text-5xl">{formatNumber(metrics.capacidadInstaladaKwp, 1)} kWp</span>
          </p>
        </article>
      </div>
    </div>
  );
}