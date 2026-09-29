"use client";

import { useState } from "react";
import { ModalFrame } from "@/features/view/refactor/ModalFrame";
import { formatMonthLabel } from "@/lib/utils/helpers/render/format";
import { DeleteMonthModalProps } from "@/lib/types/components/components";

export function DeleteMonthModal({ month, projectName, onDelete, onClose }: DeleteMonthModalProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await onDelete(month.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el mes.");
      setBusy(false);
    }
  }

  return (
    <ModalFrame title="Eliminar mes" onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <p>
          Se eliminará solo {formatMonthLabel(month.mes)} de <strong>{projectName}</strong>. El proyecto anual se mantiene.
        </p>
        {error ? <p className="field-error">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-danger" disabled={busy}>
            {busy ? "Eliminando…" : "Eliminar mes"}
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
