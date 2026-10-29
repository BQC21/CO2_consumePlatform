"use client";

import { Fragment, useEffect, useState } from "react";
import { Button2Delete, MetricsButton } from "@/features/view/components/Buttons/buttons";
import { EditIcon } from "@/features/view/components/Icons/icons";
import { DeleteProjectModal } from "@/features/view/components/Modals/project_annual/DeleteProjectModal";
import { createProjectFormStateFromProject } from "@/features/model/mapping/mapping_project";
import type { Project, ProjectFormState } from "@/lib/types/supabase/project-types";
import { BATTERY_BRAND_OPTIONS, DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS, PANEL_BRAND_OPTIONS, SYSTEM_TYPE_OPTIONS, UNBRANDED } from "@/lib/utils/options";
import { brandOrUnbranded, catalogOption, optionsIncludingValue } from "@/lib/utils/helpers/options";
import { ProjectAnnualTableProps } from "@/lib/types/components/components";
import { formatDayMonthYear, formatNumber } from "@/lib/utils/helpers/normalization";
import { DetailField } from "@/features/view/components/Form_fields/fields";
import { displayBrand, StatusPill, Chevron } from "@/lib/utils/helpers/render/Table";
import { editClass } from "@/lib/utils/consts/design";

export function ProjectAnnualTable({ projects, total, onUpdate, onDelete, onEditingChange }: ProjectAnnualTableProps) {
  
  // Estados
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ProjectFormState>>({});
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});

  // Efecto para cambiar el estado de edición
  useEffect(() => {
    onEditingChange?.(Object.keys(drafts).length);
  }, [drafts, onEditingChange]);

  // Función para actualizar el estado del formulario
  function updateDraft<K extends keyof ProjectFormState>(id: string, field: K, value: ProjectFormState[K]) {
    setDrafts((current) => {
      const draft = current[id];
      if (!draft) {
        return current;
      }
      return { ...current, [id]: { ...draft, [field]: value } };
    });
    setRowErrors((current) => ({ ...current, [id]: "" }));
  }

  // Función para iniciar la edición
  function startEdit(project: Project) {
    const next = createProjectFormStateFromProject(project);
    next.marca_panel = brandOrUnbranded(next.marca_panel);
    next.marca_bateria = brandOrUnbranded(next.marca_bateria);
    setDrafts((current) => ({ ...current, [project.id]: next }));
    setExpandedIds((current) => (current.includes(project.id) ? current : [...current, project.id]));
    setRowErrors((current) => ({ ...current, [project.id]: "" }));
  }

  // Función para cancelar la edición
  function cancelEdit(id: string) {
    setDrafts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setRowErrors((current) => ({ ...current, [id]: "" }));
  }

  // Función para guardar la edición. Solo escribe en la base de esta plataforma.
  async function saveEdit(project: Project) {
    const draft = drafts[project.id];
    if (!draft) {
      return;
    }
    if (!draft.nombre.trim()) {
      setRowErrors((current) => ({ ...current, [project.id]: "El nombre del proyecto es obligatorio." }));
      return;
    }
    setSavingIds((current) => ({ ...current, [project.id]: true }));
    setRowErrors((current) => ({ ...current, [project.id]: "" }));
    try {
      await onUpdate(project.id, { ...draft, insercion: project.insercion, portal_proyecto_id: project.portal_proyecto_id === null ? "" : String(project.portal_proyecto_id) });
      setDrafts((current) => {
        const next = { ...current };
        delete next[project.id];
        return next;
      });
    } catch (err) {
      setRowErrors((current) => ({ ...current, [project.id]: err instanceof Error ? err.message : "No se pudo guardar el proyecto." }));
    } finally {
      setSavingIds((current) => ({ ...current, [project.id]: false }));
    }
  }

  return (
    <section>
      <div className="data-scroll">
        <table className="data-table">
          {/* Encabezado de la tabla */}
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Ubicación</th>
              <th>Tipo</th>
              <th>Capacidad kWp</th>
              <th>Inversor</th>
              <th>Instalación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          {/* Cuerpo de la tabla */}
          <tbody>
            {/* Si hay proyectos, mostrarlos */}
            {projects.length > 0 ? (
              projects.map((project) => {
                const existing = project.insercion === "existente";
                const form = drafts[project.id] ?? null;
                const editing = form !== null;
                const expanded = expandedIds.includes(project.id);
                const saving = savingIds[project.id] === true;
                const rowError = rowErrors[project.id] ?? "";
                const rowClass = [existing ? "row-existing" : "", editing ? "row-editing" : ""].filter(Boolean).join(" ");
                return (
                  <Fragment key={project.id}>
                    {/* Fila de la tabla */}
                    <tr className={rowClass || undefined}>
                      {/* Columna de la tabla */}
                      <td>
                        {/* Contenedor de la columna */}
                        <div className="flex items-start gap-2">
                          {/* Botón para expandir la fila */}
                          <button
                            type="button"
                            className="mt-0.5 grid h-6 w-6 place-items-center rounded-full text-[var(--color-text-secondary)]"
                            aria-expanded={expanded}
                            aria-label={expanded ? `Ocultar detalle de ${project.nombre}` : `Ver detalle de ${project.nombre}`}
                            onClick={() => {
                              setExpandedIds((current) => (
                                current.includes(project.id) ? current.filter((id) => id !== project.id) : [...current, project.id]
                              ));
                            }}
                          >
                            <Chevron open={expanded} />
                          </button>
                          {/* Contenedor de la columna */}
                          <div className="min-w-[10rem]">
                            {/* Si hay formulario, mostrar el input */}
                            {form ? (
                              // Input editable
                              <input
                                className={editClass}
                                aria-label={`Nombre de ${project.nombre}`}
                                value={form.nombre}
                                onChange={(event) => updateDraft(project.id, "nombre", event.target.value)}
                              />
                            ) : (
                              <p className="font-semibold">{project.nombre}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        {/* Contenedor de la columna */}
                        {form ? (
                          <select className={editClass} aria-label={`Ubicación de ${project.nombre}`} value={form.ubicacion} onChange={(event) => updateDraft(project.id, "ubicacion", event.target.value)}>
                            <option value="">Selecciona</option>
                            {optionsIncludingValue(DEPARTMENT_OPTIONS, form.ubicacion).map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          project.ubicacion || "—"
                        )}
                      </td>
                      <td>
                        {/* Contenedor de la columna */}
                        {form ? (
                          <select className={editClass} aria-label={`Tipo de ${project.nombre}`} value={form.tipo_de_sistema} onChange={(event) => updateDraft(project.id, "tipo_de_sistema", event.target.value)}>
                            {optionsIncludingValue(SYSTEM_TYPE_OPTIONS, form.tipo_de_sistema).map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          project.tipo_de_sistema || "—"
                        )}
                      </td>
                      <td className="numeric">
                        {/* Contenedor de la columna */}
                        {form ? (
                          // Si hay formulario, mostrar el input
                          // Si el proyecto está bloqueado, mostrar el input bloqueado
                          <input
                            className={editClass}
                            inputMode="decimal"
                            aria-label={`Capacidad de ${project.nombre}`}
                            value={form.cap_instalada_kwp}
                            onChange={(event) => updateDraft(project.id, "cap_instalada_kwp", event.target.value)}
                          />
                        ) : (
                          project.cap_instalada_kwp === null ? "—" : formatNumber(project.cap_instalada_kwp, 2)
                        )}
                      </td>
                      <td>
                        {/* Contenedor de la columna */}
                        {form ? (
                          <select className={editClass} aria-label={`Inversor de ${project.nombre}`} value={catalogOption(INVERTER_BRAND_OPTIONS, form.marca_inversor)} onChange={(event) => updateDraft(project.id, "marca_inversor", event.target.value)}>
                            <option value="">Selecciona</option>
                            {optionsIncludingValue(INVERTER_BRAND_OPTIONS, form.marca_inversor).map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          project.marca_inversor || "—"
                        )}
                      </td>
                      <td>
                        {/* Contenedor de la columna */}
                        {form ? (
                          <input
                            className={editClass}
                            type="date"
                            aria-label={`Fecha de instalación de ${project.nombre}`}
                            value={form.fecha_instalacion}
                            onChange={(event) => updateDraft(project.id, "fecha_instalacion", event.target.value)}
                          />
                        ) : (
                          formatDayMonthYear(project.fecha_instalacion)
                        )}
                      </td>
                      <td>
                        {/* Contenedor de la columna */}
                        {form ? (
                          <select
                            className={editClass}
                            aria-label={`Estado de ${project.nombre}`}
                            value={form.estado}
                            onChange={(event) => updateDraft(project.id, "estado", event.target.value === "completado" ? "completado" : "en_ejecucion")}
                          >
                            <option value="en_ejecucion">En ejecución</option>
                            <option value="completado">Completado</option>
                          </select>
                        ) : (
                          <StatusPill completed={project.estado === "completado"} />
                        )}
                      </td>
                      <td>
                        {/* Contenedor de la columna */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {editing && form ? (
                            <>
                              <button type="button" className="btn-primary btn-compact" disabled={saving} onClick={() => void saveEdit(project)}>
                                {saving ? "Guardando…" : "Guardar"}
                              </button>
                              <button type="button" className="btn-secondary btn-compact" disabled={saving} onClick={() => cancelEdit(project.id)}>
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>

                              <button
                                type="button"
                                className="inline-flex h-8 items-center gap-1 rounded-full bg-[#f3f6fa] px-3 text-xs font-medium"
                                onClick={() => startEdit(project)}
                              >
                                <EditIcon />
                                Editar
                              </button>
                              {/* Botón para ver las métricas */}
                              <MetricsButton project={project} onUpdate={onUpdate} labeled />
                              {/* Botón para eliminar el proyecto */}
                              <Button2Delete label={`Eliminar ${project.nombre}`} labeled>
                                {(close) => (
                                  <DeleteProjectModal
                                    project={project}
                                    onDelete={async (id) => {
                                      await onDelete(id);
                                      close();
                                    }}
                                    onClose={close}
                                  />
                                )}
                              </Button2Delete>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Si la fila está expandida, mostrar los detalles */} 
                    {expanded ? (
                      // Fila de detalles
                      <tr className={existing ? "row-detail row-existing" : "row-detail"}>
                        <td colSpan={8}>
                          <dl className="grid gap-4 px-8 py-2 sm:grid-cols-2 lg:grid-cols-5">
                            {/* Detalle de la marca del panel */}
                            <DetailField label="Marca del panel">
                              {form ? (
                                <select className={editClass} aria-label={`Panel de ${project.nombre}`} value={catalogOption(PANEL_BRAND_OPTIONS, form.marca_panel)} onChange={(event) => updateDraft(project.id, "marca_panel", event.target.value)}>
                                  {optionsIncludingValue(PANEL_BRAND_OPTIONS, form.marca_panel).map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : (
                                displayBrand(project.marca_panel)
                              )}
                            </DetailField>
                            {/* Detalle de la marca de la batería */}
                            <DetailField label="Marca de batería">
                              {form ? (
                                <select className={editClass} aria-label={`Batería de ${project.nombre}`} value={catalogOption(BATTERY_BRAND_OPTIONS, form.marca_bateria)} onChange={(event) => updateDraft(project.id, "marca_bateria", event.target.value)}>
                                  {optionsIncludingValue(BATTERY_BRAND_OPTIONS, form.marca_bateria).map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : (
                                displayBrand(project.marca_bateria)
                              )}
                            </DetailField>
                            {/* Detalle de los paneles instalados */}
                            <DetailField label="Paneles instalados">
                              {form ? (
                                <input className={editClass} inputMode="numeric" aria-label={`Paneles de ${project.nombre}`} value={form.paneles_instalados} onChange={(event) => updateDraft(project.id, "paneles_instalados", event.target.value)} />
                              ) : (
                                project.paneles_instalados === null ? "—" : formatNumber(project.paneles_instalados, 0)
                              )}
                            </DetailField>
                            {/* Detalle de la fecha de creación */}
                            <DetailField label="Creado">{formatDayMonthYear(project.created_at)}</DetailField>
                            {/* Detalle de la fecha de actualización */}
                            <DetailField label="Actualizado">{formatDayMonthYear(project.updated_at)}</DetailField>
                          </dl>
                          {rowError && editing ? <p className="field-error px-8">{rowError}</p> : null}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-sm">
                  <p className="font-medium">No hay proyectos en esta vista.</p>
                  <p className="text-[var(--color-text-secondary)]">El filtro no encontró plantas.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-secondary)]">
        <span>Clic en la flecha para ver panel, batería, paneles instalados y fechas de registro.</span>
        <span>“—” = sin dato</span>
        <span>Mostrando {projects.length} de {total} proyectos</span>
      </footer>
    </section>
  );
}
