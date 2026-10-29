"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DepartmentCard, DepartmentCardSkeleton } from "@/features/view/components/Metrics/DepartmentCard";
import { EnvironmentalCards } from "@/features/view/components/Metrics/EnvironmentalCards";
import { MetricCards } from "@/features/view/components/Metrics/MetricCards";
import { MetricCardsSkeleton } from "@/lib/utils/helpers/render/skeletons";
import { PeruMap } from "@/features/view/components/Images/PeruMap";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { useMonthlyRecords } from "@/features/ViewModel/hooks/services/useMonthlyRecords";
import { useRealtimeProject } from "@/features/ViewModel/hooks/services/useRealtimeProject";
import { computeDashboardMetrics } from "@/lib/utils/helpers/computes/dashboard_metrics";
import { formatDayMonthYear } from "@/lib/utils/helpers/normalization";

export default function DashboardPage() {

  // --------------------
  // --- Estados --------
  // --------------------

  const projects = useRealtimeProject();
  const monthlyRecords = useMonthlyRecords();
  const loading = projects.loading;
  const [selected, setSelected] = useState<string | null>(null);


  // -------------------------
  // --- Cálculos ----------
  // -------------------------

  const metrics = useMemo(() => computeDashboardMetrics(projects.items), [projects.items]); // métricas de la cobertura nacional
  const departmentCount = useMemo(
    () => new Set(projects.items.map((project) => project.ubicacion).filter(Boolean)).size,
    [projects.items],
  ); // cantidad de departamentos
  const updatedAt = useMemo(() => {
    const latest = projects.items.reduce((max, project) => {
      const time = Date.parse(project.updated_at); 
      return Number.isNaN(time) ? max : Math.max(max, time); 
    }, 0); 
    return latest > 0 ? formatDayMonthYear(new Date(latest).toISOString()) : "—"; 
  }, [projects.items]); // fecha de actualización

  return (
    <PortalShell
      title="Cobertura nacional"
      subtitle=""
      activePath="/dashboard"
      tone="dark"
      hideHeading
    >
      <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <article className="rounded-3xl border border-white/10 bg-[#101826]/90 p-6 md:p-8">
          <h1 className="max-w-5xl text-5xl font-semibold leading-tight md:text-7xl lg:text-7xl">
            Cobertura nacional de todos los proyectos de energía fotovoltaica
          </h1>
          <p className="mt-5 max-w-5xl text-lg text-white/70 md:text-3xl">
            Haz clic en un departamento del mapa para ver el detalle de los proyectos instalados en esa región.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-base text-white/85">
            <span className="h-2 w-2 rounded-full bg-[#3caf53]" />
            {loading ? "Cargando datos" : `Datos actualizados al ${updatedAt}`}
          </p>
        </article>
        {loading ? <MetricCardsSkeleton /> : <MetricCards metrics={metrics} departmentCount={departmentCount} />}
      </div>

      <div className="mt-4">
        {loading ? (
          // Skeleton de las métricas
          <section className="rounded-3xl border border-white/10 bg-[#101826]/80 p-5" aria-hidden="true">
            <div className="skeleton-dark h-7 w-72 rounded-full" />
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="skeleton-dark h-16 rounded-2xl" />
              ))}
            </div>
            <div className="skeleton-dark mt-4 h-56 rounded-2xl" />
          </section>
        ) : (
          // Tarjetas de las métricas
          <EnvironmentalCards
            projects={projects.items}
            monthlyRecords={monthlyRecords.items}
            monthlyLoading={monthlyRecords.loading}
            monthlyError={monthlyRecords.error}
          />
        )}
      </div>

      <div className="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,1.8fr)_26rem]">
        {/* Mapa de Perú */}
        <PeruMap
          projects={projects.items}
          selected={selected}
          onSelect={setSelected}
          onClear={() => setSelected(null)}
          loading={loading}
        />
        {/* Tarjetas de los departamentos */}
        <div className="flex flex-col gap-4">
          {/* Skeleton de las tarjetas */}
          {loading ? <DepartmentCardSkeleton /> : <DepartmentCard department={selected} projects={projects.items} />}
          {/* Enlace a la lista de proyectos */}
          <Link href="/project" className={`btn-primary w-full ${loading ? "pointer-events-none opacity-60" : ""}`}>
            Ver lista de proyectos →
          </Link>
        </div>
      </div>
    </PortalShell>
  );
}
