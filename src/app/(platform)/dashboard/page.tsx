"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MetaPanel, MetricCards, ProductionGauge } from "@/features/view/components/Bars/DashboardMetrics";
import { DepartmentCard } from "@/features/view/components/Images/DepartmentCard";
import { PeruMap } from "@/features/view/components/Images/PeruMap";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { useRealtimeMeta } from "@/features/ViewModel/hooks/services/useRealtimeMeta";
import { useRealtimeProjectMonth } from "@/features/ViewModel/hooks/services/useRealtimeProjectMonth";
import { useRealtimeProject } from "@/features/ViewModel/hooks/services/useRealtimeProject";
import { computeDashboardMetrics } from "@/lib/utils/helpers/computes/dashboard_metrics";
import { formatNumber } from "@/lib/utils/helpers/render/format";

export default function DashboardPage() {
  const projects = useRealtimeProject();
  const months = useRealtimeProjectMonth();
  const metaState = useRealtimeMeta();
  const [selected, setSelected] = useState<string | null>(null);
  const metrics = useMemo(
    () => computeDashboardMetrics(projects.items, months.items, metaState.meta),
    [projects.items, months.items, metaState.meta],
  );
  const activeDepartment = selected ?? projects.items.find((project) => project.estado === "en_ejecucion")?.ubicacion ?? projects.items[0]?.ubicacion ?? null;
  const error = projects.error || months.error || metaState.error;
  const loading = projects.loading || months.loading;

  return (
    <PortalShell
      title="Cobertura nacional del proyecto de energía solar"
      subtitle="Haz clic en un departamento del mapa para ver el detalle del proyecto en esa región."
      activePath="/dashboard"
      tone="dark"
    >
      {error ? (
        <div className="panel mb-4 p-4 text-[var(--color-text-primary)]">
          <p className="font-medium">No se pudieron cargar las métricas</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{error}</p>
          <button type="button" className="btn-secondary mt-3" onClick={() => void projects.refetch()}>
            Reintentar
          </button>
        </div>
      ) : null}
      <div className="grid items-stretch gap-4 xl:grid-cols-[1.4fr_1fr]">
        {loading ? <div className="skeleton h-28 rounded-[var(--radius-lg)]" /> : <MetricCards metrics={metrics} />}
        {loading ? <div className="skeleton h-28 rounded-[var(--radius-lg)]" /> : (
          <MetaPanel
            meta={metaState.meta}
            metrics={metrics}
            onSave={async (form) => {
              await metaState.save(form);
            }}
          />
        )}
      </div>
      <section className="mt-4 rounded-[var(--radius-lg)] border p-4" style={{ borderColor: "rgb(255 255 255 / 0.08)", background: "var(--color-surface-dark)" }}>
        <div className="grid gap-4 xl:grid-cols-[180px_1fr_320px]">
          <div className="grid content-center gap-4">
            <ProductionGauge label="Producción mensual total" value={metrics.produccionMensualMwh} color="var(--color-info)" />
            <ProductionGauge label="Producción anual total" value={metrics.produccionAnualMwh} color="var(--color-success)" />
          </div>
          <div className="relative">
            <PeruMap projects={projects.items} selected={activeDepartment} onSelect={setSelected} />
            <aside className="pointer-events-none absolute right-3 bottom-3 hidden w-44 rounded-2xl bg-black/35 p-3 text-sm xl:block">
              <p className="font-semibold">Carbón ahorrado</p>
              <p className="numeric mt-2 text-xs" style={{ color: "var(--color-text-on-dark-muted)" }}>
                Annual Yield {formatNumber(metrics.carbonAnualMg, 2)} Mg
              </p>
              <p className="numeric text-xs" style={{ color: "var(--color-text-on-dark-muted)" }}>
                Accumulation {formatNumber(metrics.carbonAcumuladoMg, 2)} Mg
              </p>
              <p className="mt-3 font-semibold">Paneles instalados</p>
              <p className="numeric text-xs" style={{ color: "var(--color-text-on-dark-muted)" }}>
                Annual {formatNumber(metrics.panelesAnio, 0)}
              </p>
              <p className="numeric text-xs" style={{ color: "var(--color-text-on-dark-muted)" }}>
                Accumulation {formatNumber(metrics.panelesAcumulados, 0)}
              </p>
            </aside>
          </div>
          <div className="flex flex-col gap-4">
            <DepartmentCard department={activeDepartment} projects={projects.items} months={months.items} year={metaState.meta.anio} />
            <Link href="/project" className="btn-primary">
              Ver lista de proyectos
            </Link>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
