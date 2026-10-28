"use client";

import { Button2Delete, MetricsButton } from "@/features/view/components/Buttons/buttons";
import { DeleteProjectModal } from "@/features/view/components/Modals/project_annual/DeleteProjectModal";
import { ExcelCell } from "@/features/view/components/Shells/ExcelCell";
import { createProjectFormStateFromProject } from "@/features/model/mapping/mapping_project";
import type { Project, ProjectFormState } from "@/lib/types/supabase/project-types";
import { PROJECT_ANNUAL_HEADERS } from "@/lib/utils/headers";
import { isOlderThanDays } from "@/lib/utils/helpers/render/format";
import { BATTERY_BRAND_OPTIONS, DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS, PANEL_BRAND_OPTIONS, SYSTEM_TYPE_OPTIONS } from "@/lib/utils/options";
import { brandOrUnbranded } from "@/lib/utils/helpers/options";
import { ProjectAnnualTableProps } from "@/lib/types/components/components";
import { formatDate } from "@/lib/utils/helpers/normalization";

export function ProjectAnnualTable({ projects, total, onUpdate, onDelete }: ProjectAnnualTableProps) {

  async function commit(project: Project, patch: Partial<ProjectFormState>) {
    await onUpdate(project.id, { ...createProjectFormStateFromProject(project), ...patch });
  }

  return (
    <section>
      <div className="excel-scroll">
        <table className="excel-table">
          <thead>
            <tr>
              {PROJECT_ANNUAL_HEADERS.map((header) => (
                <th key={header}>{header}</th>
              ))}
              <th className="sr-only">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => {
                const locked = project.insercion === "existente";
                const stale = isOlderThanDays(project.updated_at, 30);
                return (
                  <tr
                    key={project.id}
                    className={stale ? "row-stale" : undefined}
                    title={stale ? "La fecha de actualización supera 30 días" : undefined}
                  >
                    <td className="whitespace-nowrap font-medium">
                      <ExcelCell
                        kind={locked ? "locked" : "editable"}
                        ariaLabel={`Nombre de ${project.nombre}`}
                        value={project.nombre}
                        onCommit={locked ? undefined : (value) => commit(project, { nombre: value })}
                      />
                    </td>
                    
                    <td>
                      <ExcelCell
                        kind="date"
                        ariaLabel={`Fecha de creación para ${project.nombre}`}
                        value={formatDate(project.created_at)}
                        onCommit={(value) => commit(project, { created_at: value })}
                      />
                    </td>
                    <td>
                      <ExcelCell
                        kind="date"
                        ariaLabel={`Fecha de actualización para ${project.nombre}`}
                        value={formatDate(project.updated_at)}
                        onCommit={(value) => commit(project, { updated_at: value })}
                      />
                    </td>
                    <td>
                      <ExcelCell
                        kind="date"
                        ariaLabel={`Fecha de ${project.nombre}`}
                        value={formatDate(project.fecha_instalacion)}
                        onCommit={(value) => commit(project, { fecha_instalacion: value })}
                      />
                    </td>

                    <td>
                      <ExcelCell
                        kind={locked ? "locked" : "editable"}
                        ariaLabel={`Ubicación de ${project.nombre}`}
                        value={project.ubicacion}
                        options={DEPARTMENT_OPTIONS}
                        onCommit={locked ? undefined : (value) => commit(project, { ubicacion: value })}
                      />
                    </td>
                    <td>
                      <ExcelCell
                        kind={locked ? "locked" : "editable"}
                        ariaLabel={`Tipo de ${project.nombre}`}
                        value={project.tipo_de_sistema}
                        options={SYSTEM_TYPE_OPTIONS}
                        onCommit={locked ? undefined : (value) => commit(project, { tipo_de_sistema: value })}
                      />
                    </td>
                    <td>
                      <ExcelCell
                        kind={locked ? "locked" : "editable"}
                        ariaLabel={`Capacidad de ${project.nombre}`}
                        value={project.cap_instalada_kwp === null ? "" : String(project.cap_instalada_kwp)}
                        onCommit={locked ? undefined : (value) => commit(project, { cap_instalada_kwp: value })}
                      />
                    </td>
                    <td>
                      <ExcelCell
                        kind={locked ? "locked" : "editable"}
                        ariaLabel={`Inversor de ${project.nombre}`}
                        value={project.marca_inversor}
                        options={INVERTER_BRAND_OPTIONS}
                        onCommit={locked ? undefined : (value) => commit(project, { marca_inversor: value })}
                      />
                    </td>
                    <td>
                      <ExcelCell
                        kind={locked ? "locked" : "editable"}
                        ariaLabel={`Panel de ${project.nombre}`}
                        value={brandOrUnbranded(project.marca_panel)}
                        options={locked ? undefined : PANEL_BRAND_OPTIONS}
                        onCommit={locked ? undefined : (value) => commit(project, { marca_panel: value })}
                      />
                    </td>
                    <td>
                      <ExcelCell
                        kind={locked ? "locked" : "editable"}
                        ariaLabel={`Batería de ${project.nombre}`}
                        value={brandOrUnbranded(project.marca_bateria)}
                        options={locked ? undefined : BATTERY_BRAND_OPTIONS}
                        onCommit={locked ? undefined : (value) => commit(project, { marca_bateria: value })}
                      />
                    </td>
                    {/* <td>
                      <ExcelCell
                        kind={locked ? "locked" : "editable"}
                        ariaLabel={`Número de paneles para ${project.nombre}`}
                        value={String(project.paneles_instalados)}
                        onCommit={locked ? undefined : (value) => commit(project, { paneles_instalados: value })}
                      />
                    </td> */}


                    <td>
                      <ExcelCell
                        kind="editable"
                        ariaLabel={`Estado de ${project.nombre}`}
                        value={project.estado === "completado" ? "Completado" : "En ejecución"}
                        options={["En ejecución", "Completado"]}
                        onCommit={(value) => commit(project, { estado: value.toLowerCase().includes("complet") ? "completado" : "en_ejecucion" })}
                      />
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <MetricsButton project={project} onUpdate={onUpdate} />
                        <Button2Delete label={`Eliminar ${project.nombre}`}>
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
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={PROJECT_ANNUAL_HEADERS.length + 1} className="px-3 py-8 text-sm">
                  <p className="font-medium">No hay proyectos en esta vista</p>
                  <p className="text-[var(--color-text-secondary)]">El filtro no encontró plantas o todavía no hay altas.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-secondary)]">
        <span className="inline-flex flex-wrap items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-cell-editable)" }} />
          Celda editable
          <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: "color-mix(in srgb, var(--color-info) 18%, white)" }} />
          Fecha
          <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-cell-select)" }} />
          Celda con selector
          <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#d7ebf8" }} />
          Celda fija
          <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#f6e2c4" }} />
          Actualización con más de 30 días
        </span>
        <span>
          {projects.length} de {total} proyectos
        </span>
      </footer>
    </section>
  );
}
