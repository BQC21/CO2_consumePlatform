"use client";

import { useCallback, useEffect, useState } from "react";
import { PhotoSequence } from "@/features/view/Animations/PhotoSequence";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import { filesInFolder } from "@/lib/utils/helpers/projectMediaFiles";
import { publicMediaSrc } from "@/lib/utils/helpers/normalization";
import { EVENTS } from "@/lib/utils/consts/mediaCatalog";
import { FairEvent } from "@/lib/types/components/options";

export function ExpoferiaCard() {
  const [open, setOpen] = useState<FairEvent | null>(null);
  const [files, setFiles] = useState<readonly string[] | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) {
      setFiles(null);
      return;
    }
    let active = true;
    setFiles(null);
    void filesInFolder(open.folder)
      .then((found) => {
        if (active) {
          setFiles(found);
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
  }, [open]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {/* Bloque de ferias y eventos */}
        {EVENTS.map((event) => (
          <section key={event.folder} className="rounded-3xl bg-white p-4 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]" aria-label={event.title}>
            <h2 className="text-2xl font-semibold">Eventos</h2>
            <div className="relative mt-3 overflow-hidden rounded-2xl bg-[var(--color-background)]">
              <img src={publicMediaSrc(event.cover)} alt={event.title} className="aspect-[4/3] w-full object-cover" />
              <button
                type="button"
                className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-center bg-[color-mix(in_srgb,var(--color-secondary)_28%,transparent)] px-10 text-base font-semibold text-white backdrop-blur-[2px]"
                aria-label={`Ver fotos de ${event.title}`}
                onClick={() => setOpen(event)}
              >
                <span>{event.title}</span>
                <svg className="absolute right-3" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M5 13 L13 5 M7 5 H13 V11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </section>
        ))}
      </div>
      {open ? (
        // Modal de la feria o evento
        <ModalFrame title={open.title} onClose={close} wide>
          {files === null ? (
            <p className="text-base text-[var(--color-text-secondary)]" role="status">Leyendo fotos…</p>
          ) : files.length === 0 ? (
            <p className="text-base text-[var(--color-text-secondary)]" role="status">Esta feria no tiene fotos.</p>
          ) : (
            <PhotoSequence files={files} label={open.title} />
          )}
        </ModalFrame>
      ) : null}
    </>
  );
}
