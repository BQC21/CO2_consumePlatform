"use client";

import { useEffect, useState } from "react";
import { getPortalProjects } from "@/features/model/services/portalProjectQueries";
import {
  AddDateField,
  AddNumberField,
  AddSectionTitle,
  AddSelectField,
  AddTextField,
} from "@/features/view/components/Form_fields/fields";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import type { PortalProjectOption } from "@/lib/types/supabase/portal-project";
import type { ProjectFormState } from "@/lib/types/supabase/project-types";
import { BATTERY_BRAND_OPTIONS, DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS, PANEL_BRAND_OPTIONS, PROJECT_STATUS_OPTIONS, SYSTEM_TYPE_OPTIONS } from "@/lib/utils/options";
import { brandOrUnbranded, catalogOption, optionsIncludingValue } from "@/lib/utils/helpers/options";
import { ProjectFormModalProps } from "@/lib/types/components/components";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_IMAGE_LABEL } from "@/lib/utils/consts/image_props";
import { ProjectOrigin } from "@/lib/types/components/options";

export function ProjectFormModal({ title, submitLabel, busyLabel, initial, onSubmit, onClose }: ProjectFormModalProps) {
  
  // ------------------
  // -- Estados -------
  // ------------------

  const [form, setForm] = useState<ProjectFormState>(initial);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [busy, setBusy] = useState(false);
  
  // Si viene del Supabase de Portal TEC
  const [catalog, setCatalog] = useState<PortalProjectOption[]>([]); // información de Portal TEC que se plasmará en la plataforma
  const [selectedQuoteId, setSelectedQuoteId] = useState(""); // id de cotización
  const [catalogLoading, setCatalogLoading] = useState(initial.insercion === "existente");
  const [catalogError, setCatalogError] = useState("");
  
  const locked = form.insercion === "existente"; // bloquear campos si la información viene del Portal TEC
  const selectedQuote = catalog.find((row) => String(row.id) === selectedQuoteId); // cotización seleccionado
  const independentQuote = locked && selectedQuote?.proyectoId === null; // cotización independiente ?
  const portalLocked = locked && !independentQuote; // campos que no se llenaron de portal TEC
  
  // Permitir seguimiento con el Portal TEC
  const [trackedOrigin, setTrackedOrigin] = useState(form.insercion);

  // Efecto para cambiar el estado de inserción
  if (trackedOrigin !== form.insercion) {
    setTrackedOrigin(form.insercion);
    setCatalogLoading(form.insercion === "existente");
    setCatalogError("");
  }

  // -------------------------
  // -- Sincronización -------
  // -------------------------

  // Lectura de la info de Portal TEC
  useEffect(() => {
    if (!locked) {
      return;
    }
    let active = true;
    getPortalProjects()
      .then((rows) => {
        if (active) {
          setCatalog(rows);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setCatalogError(err instanceof Error ? err.message : "No se pudo leer el portal TEC.");
        }
      })
      .finally(() => {
        if (active) {
          setCatalogLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [locked]);

  // ------------------
  // -- Funciones -------
  // ------------------

  // Actualizar form de Projects (PLATFORM)
  function update<K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) {
    if (field === "nombre") {
      setNameError("");
    }
    setForm((current) => ({ ...current, [field]: value }));
  }

  // Poder cambiar aquello que siempre puede editarse a pesar del estado de inserción
  function changeOrigin(origin: ProjectOrigin) {
    setError("");
    setSelectedQuoteId(""); 
    setForm((current) => ({
      ...initial,
      insercion: origin,
      estado: current.estado,
      fecha_instalacion: current.fecha_instalacion,
    }));
  }

  // Mencionar que atributos se extrae de Portal TEC en caso inserción == "existente"
  function selectPortal(id: string) {
    const item = catalog.find((row) => String(row.id) === id);
    setSelectedQuoteId(item ? id : "");
    if (!item) {
      update("portal_proyecto_id", "");
      return;
    }
    setForm((current) => ({
      ...current,
      portal_proyecto_id: item.proyectoId === null ? "" : String(item.proyectoId),
      nombre: item.nombre,
      ubicacion: item.departamento,
      distrito: item.distrito,
      tipo_de_sistema: item.tipo_de_sistema || current.tipo_de_sistema,
      marca_inversor: item.marca_inversor,
      marca_panel: brandOrUnbranded(item.marca_panel),
      marca_bateria: brandOrUnbranded(item.marca_bateria),
      pot_nominal_kw: item.pot_nominal_kw === null ? "" : String(item.pot_nominal_kw),
      cap_instalada_kwp: item.cap_instalada_kwp === null ? "" : String(item.cap_instalada_kwp),
      paneles_instalados: String(item.paneles_instalados),
    }));
  }

  // Handlers
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Condiciona el nombre del proyecto si está vacío
    const missingName = !form.nombre.trim();
    setNameError(missingName ? "El nombre del proyecto es obligatorio." : "");

    // Condiciona el proyecto del portal TEC si está bloqueado
    if (locked && !selectedQuoteId) {
      setError("Selecciona un proyecto del portal TEC.");
      return;
    }

    // Condiciona los campos obligatorios si el nombre está vacío
    const missingRest = !form.ubicacion.trim() || !form.marca_inversor.trim() || !form.estado;
    if (missingName || missingRest) {
      setError(missingRest ? (portalLocked ? "El proyecto del portal no trae departamento, nombre o inversor." : "Completa los campos obligatorios.") : "");
      return;
    }

    setBusy(true);
    setError("");
    
    try {
      await onSubmit(form, imageFile ?? undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el proyecto.");
      setBusy(false);
    }
  }

  return (
    <ModalFrame title={title} onClose={onClose} roomy>
      <form className="form-sheet grid gap-5" noValidate onSubmit={handleSubmit}>
        <section className="grid gap-3">
          <AddSectionTitle>1 · Datos generales</AddSectionTitle>
          <fieldset className="grid gap-2 sm:grid-cols-2">
            <legend className="sr-only">Origen del proyecto</legend>
            {(["independiente", "existente"] as const).map((origin) => {
              const active = form.insercion === origin;
              return (
                <label
                  key={origin}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${active ? "border-[var(--color-primary)] bg-[#fff4ee]" : "border-[var(--border-color)]"}`}
                >
                  <input type="radio" name="insercion" checked={active} onChange={() => changeOrigin(origin)} />
                  {origin === "independiente" ? "Independiente" : "Existente"}
                </label>
              );
            })}
          </fieldset>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Independiente: instalación nueva con su propio registro.
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Existente: amplía o reemplaza un proyecto ya registrado (se vincula a él).
          </p>
          {locked ? (
            <AddSelectField
              label="Nombre del proyecto"
              required
              value={selectedQuoteId}
              error={nameError}
              options={catalog.map((item) => ({
                value: String(item.id),
                label: item.nombre,
              }))}
              disabled={catalogLoading || catalog.length === 0}
              onChange={selectPortal}
            />
          ) : (
            <AddTextField
              label="Nombre del proyecto"
              required
              value={form.nombre}
              error={nameError}
              onChange={(value) => update("nombre", value)}
            />
          )}
          {catalogLoading ? <p className="text-sm text-[var(--color-text-secondary)]">Leyendo proyectos del portal…</p> : null}
          {catalogError ? <p className="field-error">{catalogError}</p> : null}
        </section>

        <section className="grid gap-3">
          <AddSectionTitle>2 · Ubicación</AddSectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {portalLocked ? (
              <AddTextField label="Departamento" required value={form.ubicacion} disabled onChange={(value) => update("ubicacion", value)} />
            ) : (
              <AddSelectField label="Departamento" value={form.ubicacion} required options={DEPARTMENT_OPTIONS} onChange={(value) => update("ubicacion", value)} />
            )}
          </div>
        </section>

        <section className="grid gap-3">
          <AddSectionTitle>3 · Sistema y equipos</AddSectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {portalLocked ? (
              <AddTextField label="Tipo de sistema" required value={form.tipo_de_sistema} disabled onChange={(value) => update("tipo_de_sistema", value)} />
            ) : (
              <AddSelectField label="Tipo de sistema" required value={form.tipo_de_sistema} options={SYSTEM_TYPE_OPTIONS} onChange={(value) => update("tipo_de_sistema", value)} />
            )}
            {portalLocked ? (
              <AddTextField label="Marca del inversor" required value={form.marca_inversor} disabled onChange={(value) => update("marca_inversor", value)} />
            ) : (
              <AddSelectField label="Marca del inversor" required value={form.marca_inversor} options={INVERTER_BRAND_OPTIONS} onChange={(value) => update("marca_inversor", value)} />
            )}
            <AddSelectField
              label="Marca del panel"
              value={catalogOption(PANEL_BRAND_OPTIONS, brandOrUnbranded(form.marca_panel))}
              disabled={portalLocked}
              options={optionsIncludingValue(PANEL_BRAND_OPTIONS, brandOrUnbranded(form.marca_panel))}
              onChange={(value) => update("marca_panel", value)}
            />
            <AddSelectField
              label="Marca de la batería"
              value={catalogOption(BATTERY_BRAND_OPTIONS, brandOrUnbranded(form.marca_bateria))}
              disabled={portalLocked}
              options={optionsIncludingValue(BATTERY_BRAND_OPTIONS, brandOrUnbranded(form.marca_bateria))}
              onChange={(value) => update("marca_bateria", value)}
            />
            <AddNumberField label="Capacidad instalada" required value={form.cap_instalada_kwp} placeholder="Ej.: 6.25" suffix="kWp" disabled={portalLocked} onChange={(value) => update("cap_instalada_kwp", value)} />
            <AddNumberField label="Paneles instalados" value={form.paneles_instalados} placeholder="Ej.: 12" suffix="paneles" disabled={locked} onChange={(value) => update("paneles_instalados", value)} />
          </div>
        </section>

        <section className="grid gap-3">
          <AddSectionTitle>4 · Instalación</AddSectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <AddDateField label="Fecha de instalación" required value={form.fecha_instalacion} onChange={(value) => update("fecha_instalacion", value)} />
            <AddSelectField
              label="Estado"
              required
              value={form.estado}
              options={PROJECT_STATUS_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
              onChange={(value) => update("estado", value === "completado" ? "completado" : "en_ejecucion")}
            />
          </div>
        </section>

        {error ? <p className="field-error">{error}</p> : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-text-secondary)]">* Campo obligatorio</p>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={busy}>
              Cancelar
            </button>
            <button className="btn-primary" type="submit" disabled={busy || catalogLoading}>
              {busy ? busyLabel : submitLabel}
            </button>
          </div>
        </div>
      </form>
    </ModalFrame>
  );
}
