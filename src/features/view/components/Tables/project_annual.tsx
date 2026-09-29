"use client";

import { Button2Delete } from "@/features/view/components/Buttons/button2Delete";
import { Button2Edit } from "@/features/view/components/Buttons/button2Edit";
import { DeleteProjectModal } from "@/features/view/components/Modals/project_annual/DeleteProjectModal";
import { EditProjectModal } from "@/features/view/components/Modals/project_annual/EditProjectModal";
import { ExcelCell } from "@/features/view/refactor/ExcelCell";
import { createProjectFormStateFromProject } from "@/features/model/mapping/mapping_project";
import type { Project, ProjectFormState } from "@/lib/types/supabase/project-types";
import { PROJECT_ANNUAL_HEADERS } from "@/lib/utils/headers";
import { formatDate } from "@/lib/utils/helpers/render/format";
import { DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS, SYSTEM_TYPE_OPTIONS } from "@/lib/utils/options";
import { ProjectAnnualTableProps } from "@/lib/types/components/components";

export function ProjectAnnualTable({ projects, total, onUpdate, onDelete }: ProjectAnnualTableProps) {
  async function commit(project: Project, patch: Partial<ProjectFormState>) {
    await onUpdate(project.id, { ...createProjectFormStateFromProject(project), ...patch });
  }

  return (
    <section>
      <div className="overflow-x-auto">
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
              projects.map((project) => (
                <tr key={project.id}>
                  <td className="whitespace-nowrap font-medium">{project.nombre}</td>
                  <td>
                    <ExcelCell key={`${project.id}-ubi-${project.ubicacion}`} kind="editable" ariaLabel={`Ubicación de ${project.nombre}`} value={project.ubicacion} options={DEPARTMENT_OPTIONS} onCommit={(value) => commit(project, { ubicacion: value })} />
                  </td>
                  <td>
                    <ExcelCell kind="editable" ariaLabel={`Tipo de ${project.nombre}`} value={project.tipo_de_sistema} options={SYSTEM_TYPE_OPTIONS} onCommit={(value) => commit(project, { tipo_de_sistema: value })} />
                  </td>
                  <td>
                    <ExcelCell kind="editable" ariaLabel={`Potencia de ${project.nombre}`} value={project.pot_nominal_kw === null ? "" : String(project.pot_nominal_kw)} onCommit={(value) => commit(project, { pot_nominal_kw: value })} />
                  </td>
                  <td>
                    <ExcelCell kind="editable" ariaLabel={`Capacidad de ${project.nombre}`} value={project.cap_instalada_kwp === null ? "" : String(project.cap_instalada_kwp)} onCommit={(value) => commit(project, { cap_instalada_kwp: value })} />
                  </td>
                  <td>
                    <ExcelCell kind="editable" ariaLabel={`Fecha de ${project.nombre}`} value={formatDate(project.fecha_instalacion)} onCommit={(value) => commit(project, { fecha_instalacion: value })} />
                  </td>
                  <td>
                    <ExcelCell kind="editable" ariaLabel={`Inversor de ${project.nombre}`} value={project.marca_inversor} options={INVERTER_BRAND_OPTIONS} onCommit={(value) => commit(project, { marca_inversor: value })} />
                  </td>
                  <td>
                    <ExcelCell kind="editable" ariaLabel={`Paneles de ${project.nombre}`} value={String(project.paneles_instalados)} onCommit={(value) => commit(project, { paneles_instalados: value })} />
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <Button2Edit label={`Editar ${project.nombre}`}>
                        {(close) => (
                          <EditProjectModal
                            project={project}
                            onUpdate={async (form) => {
                              await onUpdate(project.id, form);
                              close();
                            }}
                            onClose={close}
                          />
                        )}
                      </Button2Edit>
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
              ))
            ) : (
              <tr>
                <td colSpan={PROJECT_ANNUAL_HEADERS.length + 1} className="px-3 py-8 text-sm">
                  <p className="font-medium">No hay proyectos en esta vista</p>
                  <p className="text-[var(--color-text-secondary)]">El filtro no encontró plantas o todavía no hay altas. Usa + Proyecto o limpia el filtro.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-secondary)]">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-cell-editable)" }} />
          Celda editable
        </span>
        <span>
          {projects.length} proyectos · {total} totales visibles
        </span>
        <span>Eliminar solo afecta al proyecto completo</span>
      </footer>
    </section>
  );
}
