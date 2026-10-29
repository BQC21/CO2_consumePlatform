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
        <p className="mt-3 text-5xl font-medium text-[var(--color-text-secondary)]">Proyectos registrados: <span className="font-bold text-[var(--color-text-primary)]">{registered}</span></p>
        <p className="mt-10 text-3xl text-[var(--color-text-secondary)]">
          en {departmentCount} {departmentCount === 1 ? "departamento" : "departamentos"}
        </p>
      </article>
      <div className="grid grid-cols-2 gap-3">
        <article className="rounded-2xl bg-white px-4 py-4 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
          <p className="text-5xl font-medium text-[var(--color-text-secondary)]">Completados: <span className="font-bold text-[var(--color-text-primary)]">{completed}</span></p>
          <p className="numeric mt-10 text-4xl leading-none">
            {completed} de {registered}
          </p>
          
          <p className="mt-10 text-3xl text-[var(--color-text-secondary)]">{ratio} % operativos</p>
        </article>
        <article className="rounded-2xl bg-white px-4 py-4 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
          <p className="text-5xl font-medium text-[var(--color-text-secondary)]">Capacidad instalada total</p>
          <p className="numeric mt-10 text-4xl font-bold leading-none">
            <span className="text-5xl">{formatNumber(metrics.capacidadInstaladaKwp, 1)}</span> kWp
          </p>
        </article>
      </div>
    </div>
  );
}