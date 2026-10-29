"use client";

import { useState } from "react";
import { DepartmentCardProps } from "@/lib/types/components/components";
import { inverterPortalUrl } from "@/lib/utils/options";
import { formatDayMonthYear, formatNumber } from "@/lib/utils/helpers/normalization";

export function DepartmentCard({ department, projects }: DepartmentCardProps) {
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

  if (!department || !project) {
    return (
      <article className="rounded-3xl bg-white p-5 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
        <p className="text-sm font-semibold tracking-[0.14em] text-[var(--color-text-secondary)]">DEPARTAMENTO</p>
        <h2 className="mt-2 text-3xl font-semibold">{department ?? "Sin selección"}</h2>
        <p className="mt-3 text-base text-[var(--color-text-secondary)]">
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
    <article className="rounded-3xl bg-white p-5 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
      <p className="text-sm font-semibold tracking-[0.14em] text-[var(--color-accent-green)]">DEPARTAMENTO · {department.toUpperCase()}</p>
      <h2 className="mt-1 text-3xl font-semibold">{project.nombre}</h2>
      <p className="mt-1 text-base text-[var(--color-text-secondary)]">{phrase}</p>
      <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${completed ? "bg-[#e5f6e8] text-[#1f7a32]" : "bg-[#fff1e8] text-[#c44712]"}`}>
        <span className={`h-2 w-2 rounded-full ${completed ? "bg-[#3caf53]" : "bg-[#f05a1a]"}`} />
        {completed ? "Completado" : "En ejecución"} · {local.length} {local.length === 1 ? "planta" : "plantas"} en {department}
      </p>

      <label className="mt-4 block text-base font-medium">
        Proyecto ({local.length} {local.length === 1 ? "planta" : "plantas"} en este departamento)
        <select
          className="field-select input-focus mt-1"
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

      <dl className="mt-4 grid grid-cols-2 gap-2 text-base">
        <div className="rounded-xl bg-[var(--color-background)] px-3 py-2">
          <dt className="text-sm text-[var(--color-text-secondary)]">Capacidad</dt>
          <dd className="numeric text-lg font-semibold">{project.cap_instalada_kwp === null ? "—" : `${formatNumber(project.cap_instalada_kwp, 2)} kWp`}</dd>
        </div>
        <div className="rounded-xl bg-[var(--color-background)] px-3 py-2">
          <dt className="text-sm text-[var(--color-text-secondary)]">Tipo de sistema</dt>
          <dd className="text-lg font-semibold">{project.tipo_de_sistema || "—"}</dd>
        </div>
      </dl>
      <div className="mt-2 rounded-xl bg-[var(--color-background)] px-3 py-2 text-base">
        <p className="text-sm text-[var(--color-text-secondary)]">Fecha de instalación</p>
        <p className="text-lg font-semibold">{formatDayMonthYear(project.fecha_instalacion)}</p>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-[var(--color-background)] px-3 py-2 text-base">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">Marca del inversor</p>
          <p className="text-lg font-semibold">{project.marca_inversor || "—"}</p>
        </div>
        {portalUrl ? (
          <a className="shrink-0 text-base font-semibold text-[var(--color-primary)]" href={portalUrl} target="_blank" rel="noopener noreferrer">
            Portal del inversor ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}
