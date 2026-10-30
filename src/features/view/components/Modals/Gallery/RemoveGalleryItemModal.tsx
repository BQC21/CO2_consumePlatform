"use client";

import { useState } from "react";
import { AlertIcon, PlayIcon } from "@/features/view/components/Icons/icons";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import type { GalleryMediaItem } from "@/lib/types/supabase/gallery-types";
import { GALLERY_REMOVE_NOTICE } from "@/lib/utils/consts/messages";
import { GalleryMediaKind } from "@/lib/types/components/options";

export function RemoveGalleryItemModal({
  item,
  kind,
  projectName,
  url,
  onConfirm,
  onClose,
}: {
  item: GalleryMediaItem;
  kind: GalleryMediaKind;
  projectName: string;
  url: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const noun = kind === "video" ? "video" : "foto";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo quitar el archivo.");
      setBusy(false);
    }
  }

  return (
    <ModalFrame title={`¿Quitar este ${noun}?`} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fff1f1] text-[var(--color-error)]">
            <AlertIcon />
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-[var(--color-surface-muted)] p-3">
          {url && kind === "foto" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-14 w-20 rounded-lg object-cover" />
          ) : (
            <span className="grid h-14 w-20 place-items-center rounded-lg bg-black text-white">
              <PlayIcon />
            </span>
          )}
          <span>
            <span className="block text-sm font-semibold">{item.nombre}</span>
            <span className="block text-xs text-[var(--color-text-secondary)]">
              {item.duracion ? `${item.duracion} · ` : ""}
              {projectName}
            </span>
          </span>
        </div>
        <p className="text-center text-sm text-[var(--color-text-secondary)]">{GALLERY_REMOVE_NOTICE}</p>
        {error ? <p className="field-error">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={busy}>
            Cancelar
          </button>
          <button type="submit" className="btn-danger" disabled={busy}>
            {busy ? "Quitando..." : `Quitar ${noun}`}
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
