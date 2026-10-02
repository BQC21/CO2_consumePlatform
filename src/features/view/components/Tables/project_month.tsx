"use client";

import { Fragment, useState } from "react";
import { Button2Delete } from "@/features/view/components/Buttons/button2Delete";
import { Button2Edit } from "@/features/view/components/Buttons/button2Edit";
import { DeleteMonthModal } from "@/features/view/components/Modals/project_month/DeleteMonthModal";
import { EditMonthModal } from "@/features/view/components/Modals/project_month/EditMonthModal";
import { ExcelCell } from "@/features/view/refactor/ExcelCell";
import { createProjectMonthFormStateFromProjectMonth } from "@/features/model/mapping/mapping_project_month";
import { PROJECT_MONTH_HEADERS } from "@/lib/utils/headers";
import { formatMonthLabel, formatNumber } from "@/lib/utils/helpers/render/format";
import { ProjectMonthTableProps } from "@/lib/types/components/components";

export function ProjectMonthTable({ projects, months, onUpdate, onDelete }: ProjectMonthTableProps) {

  return (
    <section>
      <div className="overflow-x-auto">
        <table className="excel-table">
          <thead>
            <tr>
              {PROJECT_MONTH_HEADERS.map((header) => (
                <th key={header}>{header}</th>
              ))}
              <th className="sr-only">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={PROJECT_MONTH_HEADERS.length + 1} className="px-3 py-8 text-sm">
                  <p className="font-medium">No hay proyectos en esta vista</p>
                  <p className="text-[var(--color-text-secondary)]">Cuando exista una planta anual, aquí se despliegan sus meses.</p>
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const rows = months
                  .filter((month) => month.proyecto_id === project.id)
                  .sort((left, right) => right.mes.localeCompare(left.mes));
                return (
                  <Fragment key={project.id}>
                    <tr className="excel-group">
                      <td colSpan={PROJECT_MONTH_HEADERS.length + 1}>
                      </td>
                    </tr>
                    {rows.map((month) => {
                          return (
                            <tr key={month.id}>
                              <td className="pl-6">{formatMonthLabel(month.mes)}</td>
                              <td>
                                <ExcelCell
                                  key={`${month.id}-tipico-${month.rendimiento_fv}`}
                                  kind="editable"
                                  ariaLabel={`Típico diario de ${project.nombre} ${month.mes}`}
                                  value={String(month.rendimiento_fv)}
                                  onCommit={(value) => onUpdate(month.id, { ...createProjectMonthFormStateFromProjectMonth(month), rendimiento_fv: value })}
                                />
                              </td>
                              <td>
                                <ExcelCell
                                  key={`${month.id}-pot-${month.rendimiento_grid}`}
                                  kind="editable"
                                  ariaLabel={`Potencia de ${project.nombre} ${month.mes}`}
                                  value={month.rendimiento_grid === null ? "" : String(month.rendimiento_grid)}
                                  onCommit={(value) => onUpdate(month.id, { ...createProjectMonthFormStateFromProjectMonth(month), rendimiento_grid: value })}
                                />
                              </td>
                              <td>
                                <ExcelCell
                                  key={`${month.id}-pot-${month.consumo_carga}`}
                                  kind="editable"
                                  ariaLabel={`Carga consumida de ${project.nombre} ${month.mes}`}
                                  value={month.consumo_carga === null ? "" : String(month.consumo_carga)}
                                  onCommit={(value) => onUpdate(month.id, { ...createProjectMonthFormStateFromProjectMonth(month), consumo_carga: value })}
                                />
                              </td>

                              <td>
                                <div className="flex gap-1">
                                  <Button2Edit label={`Editar ${formatMonthLabel(month.mes)}`}>
                                    {(close) => (
                                      <EditMonthModal
                                        month={month}
                                        projects={projects}
                                        onUpdate={async (form) => {
                                          await onUpdate(month.id, form);
                                          close();
                                        }}
                                        onClose={close}
                                      />
                                    )}
                                  </Button2Edit>
                                  <Button2Delete label={`Eliminar ${formatMonthLabel(month.mes)}`}>
                                    {(close) => (
                                      <DeleteMonthModal
                                        month={month}
                                        projectName={project.nombre}
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
                        })}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-secondary)]">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-cell-editable)" }} />
          Celda editable
          <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-cell-calculated)" }} />
          Celda calculada
        </span>
        <span>
          {projects.length} proyectos
        </span>
      </footer>
    </section>
  );
}
