"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DepartmentCard } from "@/features/view/components/Metrics/DepartmentCard";
import { EnvironmentalCards } from "@/features/view/components/Metrics/EnvironmentalCards";
import { PeruMap } from "@/features/view/components/Images/PeruMap";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { useMonthlyEnergy } from "@/features/ViewModel/hooks/services/useMonthlyEnergy";
import { useRealtimeProject } from "@/features/ViewModel/hooks/services/useRealtimeProject";
import { computeDashboardMetrics } from "@/lib/utils/helpers/computes/dashboard_metrics";
import { MetricCards } from "@/features/view/components/Metrics/MetricCards";

export default function DashboardPage() {

  const projects = useRealtimeProject();
  const months = useMonthlyEnergy();
  const loading = projects.loading || months.loading;

  // ------------------
  // -- Seleccionado --
  // ------------------

  // departamento seleccionado
  const [selected, setSelected] = useState<string | null>(null);
  const activeDepartment =
    selected ??
    projects.items.find((project) => project.estado === "en_ejecucion")?.ubicacion ??
    projects.items[0]?.ubicacion ??
    null;


  // -------------------------------
  // --- Almacenamiento ------------
  // -------------------------------

  const metrics = useMemo(
    () => computeDashboardMetrics(projects.items, months.items),
    [projects.items, months.items],
  );

  return (
    <PortalShell
      title="Cobertura nacional de todos los proyectos de energía fotovoltaica"
      subtitle="Haz clic en un departamento del mapa para ver el detalle del proyecto en esa región."
      activePath="/dashboard"
      tone="dark"
      backgroundImage="/pexels-giantasparagus-35691079.jpg"
      headerExtra={loading ? <div className="skeleton h-24 rounded-[var(--radius-lg)]" /> : <MetricCards metrics={metrics} />}
    >

      <section className="rounded-[var(--radius-lg)] border p-6">
        
        <div className="grid gap-4 xl:grid-cols-[280px_1fr_320px]">
          {/* Columna 1 */}
          <div className="mt-30 grid content-start gap-4">
            <EnvironmentalCards metrics={metrics} />
          </div>
          {/* Columna 2 */}
          <PeruMap 
            projects={projects.items} 
            selected={activeDepartment} 
            onSelect={setSelected} 
          />
          {/* Columna 3 */}
          <div className="flex flex-col gap-4">
            <DepartmentCard department={activeDepartment} projects={projects.items} />
            <Link href="/project" className="btn-primary">
              Ver lista de proyectos
            </Link>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
