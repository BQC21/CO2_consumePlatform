"use client";

import { useLayoutEffect, useState } from "react";
import { DepartmentCardProps } from "@/lib/types/components/components";
import { inverterPortalUrl } from "@/lib/utils/options";
import { formatDayMonthYear, formatNumber } from "@/lib/utils/helpers/normalization";

const articleClass =
  "@container min-w-0 rounded-3xl bg-white p-4 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] @sm:p-5";

export function DepartmentCard({ department, projects, onActiveProject }: DepartmentCardProps) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [trackedDepartment, setTrackedDepartment] = useState(department);
  const local = projects.filter((project) => project.ubicacion === department);

  if (department !== trackedDepartment) {
    setTrackedDepartment(department);
    setProjectId(null);
  }

  const activeId = department === trackedDepartment ? projectId : null;
  const project =
    local.find((item) => item.id === activeId) ??
    local.find((item) => item.estado === "en_ejecucion") ??
    local[0];
  const portalUrl = project ? inverterPortalUrl(project.marca_inversor) : null;
  const completed = project?.estado === "completado";

  useLayoutEffect(() => {
    onActiveProject?.(!department || !project ? null : project.nombre);
  }, [department, onActiveProject, project]);

  if (!department || !project) {
    return (
      <article className={articleClass}>
        <p className="text-xs font-semibold tracking-[0.08em] break-words text-[var(--color-text-secondary)] @sm:text-sm @sm:tracking-[0.14em]">DEPARTAMENTO</p>
        <h2 className="mt-2 text-xl font-semibold break-words @sm:text-2xl @md:text-3xl">{department ?? "Sin selección"}</h2>
        <p className="mt-3 text-sm text-[var(--color-text-secondary)] @sm:text-base">
          {department
            ? "Este departamento no tiene proyectos."
            : "Elige un departamento del mapa para ver la ficha de la planta."}
        </p>
      </article>
    );
  }

  const system = project.tipo_de_sistema || "Sistema";
  const phrase = project.descripcion || `${system} ${completed ? "en operación" : "en ejecución"}`;

  return (
    <article className={articleClass}>
      <p className="text-xs font-semibold tracking-[0.08em] break-words text-[var(--color-accent-green)] @sm:text-sm @sm:tracking-[0.14em]">DEPARTAMENTO · {department.toUpperCase()}</p>
      <h2 className="mt-1 text-xl font-semibold break-words @sm:text-2xl @md:text-3xl">{project.nombre}</h2>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)] @sm:text-base">{phrase}</p>
      <p className={`mt-3 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full px-3 py-1 text-xs font-semibold @sm:text-sm ${completed ? "bg-[#e5f6e8] text-[#1f7a32]" : "bg-[#fff1e8] text-[#c44712]"}`}>
        <span className={`h-2 w-2 shrink-0 rounded-full ${completed ? "bg-[#3caf53]" : "bg-[#f05a1a]"}`} />
        {completed ? "Completado" : "En ejecución"} · {local.length} {local.length === 1 ? "planta" : "plantas"}
      </p>

      <label className="mt-4 block min-w-0 text-sm font-medium @sm:text-base">
        Proyecto
        <select
          className="field-select input-focus mt-1 max-w-full"
          aria-label="Proyecto del departamento"
          value={project.id}
          onChange={(event) => setProjectId(event.target.value)}
        >
          {local.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nombre}
            </option>
          ))}
        </select>
      </label>

      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm @md:grid-cols-2 @sm:text-base">
        <div className="min-w-0 rounded-xl bg-[var(--color-background)] px-3 py-2">
          <dt className="text-sm text-[var(--color-text-secondary)]">Capacidad</dt>
          <dd className="numeric text-base font-semibold break-words @sm:text-lg">{project.cap_instalada_kwp === null ? "—" : `${formatNumber(project.cap_instalada_kwp, 2)} kWp`}</dd>
        </div>
        <div className="min-w-0 rounded-xl bg-[var(--color-background)] px-3 py-2">
          <dt className="text-sm text-[var(--color-text-secondary)]">Tipo de sistema</dt>
          <dd className="text-base font-semibold break-words @sm:text-lg">{project.tipo_de_sistema || "—"}</dd>
        </div>
      </dl>
      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm @md:grid-cols-2 @sm:text-base">
        <div className="min-w-0 rounded-xl bg-[var(--color-background)] px-3 py-2">
          <p className="text-sm text-[var(--color-text-secondary)]">Fecha de instalación</p>
          <p className="text-base font-semibold break-words @sm:text-lg">{formatDayMonthYear(project.fecha_instalacion)}</p>
        </div>
        <div className="min-w-0 rounded-xl bg-[var(--color-background)] px-3 py-2">
          <div className="min-w-0">
            <p className="text-sm text-[var(--color-text-secondary)]">Marca del inversor</p>
            <p className="text-base font-semibold break-words @sm:text-lg">{project.marca_inversor || "—"}</p>
          </div>
          {portalUrl ? (
            <a className="shrink-0 text-sm font-semibold text-[var(--color-primary)] @sm:text-base" href={portalUrl} target="_blank" rel="noopener noreferrer">
              Portal del inversor ↗
            </a>
          ) : null}
        </div>
      </dl>
    </article>
  );
}
