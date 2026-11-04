"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageCardProps } from "@/lib/types/components/components";
import { mediaFileName, mediaForProject, mediaKind, publicMediaSrc } from "@/lib/utils/consts/mediaCatalog";

export function ImageCard({ projectName }: ImageCardProps) {
  const entry = mediaForProject(projectName);
  const files = entry?.files ?? [];
  const [index, setIndex] = useState(0);
  const [retry, setRetry] = useState(0);
  const [tracked, setTracked] = useState(projectName);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  if (projectName !== tracked) {
    setTracked(projectName);
    setIndex(0);
    setRetry(0);
    setStatus("loading");
  }

  const safeIndex = files.length === 0 ? 0 : Math.min(index, files.length - 1);
  const current = files[safeIndex] ?? null;
  const token = `${projectName ?? ""}:${current ?? ""}:${retry}`;
  const [tokenSeen, setTokenSeen] = useState(token);
  if (token !== tokenSeen) {
    setTokenSeen(token);
    setStatus("loading");
  }

  const kind = current ? mediaKind(current) : "unsupported";
  const src = current ? publicMediaSrc(current) : "";
  const label = current ? mediaFileName(current) : "";

  function show(nextIndex: number) {
    setIndex(nextIndex);
    setStatus("loading");
  }

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
        <div className="mt-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--color-background)]">
            {status === "loading" ? <div className="skeleton absolute inset-0" aria-hidden="true" /> : null}
            {status === "error" ? (
              <div className="absolute inset-0 grid place-items-center px-4 text-center" role="alert">
                <div>
                  <p className="text-base text-[var(--color-text-secondary)]">No se pudo cargar el material.</p>
                  <button type="button" className="btn-secondary mt-3 h-10" onClick={() => setRetry((value) => value + 1)}>
                    Reintentar
                  </button>
                </div>
              </div>
            ) : kind === "video" ? (
              <video
                key={token}
                className="h-full w-full object-cover"
                controls
                preload="metadata"
                src={src}
                onLoadedData={() => setStatus("ready")}
                onError={() => setStatus("error")}
              >
                {projectName}
              </video>
            ) : (
              <Image
                key={token}
                src={src}
                alt={`${projectName}, material ${safeIndex + 1} de ${files.length}`}
                fill
                unoptimized
                sizes="(min-width: 1280px) 28rem, 100vw"
                className={`object-cover ${status === "ready" ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setStatus("ready")}
                onError={() => setStatus("error")}
              />
            )}
          </div>
          {files.length > 1 ? (
            <div className="mt-3 flex items-center justify-between gap-2">
              <button type="button" className="btn-secondary h-10 px-4" disabled={safeIndex === 0} onClick={() => show(safeIndex - 1)}>
                Anterior
              </button>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {safeIndex + 1} de {files.length}
              </p>
              <button
                type="button"
                className="btn-secondary h-10 px-4"
                disabled={safeIndex === files.length - 1}
                onClick={() => show(safeIndex + 1)}
              >
                Siguiente
              </button>
            </div>
          ) : null}
        </div>
      )}
    </article>
  );
}
