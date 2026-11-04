"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { DepartmentCard } from "@/features/view/components/Metrics/DepartmentCard";
import { EnvironmentalCards } from "@/features/view/components/Metrics/EnvironmentalCards";
import { ExpoferiaCard } from "@/features/view/components/Metrics/ExpoferiaCard";
import { ImageCard } from "@/features/view/components/Metrics/ImageCard";
import { MetricCards } from "@/features/view/components/Metrics/MetricCards";
import { PeruMap } from "@/features/view/components/Metrics/PeruMap";
import { DepartmentCardSkeleton, ImageCardSkeleton, MetricCardsSkeleton } from "@/features/view/components/skeletons/skeletons";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { useMonthlyRecords } from "@/features/ViewModel/hooks/services/useMonthlyRecords";
import { useRealtimeProject } from "@/features/ViewModel/hooks/services/useRealtimeProject";
import { computeDashboardMetrics } from "@/lib/utils/helpers/computes/dashboard_metrics";
import { formatDayMonthYear } from "@/lib/utils/helpers/normalization";
import { Logo } from "@/features/view/components/Images/Logo";

export default function DashboardPage() {

  // --------------------
  // --- Estados --------
  // --------------------

  const projects = useRealtimeProject();
  const monthlyRecords = useMonthlyRecords();
  const loading = projects.loading;
  const [selected, setSelected] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const handleActiveProject = useCallback((name: string | null) => {
    setActiveProject((current) => (current === name ? current : name));
  }, []);


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
      <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <article className="@container min-w-0 rounded-3xl border border-white/10 bg-[#101826]/90 p-4 sm:p-6 md:p-8">
          <div className="coverage-lockup">
            <div className="coverage-logo-slot">
              <Logo fluid/>
            </div>
            <h1 className="mt-4 font-semibold leading-tight text-[clamp(1.75rem,10cqi,3.75rem)]">
              Cobertura nacional de proyectos TEC
            </h1>
          </div>
          <p className="mx-auto mt-4 flex w-fit max-w-full flex-wrap items-center justify-center gap-2 rounded-full bg-white/10 px-3 py-2 text-center text-sm text-white/85 sm:mt-6 sm:px-4 sm:text-base">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#3caf53]" />
            {loading ? "Cargando datos" : `Datos actualizados al ${updatedAt}`}
          </p>
        </article>
        <div className="min-w-0">
          {loading ? <MetricCardsSkeleton /> : <MetricCards metrics={metrics} departmentCount={departmentCount} />}
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          // Skeleton de las métricas
          <section className="rounded-3xl border border-white/10 bg-[#101826]/80 p-5" aria-hidden="true">
            <div className="skeleton-dark h-7 w-72 rounded-full" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="mt-4 grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(28rem,1fr)]">
        {/* Mapa de Perú */}
        <PeruMap
          projects={projects.items}
          selected={selected}
          onSelect={setSelected}
          onClear={() => setSelected(null)}
          loading={loading}
        />
        {/* Ficha, galería del proyecto y expoferia */}
        <div className="grid min-w-0 content-start gap-4">
          {loading ? <DepartmentCardSkeleton /> : (
            <DepartmentCard department={selected} projects={projects.items} onActiveProject={handleActiveProject} />
          )}
          {loading ? <ImageCardSkeleton /> : <ImageCard projectName={activeProject} />}
          <ExpoferiaCard />
          <Link href="/project" className={`btn-primary w-full ${loading ? "pointer-events-none opacity-60" : ""}`}>
            Ver lista de proyectos →
          </Link>
        </div>
      </div>
    </PortalShell>
  );
}
