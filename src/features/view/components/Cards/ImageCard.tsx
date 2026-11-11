"use client";

import { useEffect, useState } from "react";
import { PhotoSequence } from "@/features/view/Animations/PhotoSequence";
import { ImageCardProps } from "@/lib/types/components/components";
import { mediaForProject } from "@/lib/utils/helpers/normalization";

export function ImageCard({ projectName }: ImageCardProps) {
  const [files, setFiles] = useState<readonly string[] | null>(null);

  useEffect(() => {
    if (!projectName) {
      setFiles(null);
      return;
    }
    let active = true;
    setFiles(null);
    void mediaForProject(projectName)
      .then((entry) => {
        if (active) {
          setFiles(entry?.files ?? []);
        }
      })
      .catch(() => {
        if (active) {
          setFiles([]);
        }
      });
    return () => {
      active = false;
    };
  }, [projectName]);

  return (
    <article className="rounded-3xl bg-white p-5 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
      <p className="text-sm font-semibold tracking-[0.14em] text-[var(--color-text-secondary)]">GALERÍA</p>
      <h2 className="mt-1 text-2xl font-semibold">{projectName ?? "Sin proyecto"}</h2>

      {!projectName ? (
        <p className="mt-3 text-base text-[var(--color-text-secondary)]">
          Elige un departamento del mapa para ver el material del proyecto.
        </p>
      ) : files === null ? (
        <p className="mt-3 text-base text-[var(--color-text-secondary)]" role="status">
          Leyendo fotos…
        </p>
      ) : files.length === 0 ? (
        <p className="mt-3 text-base text-[var(--color-text-secondary)]" role="status">
          Este proyecto no tiene material multimedia.
        </p>
      ) : (
        <PhotoSequence files={files} label={projectName} contained = {false}/>
      )}
    </article>
  );
}
