"use client";

import { useState } from "react";
import { DepartmentCardProps } from "@/lib/types/components/components";
import { formatDate, formatNumber, Metric } from "@/lib/utils/helpers/render/format";

export function DepartmentCard({ department, projects }: DepartmentCardProps) {

  // ------------------------
  // ----- Estados ----------
  // ------------------------

  const [projectId, setProjectId] = useState<string | null>(null);
  const [trackedDepartment, setTrackedDepartment] = useState(department); // departamento seleccionado
  const local = projects.filter((project) => project.ubicacion === department); // proyectos asociados

  if (department !== trackedDepartment) {
    setTrackedDepartment(department);
    setProjectId(null);
  }

  const activeId = department === trackedDepartment ? projectId : null; // en caso se tenga más de 1 proyecto por departamento
  const project =
    local.find((item) => item.id === activeId) ??
    local.find((item) => item.estado === "en_ejecucion") ??
    local[0];

  // En caso no haya departamento o proyecto
  if (!department || !project) {
    return (
      <article className="rounded-[var(--radius-xl)] bg-white p-5 text-[var(--color-text-primary)]">
        <p className="text-xs font-semibold tracking-wide text-[var(--color-primary)]">DEPARTAMENTO</p>
        <h2 className="mt-2 text-xl font-semibold">{department ?? "Sin selección"}</h2>
        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
          {department ? "Ningún departamento tiene un proyecto en esta selección." : "Elige un departamento del mapa para ver la ficha de la planta."}
        </p>
      </article>
    );
  }

  return (
    <article className="rounded-[var(--radius-xl)] bg-white p-5 text-[var(--color-text-primary)]">
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--color-text-secondary)]">DEPARTAMENTO · {department.toUpperCase()}</p>
      <h2 className="mt-1 text-xl font-semibold">{project.nombre}</h2>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        {project.descripcion || `${project.tipo_de_sistema || "Sistema FV"} en ${project.estado === "completado" ? "operación cerrada" : "operación"}.`}
      </p>

      {local.length > 1 ? (
        <label className="mt-10 block text-xs text-[var(--color-text-secondary)]">
          {local.length} plantas en este departamento
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
      ) : null}

      <dl className="mt-10 grid grid-cols-2 gap-2 text-sm">
        <Metric label="Capacidad" value={project.cap_instalada_kwp === null ? "—" : `${formatNumber(project.cap_instalada_kwp, 2)} kWp`} />
        <Metric label="Fecha inst." value={formatDate(project.fecha_instalacion)} />
        <Metric label="Tipo de sistema" value={project.tipo_de_sistema || "—"} />
      </dl>

    </article>
  );
}
