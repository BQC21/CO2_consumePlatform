"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DepartmentCard } from "@/features/view/components/Metrics/DepartmentCard";
import { PeruMap } from "@/features/view/components/Images/PeruMap";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { useRealtimeMeta } from "@/features/ViewModel/hooks/services/useRealtimeMeta";
import { useRealtimeProjectMonth } from "@/features/ViewModel/hooks/services/useRealtimeProjectMonth";
import { useRealtimeProject } from "@/features/ViewModel/hooks/services/useRealtimeProject";
import { computeDashboardMetrics, referenceMonth } from "@/lib/utils/helpers/computes/dashboard_metrics";
import { formatNumber, monthsForYear } from "@/lib/utils/helpers/render/format";
import { MetricCards } from "@/features/view/components/Metrics/MetricCards";
import type { ProjectMonth } from "@/lib/types/supabase/projectMonth-types";
import { ProductionGauge } from "@/features/view/components/Metrics/ProductionGauge";

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

  // Departamento seleccionado en el mapa
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
  const selectedMonth = 
    month !== null && monthOptions.includes(month)
      ? month
      : monthOptions.includes(fallbackMonth)
        ? fallbackMonth
        : monthOptions[monthOptions.length - 1] ?? fallbackMonth;

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
        mes: String(selectedMonth),
        meta_paneles_anual: sameYear ? metaState.meta.meta_paneles_anual : 0,
        meta_paneles_mensual: sameYear ? metaState.meta.meta_paneles_mensual : 0,
      };
    }, [metaState.meta, metaState.metas, selectedYear, selectedMonth]
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

      {/* Métricas */}
      <div className="grid items-stretch gap-4 xl:grid-cols-[1.4fr_1fr]">
        {loading ? <div className="skeleton h-28 rounded-[var(--radius-lg)]" /> : <MetricCards metrics={metrics} />}
      </div>

      {/* Mapa del Perú */}
      <section className="mt-4 rounded-[var(--radius-lg)] border p-4" 
                style={{ borderColor: "rgb(255 255 255 / 0.08)", background: "var(--color-surface-dark)" }}>
        
        {/* COLUMNA 1 */}
        <div className="grid gap-4 xl:grid-cols-[300px_1fr_320px]">
          <div className="grid content-center gap-4">
            <ProductionGauge label="Producción mensual total MWh" value={metrics.produccionMensualMwh} color="var(--color-info)" />
            
            <ProductionGauge label="Producción anual total MWh" value={metrics.produccionAnualMwh} color="var(--color-success)" />
            
          </div>

          {/* COLUMNA 2 */}
          <div className="relative">
            <PeruMap projects={projects.items} selected={activeDepartment} onSelect={setSelected} />
          </div>

          {/* COLUMNA 3 */}
          <div className="flex flex-col gap-4">
            <DepartmentCard 
              department={activeDepartment} 
              projects={projects.items} />
            <Link href="/project" className="btn-primary">
              Ver lista de proyectos
            </Link>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
