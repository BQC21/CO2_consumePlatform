"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DepartmentCard } from "@/features/view/components/Images/DepartmentCard";
import { PeruMap } from "@/features/view/components/Images/PeruMap";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { useRealtimeMeta } from "@/features/ViewModel/hooks/services/useRealtimeMeta";
import { useRealtimeProjectMonth } from "@/features/ViewModel/hooks/services/useRealtimeProjectMonth";
import { useRealtimeProject } from "@/features/ViewModel/hooks/services/useRealtimeProject";
import { computeDashboardMetrics, referenceMonth } from "@/lib/utils/helpers/computes/dashboard_metrics";
import { formatNumber, monthsForYear } from "@/lib/utils/helpers/render/format";
import { MetricCards } from "@/features/view/components/Bars/MetricCards";
import { MetaPanel } from "@/features/view/components/Bars/MetaPanel";
import type { ProjectMonth } from "@/lib/types/supabase/projectMonth-types";
import { ProductionGauge } from "@/features/view/components/Bars/ProductionGauge";

export default function DashboardPage() {

  // --- enganchar con la info del DB
  const projects = useRealtimeProject();
  const months = useRealtimeProjectMonth();
  const metaState = useRealtimeMeta();

  const [selected, setSelected] = useState<string | null>(null); // proyecto seleccionado
  const [year, setYear] = useState<number | null>(null); // año seleccionado
  const [month, setMonth] = useState<number | null>(null); // mess seleccionada
  const selectedYear = year ?? metaState.meta.anio; // año seleccionado
  const fallbackMonth = Number(referenceMonth(selectedYear).slice(-2)); // Mes de reserva

  const activeDepartment = selected ?? 
      projects.items.find((project) => project.estado === "en_ejecucion")?.ubicacion ?? 
      projects.items[0]?.ubicacion ?? null; // departamento activo

  // -------------------------
  // --- Almacenamiento ------
  // -------------------------

  // Años
  const years = useMemo(() => {
    const values = new Set<number>([metaState.meta.anio]);
    for (const row of metaState.metas) {
      if (row.anio > 0) {
        values.add(row.anio);
      }
    }
    for (const row of months.items) {
      const match = /^(\d{4})-/.exec(row.mes);
      if (match) {
        values.add(Number(match[1]));
      }
    }
    return [...values].sort((left, right) => right - left);
  }, [metaState.meta.anio, metaState.metas, months.items]
  );

  // Opciones para meses
  const monthOptions = useMemo(
    () => monthsForYear(
      selectedYear,
      months.items.map((row: ProjectMonth) => row.mes),
      projects.items.map((project) => project.fecha_instalacion),
    ),
    [selectedYear, months.items, projects.items],
  );
  const selectedMonth = month !== null && monthOptions.includes(month)
  ? month
  : monthOptions.includes(fallbackMonth)
    ? fallbackMonth
    : monthOptions[monthOptions.length - 1];

  // Meta activa
  const activeMeta = useMemo(() => {
      const stored = metaState.metas.find((row) => row.anio === selectedYear);
      if (stored) {
        return stored;
      }
      const sameYear = selectedYear === metaState.meta.anio;
      return {
        id: sameYear ? metaState.meta.id : "",
        anio: selectedYear,
        meta_paneles_anual: sameYear ? metaState.meta.meta_paneles_anual : 0,
        meta_paneles_mensual: sameYear ? metaState.meta.meta_paneles_mensual : 0,
      };
    }, [metaState.meta, metaState.metas, selectedYear]
  );

  // Métricas
  const metrics = useMemo(
    () => computeDashboardMetrics(projects.items, months.items, activeMeta, new Date(), selectedMonth),
    [projects.items, months.items, activeMeta, selectedMonth],
  ); 

  // -------------------------
  // ----- Indicadores -------
  // -------------------------

  const error = projects.error || months.error || metaState.error;
  const loading = projects.loading || months.loading;

  return (
    <PortalShell
      title="Cobertura nacional de todos los proyectos de energía fotovoltaica"
      subtitle="Haz clic en un departamento del mapa para ver el detalle del proyecto en esa región."
      activePath="/dashboard"
      tone="dark"
    >
      {/* En caso haya error al cargar las métricas*/}
      {error ? (
        <div className="panel mb-4 p-4 text-[var(--color-text-primary)]">
          <p className="font-medium">No se pudieron cargar las métricas</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{error}</p>
          <button type="button" className="btn-secondary mt-3" onClick={() => void projects.refetch()}>
            Reintentar
          </button>
        </div>
      ) : null}

      {/* Métricas */}
      <div className="grid items-stretch gap-4 xl:grid-cols-[1.4fr_1fr]">
        {loading ? <div className="skeleton h-28 rounded-[var(--radius-lg)]" /> : <MetricCards metrics={metrics} />}

        {loading ? <div className="skeleton h-28 rounded-[var(--radius-lg)]" /> : (
          <MetaPanel
            meta={activeMeta}
            metrics={metrics}
            years={years}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            monthOptions={monthOptions}
            onYearChange={setYear}
            onMonthChange={setMonth}
            onSave={async (form) => {
              const saved = await metaState.save(form, activeMeta.id || undefined);
              setYear(saved.anio);
            }}
          />
        )}
      </div>

      {/* Mapa del Perú */}
      <section className="mt-4 rounded-[var(--radius-lg)] border p-4" 
                style={{ borderColor: "rgb(255 255 255 / 0.08)", background: "var(--color-surface-dark)" }}>
        
        <div className="grid gap-4 xl:grid-cols-[180px_1fr_320px]">
          <div className="grid content-center gap-4">
            <ProductionGauge label="Producción mensual total" value={metrics.produccionMensualMwh} color="var(--color-info)" />
            
            <ProductionGauge label="Producción anual total" value={metrics.produccionAnualMwh} color="var(--color-success)" />
            
            <div className="grid content-center gap-4">
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
            </div>
          </div>

          <div className="relative">
            <PeruMap projects={projects.items} selected={activeDepartment} onSelect={setSelected} />
          </div>

          <div className="flex flex-col gap-4">
            <DepartmentCard 
              department={activeDepartment} 
              projects={projects.items} 
              months={months.items} 
              year={selectedYear} />
            <Link href="/project" className="btn-primary">
              Ver lista de proyectos
            </Link>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
