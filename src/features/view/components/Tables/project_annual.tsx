"use client";

import { useMemo } from "react";
import { Button2Delete } from "@/features/view/components/Buttons/button2Delete";
import { DeleteProjectModal } from "@/features/view/components/Modals/project_annual/DeleteProjectModal";
import { ExcelCell } from "@/features/view/refactor/ExcelCell";
import { createProjectFormStateFromProject } from "@/features/model/mapping/mapping_project";
import type { Project, ProjectFormState } from "@/lib/types/supabase/project-types";
import { PROJECT_ANNUAL_HEADERS } from "@/lib/utils/headers";
import { totalsByProject } from "@/lib/utils/helpers/computes/project_series";
import { formatDate, formatNumber } from "@/lib/utils/helpers/render/format";
import { DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS, SYSTEM_TYPE_OPTIONS } from "@/lib/utils/options";
import { ProjectAnnualTableProps } from "@/lib/types/components/components";
import { MetricsButton } from "../Buttons/MetricsButton";
import { ProjectImageCell } from "../Form_fields/fields";

export function ProjectAnnualTable({ projects, months, total, onUpdate, onDelete, onReplaceImage }: ProjectAnnualTableProps) {
  const totals = useMemo(() => totalsByProject(months), [months]);

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
                const energy = totals.get(project.id);
                return (
                  <tr key={project.id}>
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
                        kind="editable"
                        ariaLabel={`Fecha de ${project.nombre}`}
                        value={formatDate(project.fecha_instalacion)}
                        onCommit={(value) => commit(project, { fecha_instalacion: value })}
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
                      <ExcelCell kind="calculated" ariaLabel={`Rendimiento FV total de ${project.nombre}`} value={formatNumber(energy?.fv ?? 0, 1)} />
                    </td>
                    <td>
                      <ExcelCell kind="calculated" ariaLabel={`Rendimiento grid total de ${project.nombre}`} value={formatNumber(energy?.grid ?? 0, 1)} />
                    </td>
                    <td>
                      <ExcelCell kind="calculated" ariaLabel={`Carga consumida total de ${project.nombre}`} value={formatNumber(energy?.carga ?? 0, 1)} />
                    </td>
                    <td>
                      <ExcelCell kind="calculated" ariaLabel={`Reducción de CO2 de ${project.nombre}`} value={formatNumber(project.reduccion_co2, 1)} />
                    </td>
                    <td>
                      <ExcelCell kind="calculated" ariaLabel={`Reducción de carbón de ${project.nombre}`} 
                                value={formatNumber(project.reduccion_carbon, 1)} />
                    </td>
                    <td>
                      <ExcelCell kind="calculated" ariaLabel={`Árboles de ${project.nombre}`} 
                                value={formatNumber(project.arboles, 1)} />
                    </td>
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
                      <ProjectImageCell project={project} onReplace={onReplaceImage} />
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <MetricsButton project={project} months={months} />
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
          <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#d7ebf8" }} />
          Celda fija
          <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-cell-calculated)" }} />
          Celda calculada
        </span>
        <span>
          {projects.length} de {total} proyectos
        </span>
      </footer>
    </section>
  );
}
