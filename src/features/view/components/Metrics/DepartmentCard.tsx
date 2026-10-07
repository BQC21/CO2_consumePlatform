"use client";

import { useState } from "react";
import Image from "next/image";
import { DepartmentCardProps } from "@/lib/types/components/components";
import { formatDate, formatNumber, Metric } from "@/lib/utils/helpers/render/format";
import { platformProjectImageUrl } from "@/lib/utils/helpers/render/projectImage";

export function DepartmentCard({ department, projects }: DepartmentCardProps) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [trackedDepartment, setTrackedDepartment] = useState(department);
  const local = projects.filter((project) => project.ubicacion === department);

  if (department !== trackedDepartment) {
    setTrackedDepartment(department);
    setProjectId(null);
  }

  // departamento asociado al proyecto
  const activeId = department === trackedDepartment ? projectId : null; 
  
  const project =
    local.find((item) => item.id === activeId) ??
    local.find((item) => item.estado === "en_ejecucion") ??
    local[0];

  const imageUrl = platformProjectImageUrl(project?.imagen_url ?? "");

  return (
    <div className="flex flex-col gap-4">
      {!department || !project ? (
        <article className="rounded-[var(--radius-xl)] bg-white p-5 text-[var(--color-text-primary)]">
          <p className="text-xs font-semibold tracking-wide text-[var(--color-primary)]">DEPARTAMENTO</p>
          <h2 className="mt-2 text-xl font-semibold">{department ?? "Sin selección"}</h2>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            {department ? "Ningún departamento tiene un proyecto en esta selección." : "Elige un departamento del mapa para ver la ficha de la planta."}
          </p>
        </article>
      ) : (
        <article className="rounded-[var(--radius-xl)] bg-white p-5 text-[var(--color-text-primary)]">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--color-text-secondary)]">DEPARTAMENTO · {department.toUpperCase()}</p>
          <h2 className="mt-1 text-xl font-semibold">{project.nombre}</h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {project.descripcion || `${project.tipo_de_sistema || "Sistema FV"} en ${project.estado === "completado" ? "operación cerrada" : "operación"}.`}
          </p>

          {local.length > 1 ? (
            <label className="mt-4 block text-xs text-[var(--color-text-secondary)]">
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

          <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <Metric label="Capacidad" value={project.cap_instalada_kwp === null ? "—" : `${formatNumber(project.cap_instalada_kwp, 2)} kWp`} />
            <Metric label="Fecha inst." value={formatDate(project.fecha_instalacion)} />
            <Metric label="Tipo de sistema" value={project.tipo_de_sistema || "—"} />
          </dl>
        </article>
      )}

      {project ? (
        <section className="overflow-hidden rounded-[var(--radius-xl)] bg-[#d7ebf8] text-[var(--color-text-primary)]">
          {imageUrl ? (
            <div className="relative h-48">
              <Image src={imageUrl} alt={`Instalación de ${project.nombre}`} fill className="object-cover" sizes="320px" />
            </div>
          ) : (
            <p className="grid h-48 place-items-center px-6 text-center text-sm text-[#24507a]">
              Este proyecto no tiene una imagen registrada.
            </p>
          )}
        </section>
      ) : null}
    </div>
  );
}
