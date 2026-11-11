"use client";

import { useCallback, useEffect, useState } from "react";
import { PhotoSequence } from "@/features/view/Animations/PhotoSequence";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import { filesInFolder } from "@/lib/utils/helpers/projectMediaFiles";
import { publicMediaSrc } from "@/lib/utils/helpers/normalization";
import { EVENTS } from "@/lib/utils/consts/mediaCatalog";
import { FairEvent } from "@/lib/types/components/options";

export function ExpoferiaCard() {

  // -----------------
  // -- Estados ------
  // -----------------

  const [open, setOpen] = useState<FairEvent | null>(null); // Estado para abrir el modal de la feria o evento
  const [files, setFiles] = useState<readonly string[] | null>(null); // Estado para las fotos de la feria o evento
  const close = useCallback(() => setOpen(null), []); // Función para cerrar el modal de la feria o evento

  // -----------------
  // -- Efectos ------
  // -----------------

  useEffect(() => {
    // Si no hay feria o evento seleccionada, se limpia el estado de las fotos
    if (!open) {
      setFiles(null);
      return;
    }
    // Si hay feria o evento seleccionada
    let active = true;
    setFiles(null);
      // Se leen las fotos de la carpeta del evento seleccionado
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
    // Si el componente se desmonta, se limpia el estado de las fotos
    return () => {
      active = false;
    };
  }, [open]);

  // -----------------
  // -- Renderizado --
  // -----------------

  return (
    // Bloque principal de la tarjeta
    <>
      <section className="rounded-3xl bg-white p-4 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]" aria-label="Eventos">
        <h2 className="text-2xl font-semibold"><b>EVENTOS</b></h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {EVENTS.map((event) => (
            <div key={event.folder} className="relative overflow-hidden rounded-2xl bg-[var(--color-background)]">
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
          ))}
        </div>
      </section>
      {open ? (
        // Modal de la feria o evento
        <ModalFrame title={open.title} onClose={close} wide>
          {files === null ? (
            <p className="text-base text-[var(--color-text-secondary)]" role="status">Leyendo fotos…</p>
          ) : files.length === 0 ? (
            <p className="text-base text-[var(--color-text-secondary)]" role="status">Esta feria no tiene fotos.</p>
          ) : (
            <PhotoSequence files={files} label={open.title} contained/>
          )}
        </ModalFrame>
      ) : null}
    </>
  );
}
