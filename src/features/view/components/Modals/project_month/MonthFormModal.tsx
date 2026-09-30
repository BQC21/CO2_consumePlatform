"use client";

import { useMemo, useState } from "react";
import { AddNumberField, AddReadOnlyField, AddSearchableSelectField, AddTextField } from "@/features/view/components/Form_fields/fields";
import { ModalFrame } from "@/features/view/refactor/ModalFrame";
import { computeMonthEnergy } from "@/lib/utils/helpers/computes/energy_total";
import { formatNumber } from "@/lib/utils/helpers/render/format";
import { toNumber, toYearMonth } from "@/lib/utils/helpers/normalization";
import { MonthFormModalProps } from "@/lib/types/components/components";

export function MonthFormModal({ title, initial, projects, onSubmit, onClose }: MonthFormModalProps) {
  
  // -----------------------
  // ----- Estados ---------
  // -----------------------

  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  
  
  // ------------------------------
  // ----- Almacenamiento ---------
  // ------------------------------

  // calculo del total de energía anual
  const preview = useMemo(() => computeMonthEnergy(toNumber(form.tipico_diario), toYearMonth(form.mes)), [form.mes, form.tipico_diario]);

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

        <AddSearchableSelectField
          label="Proyecto"
          value={projects.find((project) => project.id === form.proyecto_id)?.nombre ?? ""}
          options={projects.map((project) => project.nombre)}
          onChange={(nombre) => {
            const project = projects.find((item) => item.nombre === nombre);
            setForm((current) => ({
              ...current,
              proyecto_id: project?.id ?? "",
              pot_nominal_kw: current.pot_nominal_kw || (project?.pot_nominal_kw?.toString() ?? ""),
            }));
          }}
        />

        <AddTextField label="Mes (2026-01 o 01.2026)" value={form.mes} 
                      onChange={(value) => setForm((current) => ({ ...current, mes: value }))} />
        
        <div className="grid gap-4 sm:grid-cols-2">
          {/* rendimiento fotovoltaico */}
          <AddNumberField label="Típico diario (kWh)" value={form.tipico_diario} 
                          onChange={(value) => setForm((current) => ({ ...current, tipico_diario: value }))} />
          {/* rendimiento de la red eléctrica */}
          <AddNumberField label="Pot. nominal (kW)" value={form.pot_nominal_kw} 
                          onChange={(value) => setForm((current) => ({ ...current, pot_nominal_kw: value }))} />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-3">
          <AddReadOnlyField label="Reducción de CO2 (kg)" value={formatNumber(preview.co2Kg, 1)} />
          <AddReadOnlyField label="Árboles plantados" value={formatNumber(preview.arboles, 1)} />
          <AddReadOnlyField label="Ahorro de carbón (kg)" value={formatNumber(preview.carbonKg, 1)} />
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
