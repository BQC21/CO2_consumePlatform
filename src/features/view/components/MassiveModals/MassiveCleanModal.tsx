"use client";

import { useState } from "react";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import { MassiveCleanModalProps } from "@/lib/types/components/components";

export function MassiveCleanModal({ title, description, onClean, onClose }: MassiveCleanModalProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await onClean();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo limpiar la tabla.");
      setBusy(false);
    }
  }

  return (
    <ModalFrame title={title} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <p>{description}</p>
        {error ? <p className="field-error">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-danger" disabled={busy}>
            {busy ? "Limpiando…" : "Vaciar tabla"}
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
