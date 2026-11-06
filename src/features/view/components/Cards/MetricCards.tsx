"use client";

import type { ReactNode } from "react";
import { DashboardMetrics } from "@/lib/types/components/components";
import { formatNumber } from "@/lib/utils/helpers/normalization";
import { MetricTile } from "../Form_fields/fields";


export function MetricCards({
  metrics,
  departmentCount,
}: {
  metrics: DashboardMetrics;
  departmentCount: number;
}) {
  const registered = metrics.proyectosRegistrados;
  const completed = metrics.proyectosCompletados;
  const ratio = registered === 0 ? 0 : Math.min(100, Math.round((completed / registered) * 100));

  return (
    <div className="grid min-w-0 grid-cols-1 items-stretch gap-3 sm:grid-cols-3">
      <MetricTile
        label="PROYECTOS REGISTRADOS"
        value={String(registered)}
        detail={registered === 0 ? "Aún no hay proyectos registrados" : `${ratio}% de proyectos completados`}
        tone="blue"
      >
        <div className="h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-secondary)_18%,white)]" aria-hidden="true">
          <div className="h-full rounded-full bg-[var(--color-secondary)]" style={{ width: `${ratio}%` }} />
        </div>
      </MetricTile>
      <MetricTile
        label="TOTAL DE PANELES"
        value={formatNumber(metrics.paneles, 0)}
        detail="paneles instalados"
        tone="green"
      />
      <MetricTile
        label="CAPACIDAD INSTALADA"
        value={formatNumber(metrics.capacidadInstaladaKwp, 1)}
        detail="kWp acumulados"
        tone="orange"
      />
    </div>
  );
}
