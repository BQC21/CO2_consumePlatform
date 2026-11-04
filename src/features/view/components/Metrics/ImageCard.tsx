"use client";

import { ImageCardProps } from "@/lib/types/components/components";
import { mediaFileName, mediaForProject, mediaKind } from "@/lib/utils/consts/mediaCatalog";

export function ImageCard({ projectName }: ImageCardProps) {
  const entry = mediaForProject(projectName);
  const files = entry?.files ?? [];
  const current = files[0] ?? null;
  const kind = current ? mediaKind(current) : "unsupported";
  const label = current ? mediaFileName(current) : "";

  return (
    <article className="rounded-3xl bg-white p-5 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
      <p className="text-sm font-semibold tracking-[0.14em] text-[var(--color-accent-green)]">GALERÍA</p>
      <h2 className="mt-1 text-2xl font-semibold">{projectName ?? "Sin proyecto"}</h2>
      {!projectName ? (
        <p className="mt-3 text-base text-[var(--color-text-secondary)]">
          Elige un departamento del mapa para ver el material del proyecto.
        </p>
      ) : files.length === 0 ? (
        <p className="mt-3 text-base text-[var(--color-text-secondary)]" role="status">
          Este proyecto no tiene material multimedia.
        </p>
      ) : kind === "unsupported" ? (
        <p className="mt-3 text-base text-[var(--color-text-secondary)]" role="status">
          El archivo {label} no se puede mostrar en el navegador.
        </p>
      ) : (
        <p className="mt-3 text-base text-[var(--color-text-secondary)]" role="status">
          {files.length === 1 ? "Hay 1 archivo para este proyecto." : `Hay ${files.length} archivos para este proyecto.`}
        </p>
      )}
    </article>
  );
}
