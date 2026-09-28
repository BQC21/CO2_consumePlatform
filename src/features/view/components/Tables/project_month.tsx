"use client";

import { Fragment, useState } from "react";
import { Button2Delete } from "@/features/view/components/Buttons/button2Delete";
import { Button2Edit } from "@/features/view/components/Buttons/button2Edit";
import { DeleteMonthModal } from "@/features/view/components/Modals/project_month/DeleteMonthModal";
import { EditMonthModal } from "@/features/view/components/Modals/project_month/EditMonthModal";
import { ExcelCell } from "@/features/view/refactor/ExcelCell";
import { createProjectMonthFormStateFromProjectMonth } from "@/features/model/mapping/mapping_project_month";
import type { Project, ProjectMonth, ProjectMonthFormState } from "@/lib/types/supabase/project-types";
import { computeMonthEnergy } from "@/lib/utils/helpers/computes/energy_total";
import { PROJECT_MONTH_HEADERS } from "@/lib/utils/headers";
import { formatMonthLabel, formatNumber } from "@/lib/utils/helpers/render/format";

type ProjectMonthTableProps = {
  projects: Project[];
  months: ProjectMonth[];
  onUpdate: (id: string, form: ProjectMonthFormState) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function ProjectMonthTable({ projects, months, onUpdate, onDelete }: ProjectMonthTableProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const visibleRows = months.filter((month) => projects.some((project) => project.id === month.proyecto_id));

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
                const isCollapsed = collapsed[project.id];
                return (
                  <Fragment key={project.id}>
                    <tr className="excel-group">
                      <td colSpan={PROJECT_MONTH_HEADERS.length + 1}>
                        <button
                          type="button"
                          className="text-left"
                          aria-expanded={!isCollapsed}
                          onClick={() => setCollapsed((current) => ({ ...current, [project.id]: !current[project.id] }))}
                        >
                          {isCollapsed ? "▸" : "▾"} {project.nombre}
                          <span className="ml-2 font-normal text-[var(--color-text-secondary)]">{rows.length} meses</span>
                        </button>
                      </td>
                    </tr>
                    {isCollapsed
                      ? null
                      : rows.map((month) => {
                          const energy = computeMonthEnergy(month.tipico_diario, month.mes);
                          return (
                            <tr key={month.id}>
                              <td className="pl-6">{formatMonthLabel(month.mes)}</td>
                              <td>
                                <ExcelCell
                                  key={`${month.id}-tipico-${month.tipico_diario}`}
                                  kind="editable"
                                  ariaLabel={`Típico diario de ${project.nombre} ${month.mes}`}
                                  value={String(month.tipico_diario)}
                                  onCommit={(value) => onUpdate(month.id, { ...createProjectMonthFormStateFromProjectMonth(month), tipico_diario: value })}
                                />
                              </td>
                              <td>
                                <ExcelCell
                                  key={`${month.id}-pot-${month.pot_nominal_kw}`}
                                  kind="editable"
                                  ariaLabel={`Potencia de ${project.nombre} ${month.mes}`}
                                  value={month.pot_nominal_kw === null ? "" : String(month.pot_nominal_kw)}
                                  onCommit={(value) => onUpdate(month.id, { ...createProjectMonthFormStateFromProjectMonth(month), pot_nominal_kw: value })}
                                />
                              </td>
                              <td>
                                <span className="excel-cell excel-calculated">{formatNumber(energy.co2Kg, 1)}</span>
                              </td>
                              <td>
                                <span className="excel-cell excel-calculated">{formatNumber(energy.arboles, 1)}</span>
                              </td>
                              <td>
                                <span className="excel-cell excel-calculated">{formatNumber(energy.carbonKg, 1)}</span>
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
          {projects.length} proyectos · {visibleRows.length} filas visibles
        </span>
      </footer>
    </section>
  );
}
