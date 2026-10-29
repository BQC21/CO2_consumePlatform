"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
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
import { lockedClass, editClass } from "@/lib/utils/consts/design";

export function ProjectAnnualTable({ projects, total, onUpdate, onDelete, onEditingChange }: ProjectAnnualTableProps) {
  
  // Estados
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProjectFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [rowError, setRowError] = useState("");

  // Efecto para cambiar el estado de edición
  useEffect(() => {
    onEditingChange?.(editingId !== null);
  }, [editingId, onEditingChange]);

  // Función para actualizar el estado del formulario
  function updateDraft<K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
    setRowError("");
  }

  // Función para iniciar la edición
  function startEdit(project: Project) {
    const next = createProjectFormStateFromProject(project);
    next.marca_panel = brandOrUnbranded(next.marca_panel);
    next.marca_bateria = brandOrUnbranded(next.marca_bateria);
    setDraft(next);
    setEditingId(project.id);
    setExpandedId(project.id);
    setRowError("");
  }

  // Función para cancelar la edición
  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
    setRowError("");
  }

  // Función para guardar la edición  
  async function saveEdit(project: Project) {
    if (!draft) {
      return;
    }
    if (!draft.nombre.trim()) {
      setRowError("El nombre del proyecto es obligatorio.");
      return;
    }
    setSaving(true);
    setRowError("");
    try {
      await onUpdate(project.id, draft);
      setEditingId(null);
      setDraft(null);
    } catch (err) {
      setRowError(err instanceof Error ? err.message : "No se pudo guardar el proyecto.");
    } finally {
      setSaving(false);
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
                const locked = project.insercion === "existente";
                const editing = editingId === project.id && draft !== null;
                const expanded = expandedId === project.id;
                const form = editing ? draft : null;
                return (
                  <Fragment key={project.id}>
                    {/* Fila de la tabla */}
                    <tr className={editing ? "row-editing" : undefined}>
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
                              if (editing) {
                                return;
                              }
                              setExpandedId(expanded ? null : project.id);
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
                                className={locked ? lockedClass : editClass}
                                aria-label={`Nombre de ${project.nombre}`}
                                value={form.nombre}
                                disabled={locked}
                                onChange={(event) => updateDraft("nombre", event.target.value)}
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
                          // Si hay formulario, mostrar el input
                          // Si el proyecto está bloqueado, mostrar el input bloqueado
                          locked ? (
                            // Input bloqueado
                            <input className={lockedClass} value={form.ubicacion} disabled aria-label={`Ubicación de ${project.nombre}`} />
                          ) : (
                            // Select editable
                            <select className={editClass} aria-label={`Ubicación de ${project.nombre}`} value={form.ubicacion} onChange={(event) => updateDraft("ubicacion", event.target.value)}>
                              <option value="">Selecciona</option>
                              {DEPARTMENT_OPTIONS.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          )
                        ) : (
                          project.ubicacion || "—"
                        )}
                      </td>
                      <td>
                        {/* Contenedor de la columna */}
                        {form ? (
                          // Si hay formulario, mostrar el input
                          // Si el proyecto está bloqueado, mostrar el input bloqueado
                          locked ? (
                            <input className={lockedClass} value={form.tipo_de_sistema} disabled aria-label={`Tipo de ${project.nombre}`} />
                          ) : (
                            <select className={editClass} aria-label={`Tipo de ${project.nombre}`} value={form.tipo_de_sistema} onChange={(event) => updateDraft("tipo_de_sistema", event.target.value)}>
                              {SYSTEM_TYPE_OPTIONS.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          )
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
                            className={locked ? lockedClass : editClass}
                            inputMode="decimal"
                            aria-label={`Capacidad de ${project.nombre}`}
                            value={form.cap_instalada_kwp}
                            disabled={locked}
                            onChange={(event) => updateDraft("cap_instalada_kwp", event.target.value)}
                          />
                        ) : (
                          project.cap_instalada_kwp === null ? "—" : formatNumber(project.cap_instalada_kwp, 2)
                        )}
                      </td>
                      <td>
                        {/* Contenedor de la columna */}
                        {form ? (
                          // Si hay formulario, mostrar el input
                          // Si el proyecto está bloqueado, mostrar el input bloqueado
                          locked ? (
                            // Input bloqueado
                            <input className={lockedClass} value={form.marca_inversor} disabled aria-label={`Inversor de ${project.nombre}`} />
                          ) : (
                            // Select editable
                            <select className={editClass} aria-label={`Inversor de ${project.nombre}`} value={catalogOption(INVERTER_BRAND_OPTIONS, form.marca_inversor)} onChange={(event) => updateDraft("marca_inversor", event.target.value)}>
                              <option value="">Selecciona</option>
                              {optionsIncludingValue(INVERTER_BRAND_OPTIONS, form.marca_inversor).map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          )
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
                            onChange={(event) => updateDraft("fecha_instalacion", event.target.value)}
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
                            onChange={(event) => updateDraft("estado", event.target.value === "completado" ? "completado" : "en_ejecucion")}
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
                              <button type="button" className="btn-secondary btn-compact" disabled={saving} onClick={cancelEdit}>
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>

                              <button
                                type="button"
                                className="inline-flex h-8 items-center gap-1 rounded-full bg-[#f3f6fa] px-3 text-xs font-medium disabled:opacity-45"
                                disabled={editingId !== null}
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
                      <tr className="row-detail">
                        <td colSpan={8}>
                          <dl className="grid gap-4 px-8 py-2 sm:grid-cols-2 lg:grid-cols-5">
                            {/* Detalle de la marca del panel */}
                            <DetailField label="Marca del panel">
                              {form ? (
                                <select className={locked ? lockedClass : editClass} aria-label={`Panel de ${project.nombre}`} value={catalogOption(PANEL_BRAND_OPTIONS, form.marca_panel)} disabled={locked} onChange={(event) => updateDraft("marca_panel", event.target.value)}>
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
                                <select className={locked ? lockedClass : editClass} aria-label={`Batería de ${project.nombre}`} value={catalogOption(BATTERY_BRAND_OPTIONS, form.marca_bateria)} disabled={locked} onChange={(event) => updateDraft("marca_bateria", event.target.value)}>
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
                                <input className={locked ? lockedClass : editClass} inputMode="numeric" aria-label={`Paneles de ${project.nombre}`} value={form.paneles_instalados} disabled={locked} onChange={(event) => updateDraft("paneles_instalados", event.target.value)} />
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
