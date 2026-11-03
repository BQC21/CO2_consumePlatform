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
  const ratio = registered === 0 ? 0 : Math.round((completed / registered) * 100);

  return (
    <div className="grid gap-3">
      <article className="rounded-2xl bg-white px-5 py-4 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
        <p className="inline-flex rounded-full bg-[#e7eefb] px-3 py-1 text-sm font-bold tracking-wide text-[var(--color-secondary)]">
          ACUMULADO
        </p>
        {/* Proyectos registrados y registered en negrita y de color negro en 1 misma línea */}
        <p className="mt-3 text-2xl font-medium leading-snug text-[var(--color-text-secondary)] sm:text-3xl">Proyectos registrados: <span className="font-bold text-[var(--color-text-primary)]">{registered}</span></p>
        <p className="mt-4 text-lg text-[var(--color-text-secondary)] sm:text-xl">
          en {departmentCount} {departmentCount === 1 ? "departamento" : "departamentos"}
        </p>
        <p className="mt-5 text-xl font-medium leading-snug text-[var(--color-text-secondary)] sm:text-2xl">Completados: <span className="font-bold text-[var(--color-text-primary)]">{completed}</span></p>
      </article>
      <div className="grid grid-cols-1 gap-3">
        <article className="min-w-0 rounded-2xl bg-white px-4 py-4 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
          <p className="text-xl font-medium leading-snug text-[var(--color-text-secondary)] sm:text-2xl">Capacidad instalada total</p>
          <p className="numeric mt-4 text-2xl font-bold leading-none sm:text-3xl">
            <span className="text-3xl sm:text-4xl">{formatNumber(metrics.capacidadInstaladaKwp, 1)}</span> kWp
          </p>
        </article>
      </div>
    </div>
  );
}