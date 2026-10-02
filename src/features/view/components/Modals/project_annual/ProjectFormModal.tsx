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

  // -----------------------
  // ----- Estados ---------
  // -----------------------

  const [form, setForm] = useState<ProjectFormState>(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // -----------------------
  // ----- Funciones -------
  // -----------------------

  // Actualizar formulario
  function update<K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  // Handler de suscripción
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
        !form.nombre.trim() || 
        !form.ubicacion.trim() || 
        !form.marca_inversor.trim() || 
        !form.estado
      ) {
      setError("Completa los campos obligatorios.");
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

  // -----------------------
  // ----- Renderizado -----
  // -----------------------

  return (
    <ModalFrame title={title} onClose={onClose}>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <AddSectionTitle>Datos del proyecto</AddSectionTitle>
        <AddTextField label="Nombre del proyecto" required value={form.nombre} 
                      onChange={(value) => update("nombre", value)} />

        <div className="grid gap-4 sm:grid-cols-2">
          <AddSelectField
            label="Departamento"
            value={form.ubicacion} required
            options={DEPARTMENT_OPTIONS}
            onChange={(value) => update("ubicacion", value)}
          />
          <AddTextField label="Distrito o referencia" value={form.distrito} 
                        onChange={(value) => update("distrito", value)} />
          <AddSelectField
            label="Tipo de sistema" 
            value={form.tipo_de_sistema}
            options={SYSTEM_TYPE_OPTIONS}
            onChange={(value) => update("tipo_de_sistema", value)}
          />
          <AddSelectField
            label="Marca del inversor" required
            value={form.marca_inversor}
            options={INVERTER_BRAND_OPTIONS}
            onChange={(value) => update("marca_inversor", value)}
          />
          <AddNumberField label="Cap. instalada (kWp)" value={form.cap_instalada_kwp} 
                          onChange={(value) => update("cap_instalada_kwp", value)}/>
          <AddDateField label="Fecha de instalación" value={form.fecha_instalacion} 
                        onChange={(value) => update("fecha_instalacion", value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
            <AddNumberField label="Reducción de CO2 (kg) TOTAL" value={form.reduccion_co2} 
                            onChange={(value) => setForm((current) => ({ ...current, reduccion_co2: value }))} 
                            min={0} step={0.001} />
            <AddNumberField label="Árboles plantados TOTALES" value={form.arboles} 
                            onChange={(value) => setForm((current) => ({ ...current, arboles: value }))} 
                            min={0} step={0.001} />
            <AddNumberField label="Ahorro de carbón (kg) TOTAL" value={form.reduccion_carbon} 
                            onChange={(value) => setForm((current) => ({ ...current, reduccion_carbon: value }))} 
                            min={0} step={0.001} />
        </div>
        <AddSelectField
          label="Estado" required
          value={form.estado}
          options={PROJECT_STATUS_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
          onChange={(value) => update("estado", value === "completado" ? "completado" : "en_ejecucion")}
        />

        <AddTextAreaField label="Descripción" value={form.descripcion} onChange={(value) => update("descripcion", value)} />

        {/* En caso haya error al suscribir cambios */}
        {error ? <p className="field-error">{error}</p> : null}

        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? busyLabel : submitLabel}
        </button>
      </form>
    </ModalFrame>
  );
}
