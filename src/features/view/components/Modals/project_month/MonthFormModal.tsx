"use client";

import { useState } from "react";
import { AddNumberField, AddSearchableSelectField, AddSelectField, AddTextField } from "@/features/view/components/Form_fields/fields";
import { ModalFrame } from "@/features/view/refactor/ModalFrame";
import { toYearMonth } from "@/lib/utils/helpers/normalization";
import { MonthFormModalProps } from "@/lib/types/components/components";

export function MonthFormModal({ title, initial, projects, onSubmit, onClose }: MonthFormModalProps) {
  
  // -----------------------
  // ----- Estados ---------
  // -----------------------

  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  

  // -----------------------
  // ----- Funciones -------
  // -----------------------

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.proyecto_id || !toYearMonth(form.mes)) {
      setError("Elige el proyecto y un mes válido.");
      return;
    }
    setBusy(true);
    try {
      await onSubmit({ ...form, mes: toYearMonth(form.mes) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el mes.");
      setBusy(false);
    }
  }

  // -----------------------
  // ----- Renderizado -----
  // -----------------------

  return (
    <ModalFrame title={title} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>

        <AddSelectField
          label="Proyecto"
          value={form.proyecto_id}
          options={projects.map((project) => ({ value: project.id, label: project.nombre }))}
          onChange={(proyecto_id) => {
            setForm((current) => ({ ...current, proyecto_id }));
          }}
        />

        <AddTextField required label="Mes (2026-01 o 01.2026)" value={form.mes} 
                      onChange={(value) => setForm((current) => ({ ...current, mes: value }))} />
        
        <div className="grid gap-4 sm:grid-cols-3">
          <AddNumberField required label="Rendimiento FV (KWh)" value={form.rendimiento_fv} 
                          onChange={(value) => setForm((current) => ({ ...current, rendimiento_fv: value }))}
                          min={0} step={0.001} />
          <AddNumberField required label="Energía importada de la red (kWh)" value={form.rendimiento_grid} 
                          onChange={(value) => setForm((current) => ({ ...current, rendimiento_grid: value }))}
                          min={0} step={0.001} />
          <AddNumberField required label="Consumo de la carga (kWh)" value={form.consumo_carga} 
                          onChange={(value) => setForm((current) => ({ ...current, consumo_carga: value }))}
                          min={0} step={0.001} />
        </div>
        

        {/* En caso haya error al suscribir cambios */}
        {error ? <p className="field-error">{error}</p> : null}

        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? "Guardando…" : "Guardar mes"}
        </button>
      </form>
    </ModalFrame>
  );
}
