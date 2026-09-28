"use client";

import { useState } from "react";
import { ModalFrame } from "@/features/view/refactor/ModalFrame";
import type { Project } from "@/lib/types/supabase/project-types";

type DeleteProjectModalProps = {
  project: Project;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
};

export function DeleteProjectModal({ project, onDelete, onClose }: DeleteProjectModalProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await onDelete(project.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el proyecto.");
      setBusy(false);
    }
  }

  return (
    <ModalFrame title="Eliminar proyecto" onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <p>
          Se eliminará <strong>{project.nombre}</strong> por completo, incluidos sus registros mensuales.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">Eliminar solo afecta al proyecto completo.</p>
        {error ? <p className="field-error">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-danger" disabled={busy}>
            {busy ? "Eliminando…" : "Eliminar proyecto"}
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
