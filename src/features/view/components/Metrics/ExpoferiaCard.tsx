"use client";

import Image from "next/image";
import { useState } from "react";
import { EXPOFERIA_2026_IMAGES } from "@/lib/utils/consts/mediaCatalog";
import { publicMediaSrc } from "@/lib/utils/helpers/normalization";

export function ExpoferiaCard() {

  const files = EXPOFERIA_2026_IMAGES;
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const safeIndex = files.length === 0 ? 0 : Math.min(index, files.length - 1);
  const current = files[safeIndex] ?? null;
  
  function show(nextIndex: number) {
    setIndex(nextIndex);
    setStatus("loading");
  }

  return (
    <section className="rounded-3xl bg-white p-5 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]" aria-label="Expoferia 2026">
      <h2 className="mt-1 text-2xl font-semibold">Expoferia 2026</h2>
      {files.length === 0 || !current ? (
        <p className="mt-3 text-base text-[var(--color-text-secondary)]" role="status">
          No hay fotos de la expoferia.
        </p>
      ) : (
        <div className="mt-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--color-background)]">
            {status === "loading" ? <div className="skeleton absolute inset-0" aria-hidden="true" /> : null}
            {status === "error" ? (
              <div className="absolute inset-0 grid place-items-center px-4 text-center" role="alert">
                <p className="text-base text-[var(--color-text-secondary)]">No se pudo cargar la foto.</p>
              </div>
            ) : (
              <Image
                key={current}
                src={publicMediaSrc(current)}
                alt={`Expoferia 2026, foto ${safeIndex + 1} de ${files.length}`}
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
              <button type="button" className="btn-secondary h-10 px-4" disabled={safeIndex === files.length - 1} onClick={() => show(safeIndex + 1)}>
                Siguiente
              </button>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
