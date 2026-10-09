"use client";

import { useState } from "react";
import { ModalFrame } from "@/features/view/refactor/ModalFrame";
import type { Project, ProjectFormState } from "@/lib/types/supabase/project-types";
import { AddNumberField } from "../../Form_fields/fields";
import { createProjectFormStateFromProject } from "@/features/model/mapping/mapping_project";

export function ProjectMetricsModal({
  project,
  onUpdate,
  onClose,
}: {
  project: Project;
  onUpdate: (id: string, form: ProjectFormState) => Promise<void>;
  onClose: () => void;
}) {

  // ------------------
  // -- Estados -------
  // ------------------
  const [form, setForm] = useState<ProjectFormState>(createProjectFormStateFromProject(project));

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // --------------------
  // -- Funciones -------
  // --------------------
  // Actualizar form de Projects (PLATFORM)
  function update<K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  // Handlers
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setBusy(true);
    setError("");

    try {
      await onUpdate(project.id, form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron guardar las métricas.");
      setBusy(false);
    }
  }

  return (
    <ModalFrame title={`Métricas · ${project.nombre}`} onClose={onClose} wide>
      <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
          
          {/* Energía */}

          <AddNumberField
            label="Rendimiento Fotovoltaico (KWh)"
            value={form.rendimiento_fv_total}
            onChange={(value) => update("rendimiento_fv_total", value)}
          /> 

          <AddNumberField
            label="Rendimiento de la red eléctrica (KWh)"
            value={form.rendimiento_grid_total}
            onChange={(value) => update("rendimiento_grid_total", value)}
          /> 

          <AddNumberField
            label="Rendimiento de la carga (KWh)"
            value={form.carga_consumida_total}
            onChange={(value) => update("carga_consumida_total", value)}
          /> 

          {/* Ambientales */}

          <AddNumberField
            label="Reducción de CO2 (kg)"
            value={form.reduccion_co2}
            onChange={(value) => update("reduccion_co2", value)}
          /> 

          <AddNumberField
            label="Reducción de Carbón convencional (kg)"
            value={form.reduccion_carbon}
            onChange={(value) => update("reduccion_carbon", value)}
          /> 

          <AddNumberField
            label="Árboles equivalentes plantados"
            value={form.arboles}
            onChange={(value) => update("arboles", value)}
          />  
      </div>
      {error ? <p className="field-error">{error}</p> : null}
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Guardando…" : "Guardar métricas"}
        </button>
      </div>
      </form>
    </ModalFrame>
  );
}
