"use client";

import { useState } from "react";
import Image from "next/image";
import { DepartmentCardProps } from "@/lib/types/components/components";
import { formatDate, formatNumber, Metric } from "@/lib/utils/helpers/render/format";

// Formatos de imágenes aceptados
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Máximo de longitud de imágenes admisibles
const MAX_BYTES = 5 * 1024 * 1024;

export function DepartmentCard({ department, projects, onUploadImage }: DepartmentCardProps) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [trackedDepartment, setTrackedDepartment] = useState(department);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const local = projects.filter((project) => project.ubicacion === department);

  if (department !== trackedDepartment) {
    setTrackedDepartment(department);
    setProjectId(null);
    setError("");
  }

  // departamento asociado al proyecto
  const activeId = department === trackedDepartment ? projectId : null; 
  
  const project =
    local.find((item) => item.id === activeId) ??
    local.find((item) => item.estado === "en_ejecucion") ??
    local[0];

  // Manipular subida de imagen asociada al proyecto
  async function handleFile(file: File | undefined) {
    if (!file || !project) {
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Usa una imagen JPG, PNG o WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("La imagen supera 5 MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      await onUploadImage(project.id, file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

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

      <section className="overflow-hidden rounded-[var(--radius-xl)] bg-[#d7ebf8] text-[var(--color-text-primary)]">
        {project?.imagen_url ? (
          <div className="relative h-48">
            <Image src={project.imagen_url} alt={`Instalación de ${project.nombre}`} fill className="object-cover" sizes="320px" />
          </div>
        ) : (
          <p className="grid h-48 place-items-center px-6 text-center text-sm text-[#24507a]">
            Imagen del proyecto, según lo que hay en la base de datos
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
          <label className="btn-secondary inline-flex h-10 cursor-pointer items-center">
            {uploading ? "Subiendo…" : "Subir imagen"}
            <input
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={!project || uploading}
              onChange={(event) => {
                void handleFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          {error ? <p className="field-error">{error}</p> : null}
        </div>
      </section>
    </div>
  );
}
