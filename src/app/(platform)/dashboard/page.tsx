"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { DepartmentCard } from "@/features/view/components/Cards/DepartmentCard";
import { EnvironmentalCards } from "@/features/view/components/Cards/EnvironmentalCards";
import { ExpoferiaCard } from "@/features/view/components/Cards/EventsCard";
import { ImageCard } from "@/features/view/components/Cards/ImageCard";
import { MetricCards } from "@/features/view/components/Cards/MetricCards";
import { PeruMap } from "@/features/view/components/Cards/PeruMap";
import { DepartmentCardSkeleton, ExpoferiaCardSkeleton, ImageCardSkeleton, MetricCardsSkeleton } from "@/features/view/components/skeletons/skeletons";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { useMonthlyRecords } from "@/features/ViewModel/hooks/services/useMonthlyRecords";
import { useRealtimeProject } from "@/features/ViewModel/hooks/services/useRealtimeProject";
import { computeDashboardMetrics } from "@/lib/utils/helpers/computes/dashboard_metrics";
import { formatDayMonthYear, publicMediaSrc } from "@/lib/utils/helpers/normalization";
import { HERO_SLIDES } from "@/lib/utils/consts/mediaCatalog";
import { HERO_SLIDE_SECONDS } from "@/lib/utils/consts/sizes";

export default function DashboardPage() {

  // --------------------
  // --- Estados --------
  // --------------------

  const projects = useRealtimeProject();
  const monthlyRecords = useMonthlyRecords();

  const loading = projects.loading;
  const [selected, setSelected] = useState<string | null>(null); // departamento seleccionado
  const [activeProject, setActiveProject] = useState<string | null>(null); // proyectos activos
  const [slide, setSlide] = useState(0);
  const slideCount: number = HERO_SLIDES.length;

  const showSlide = useCallback((next: number) => {
    if (slideCount === 0) {
      return;
    }
    setSlide(((next % slideCount) + slideCount) % slideCount);
  }, [slideCount]);

  const advanceSlide = useCallback((index: number) => {
    if (index !== slide || slideCount < 2) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    showSlide(index + 1);
  }, [showSlide, slide, slideCount]);

  const handleActiveProject = useCallback((name: string | null) => {
    setActiveProject((current) => (current === name ? current : name));
  }, []);


  // -------------------------
  // --- Cálculos ----------
  // -------------------------

  // métricas de la cobertura nacional
  const metrics = useMemo(() => computeDashboardMetrics(projects.items), [projects.items]); 

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
      {/* Métricas generales */}
      <div className="grid min-w-0 items-stretch gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
        {/* Columna 1 */}
        <article className="@container relative isolate min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[var(--color-surface-brand)] p-4 sm:p-6 md:p-8">
          <div className="relative z-10">
            <div className="coverage-lockup">
              <h1 className="mt-4 font-semibold leading-tight text-[clamp(1.75rem,10cqi,3.75rem)]">
                Cobertura nacional de proyectos TEC
              </h1>
            </div>
            {/* Fecha de la última actualización de datos */}
            <p className="mx-auto mt-4 flex w-fit max-w-full flex-wrap items-center justify-center gap-2 rounded-full bg-[var(--color-background-dark)]/70 px-3 py-2 text-center text-sm text-white/85 sm:mt-6 sm:px-4 sm:text-base">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent-green)]" />
              {loading ? "Cargando datos" : `Datos actualizados al ${updatedAt}`}
            </p>
          </div>
        </article>
        {/* Columna 2 */}
        <div className="min-w-0">
          {loading ? <MetricCardsSkeleton /> : <MetricCards metrics={metrics} departmentCount={departmentCount} />}
        </div>
      </div>

      {/* Hero section */}
      <section
        className="hero-sequence mt-4"
        aria-label="Secuencia de fotos de los proyectos TEC"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            showSlide(slide - 1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            showSlide(slide + 1);
          }
        }}
      >
        {HERO_SLIDES.map((src, index) => (
          <img
            key={`frame-${index}-${src}`}
            src={publicMediaSrc(src)}
            alt=""
            className={index === slide ? "hero-sequence-frame is-active" : "hero-sequence-frame"}
            style={{ animationDuration: `${HERO_SLIDE_SECONDS}s` }}
            aria-hidden={index !== slide}
            onAnimationEnd={() => advanceSlide(index)}
          />
        ))}
        {slideCount > 1 ? (
          <>
            <button type="button" className="hero-sequence-nav hero-sequence-nav-prev" aria-label="Imagen anterior" onClick={() => showSlide(slide - 1)}>
              <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                <path d="M17 6 L9 14 L17 22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="hero-sequence-nav hero-sequence-nav-next" aria-label="Imagen siguiente" onClick={() => showSlide(slide + 1)}>
              <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                <path d="M11 6 L19 14 L11 22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="hero-sequence-dots">
              {HERO_SLIDES.map((src, index) => (
                <button
                  key={`dot-${index}-${src}`}
                  type="button"
                  className={index === slide ? "hero-sequence-dot is-active" : "hero-sequence-dot"}
                  aria-label={`Imagen ${index + 1}`}
                  aria-current={index === slide ? "true" : undefined}
                  onClick={() => showSlide(index)}
                />
              ))}
            </div>
          </>
        ) : null}
      </section>

      <div className="mt-4">
        {loading ? (
          // Skeleton de las métricas
          <section className="rounded-3xl border border-white/10 bg-[var(--color-background-dark)]/80 p-5" aria-hidden="true">
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
        {/* Columna 1 */}
        <PeruMap
          projects={projects.items}
          selected={selected}
          onSelect={setSelected}
          onClear={() => setSelected(null)}
          loading={loading}
        />
        {/* Columna 2 */}
        <div className="grid min-w-0 content-start gap-4">
          {/* Información por departamento */}
          {loading ? <DepartmentCardSkeleton /> : (
            <DepartmentCard department={selected} projects={projects.items} onActiveProject={handleActiveProject} />)}
          {/* Galería de imagen por proyecto seleccionado */}
          {loading ? <ImageCardSkeleton /> : <ImageCard projectName={activeProject} />}
          {/* Galería para ferias y eventos */}
          {loading ? <ExpoferiaCardSkeleton /> : <ExpoferiaCard />}

          <Link href="/project" className={`btn-primary w-full ${loading ? "pointer-events-none opacity-60" : ""}`}>
            Ver lista de proyectos →
          </Link>
        </div>
      </div>
    </PortalShell>
  );
}
