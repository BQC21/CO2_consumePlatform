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
import type { ProjectFormState, ProjectOrigin } from "@/lib/types/supabase/project-types";
import { DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS, PROJECT_STATUS_OPTIONS, SYSTEM_TYPE_OPTIONS } from "@/lib/utils/options";
import { ProjectFormModalProps } from "@/lib/types/components/components";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_IMAGE_LABEL } from "@/lib/utils/consts/image_props";

export function ProjectFormModal({ title, submitLabel, busyLabel, initial, onSubmit, onClose }: ProjectFormModalProps) {
  
  // ------------------
  // -- Estados -------
  // ------------------

  const [form, setForm] = useState<ProjectFormState>(initial);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  
  // Si viene del Supabase de Portal TEC
  const [catalog, setCatalog] = useState<PortalProjectOption[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(initial.insercion === "existente");
  const [catalogError, setCatalogError] = useState("");
  
  const locked = form.insercion === "existente"; // bloquear campos si la información viene del Portal TEC
  
  // Permitir seguimiento con el Portal TEC
  const [trackedOrigin, setTrackedOrigin] = useState(form.insercion);

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
    setForm((current) => ({ ...current, [field]: value }));
  }

  // Poder cambiar aquello que siempre puede editarse a pesar del estado de inserción
  function changeOrigin(origin: ProjectOrigin) {
    setError("");
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
    if (!item) {
      update("portal_proyecto_id", "");
      return;
    }
    setForm((current) => ({
      ...current,
      portal_proyecto_id: id,
      nombre: item.nombre,
      ubicacion: item.departamento,
      distrito: item.distrito,
      tipo_de_sistema: item.tipo_de_sistema || current.tipo_de_sistema,
      marca_inversor: item.marca_inversor,
      pot_nominal_kw: item.pot_nominal_kw === null ? "" : String(item.pot_nominal_kw),
      cap_instalada_kwp: item.cap_instalada_kwp === null ? "" : String(item.cap_instalada_kwp),
      paneles_instalados: String(item.paneles_instalados),
    }));
  }

  // Handlers
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Condición de llenar campos obligatorios
    if (!form.nombre.trim() || !form.ubicacion.trim() || !form.marca_inversor.trim() || !form.estado) {
      setError(locked ? "El proyecto del portal no trae departamento, nombre o inversor." : "Completa los campos obligatorios.");
      return;
    }

    // Condición de seleccionar un proyecto de Portal TEC cuando insercion == "existente"
    if (locked && !form.portal_proyecto_id) {
      setError("Selecciona un proyecto del portal TEC.");
      return;
    }

    // Condiciona los formatos de imágenes
    if (imageFile && !ACCEPTED_IMAGE_TYPES.includes(imageFile.type)) {
      setError("Usa una imagen JPG, PNG o WebP.");
      return;
    }

    // Condiciona el tamaño máximo de la imagen
    if (imageFile && imageFile.size > MAX_IMAGE_BYTES) {
      setError(`La imagen supera ${MAX_IMAGE_LABEL}.`);
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
    <ModalFrame title={title} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <AddSectionTitle>Datos del proyecto</AddSectionTitle>
          {/* Seleccionar inserción */}
          <fieldset className="flex gap-4 text-sm">
            <legend className="sr-only">Origen del proyecto</legend>
            {(["independiente", "existente"] as const).map((origin) => (
              <label key={origin} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="insercion"
                  checked={form.insercion === origin}
                  onChange={() => changeOrigin(origin)}
                />
                {origin === "independiente" ? "Independiente" : "Existente"}
              </label>
            ))}
          </fieldset>
        </div>

        {locked ? (
          <AddSelectField
            label="Nombre del proyecto"
            required
            value={form.portal_proyecto_id}
            options={catalog.map((item) => ({
              value: String(item.id),
              label: item.version ? `${item.nombre} -- ${item.version}` : item.nombre,
            }))}
            disabled={catalogLoading || catalog.length === 0}
            onChange={selectPortal}
          />
        ) : (
          <AddTextField label="Nombre del proyecto" required value={form.nombre} onChange={(value) => update("nombre", value)} />
        )}

        {/* Estado de lectura de datos de Portal TEC */}
        {catalogLoading ? <p className="text-sm text-[var(--color-text-secondary)]">Leyendo proyectos del portal…</p> : null}
        {catalogError ? <p className="field-error">{catalogError}</p> : null}



        <div className="grid gap-4 sm:grid-cols-2">
          {locked ? (
            <AddTextField label="Departamento" required value={form.ubicacion} disabled 
                  onChange={(value) => update("ubicacion", value)} />
          ) : (
            <AddSelectField
              label="Departamento"
              value={form.ubicacion}
              required
              options={DEPARTMENT_OPTIONS}
              onChange={(value) => update("ubicacion", value)}
            />
          )}

          <AddTextField label="Distrito o referencia" value={form.distrito} disabled={locked} 
                        onChange={(value) => update("distrito", value)} />

          {locked ? (
            <AddTextField label="Tipo de sistema" value={form.tipo_de_sistema} disabled 
                        onChange={(value) => update("tipo_de_sistema", value)} />
          ) : (
            <AddSelectField
              label="Tipo de sistema"
              value={form.tipo_de_sistema}
              options={SYSTEM_TYPE_OPTIONS}
              onChange={(value) => update("tipo_de_sistema", value)}
            />
          )}

          {locked ? (
            <AddTextField label="Marca del inversor" required value={form.marca_inversor} disabled 
                          onChange={(value) => update("marca_inversor", value)} />
          ) : (
            <AddSelectField
              label="Marca del inversor"
              required
              value={form.marca_inversor}
              options={INVERTER_BRAND_OPTIONS}
              onChange={(value) => update("marca_inversor", value)}
            />
          )}

          <AddNumberField
            label="Cap. instalada (kWp)"
            value={form.cap_instalada_kwp}
            disabled={locked}
            onChange={(value) => update("cap_instalada_kwp", value)}
          />
          
          <AddDateField label="Fecha de instalación" value={form.fecha_instalacion} 
                        onChange={(value) => update("fecha_instalacion", value)} />
        </div>



        <AddSelectField
          label="Estado"
          required
          value={form.estado}
          options={PROJECT_STATUS_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
          onChange={(value) => update("estado", value === "completado" ? "completado" : "en_ejecucion")}
        />


        {error ? <p className="field-error">{error}</p> : null}

        <button className="btn-primary" type="submit" disabled={busy || catalogLoading}>
          {busy ? busyLabel : submitLabel}
        </button>
      
      
      </form>
    </ModalFrame>
  );
}
