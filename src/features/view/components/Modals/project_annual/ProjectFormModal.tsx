"use client";

import { useState } from "react";
import {
  AddDateField,
  AddNumberField,
  AddSearchableSelectField,
  AddSectionTitle,
  AddSelectField,
  AddTextAreaField,
  AddTextField,
} from "@/features/view/components/Form_fields/fields";
import { ModalFrame } from "@/features/view/refactor/ModalFrame";
import type { ProjectFormState } from "@/lib/types/supabase/project-types";
import { DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS, PROJECT_STATUS_OPTIONS, SYSTEM_TYPE_OPTIONS } from "@/lib/utils/options";
import { ProjectFormModalProps } from "@/lib/types/components/components";

export function ProjectFormModal({ title, submitLabel, busyLabel, initial, onSubmit, onClose }: ProjectFormModalProps) {
  const [form, setForm] = useState<ProjectFormState>(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update<K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.nombre.trim() || !form.ubicacion.trim()) {
      setError("Indica el nombre de la planta y el departamento.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el proyecto.");
      setBusy(false);
    }
  }

  return (
    <ModalFrame title={title} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <AddSectionTitle>Datos de la planta</AddSectionTitle>
        <AddTextField label="Proyecto" value={form.nombre} onChange={(value) => update("nombre", value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <AddSearchableSelectField label="Departamento" value={form.ubicacion} options={DEPARTMENT_OPTIONS} onChange={(value) => update("ubicacion", value)} />
          <AddTextField label="Distrito o referencia" value={form.distrito} onChange={(value) => update("distrito", value)} />
          <AddSearchableSelectField label="Tipo de sistema" value={form.tipo_de_sistema} options={SYSTEM_TYPE_OPTIONS} onChange={(value) => update("tipo_de_sistema", value)} />
          <AddSearchableSelectField label="Marca del inversor" value={form.marca_inversor} options={INVERTER_BRAND_OPTIONS} onChange={(value) => update("marca_inversor", value)} />
          <AddNumberField label="Pot. nominal (kW)" value={form.pot_nominal_kw} onChange={(value) => update("pot_nominal_kw", value)} />
          <AddNumberField label="Cap. instalada (kWp)" value={form.cap_instalada_kwp} onChange={(value) => update("cap_instalada_kwp", value)} />
          <AddDateField label="Fecha de instalación" value={form.fecha_instalacion} onChange={(value) => update("fecha_instalacion", value)} />
          <AddNumberField label="Paneles instalados" value={form.paneles_instalados} onChange={(value) => update("paneles_instalados", value)} />
        </div>
        <AddSelectField
          label="Estado"
          value={form.estado}
          options={PROJECT_STATUS_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
          onChange={(value) => update("estado", value === "completado" ? "completado" : "en_ejecucion")}
        />
        <AddTextAreaField label="Descripción" value={form.descripcion} onChange={(value) => update("descripcion", value)} />
        {error ? <p className="field-error">{error}</p> : null}
        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? busyLabel : submitLabel}
        </button>
      </form>
    </ModalFrame>
  );
}
