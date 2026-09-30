"use client";

import { useMemo, useState } from "react";
import { Button2Add } from "@/features/view/components/Buttons/button2Add";
import { SearchBar } from "@/features/view/components/Bars/SearchBar";
import { ProjectFiltersBar } from "@/features/view/components/Filters/ProjectFiltersBar";
import { MassiveCleanModal } from "@/features/view/components/MassiveModals/MassiveCleanModal";
import { MassiveDownloadModal } from "@/features/view/components/MassiveModals/MassiveDownloadModal";
import { MassiveUploadModal } from "@/features/view/components/MassiveModals/MassiveUploadModal";
import { AddMonthModal } from "@/features/view/components/Modals/project_month/AddMonthModal";
import { AddProjectModal } from "@/features/view/components/Modals/project_annual/AddProjectModal";
import { ExcelWorkbook } from "@/features/view/components/Shells/ExcelWorkbook";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { ProjectSorter } from "@/features/view/components/Sorter/ProjectSorter";
import { ProjectAnnualTable } from "@/features/view/components/Tables/project_annual";
import { ProjectMonthTable } from "@/features/view/components/Tables/project_month";
import { useProjectMonthMutations, useRealtimeProjectMonth } from "@/features/ViewModel/hooks/services/useRealtimeProjectMonth";
import { useProjectMutations, useRealtimeProject } from "@/features/ViewModel/hooks/services/useRealtimeProject";
import { filterMonthsByProjects, filterProjects } from "@/lib/utils/helpers/filters/filterProjects";
import { transformAnnualRow, transformMonthRow, valueByHeader } from "@/lib/utils/helpers/massive/parseWorkbook";
import { formatDate } from "@/lib/utils/helpers/render/format";
import { sortProjects } from "@/lib/utils/helpers/sorting/sortProjects";
import { MONTH_HEADERS, PROJECT_ANNUAL_HEADERS } from "@/lib/utils/headers";
import { ProjectSortingOrder } from "@/lib/types/components/options";
import { ProjectMonthFormState } from "@/lib/types/supabase/projectMonth-types";
import { Button2MassiveClean, Button2MassiveDownload, Button2MassiveUpload } from "@/features/view/components/Buttons/button2Massive";
import { ProjectFormState } from "@/lib/types/supabase/project-types";

export default function ProjectPage() {

  // ------------------------
  // ------- estados --------
  // ------------------------

  // obtener informacion
  const projectsState = useRealtimeProject();
  const monthsState = useRealtimeProjectMonth();
  
  // mutaciones en las tablas
  const projectMutations = useProjectMutations();
  const monthMutations = useProjectMonthMutations();
  
  const [search, setSearch] = useState(""); // busqueda
  const [ubicacion, setUbicacion] = useState(""); // ubicacion
  const [marcaInversor, setMarcaInversor] = useState(""); // marcaInversor
  const [sorting, setSorting] = useState<ProjectSortingOrder>("fecha_desc"); // ordenamiento

  // mensaje de error
  const error = projectsState.error || monthsState.error || projectMutations.error || monthMutations.error;

  // ------------------------
  // ------- filtrado --------
  // ------------------------

  // filtrado de proyectos
  const filtered = useMemo(
    () => sortProjects(filterProjects(projectsState.items, { search, ubicacion, marcaInversor }), sorting),
    [projectsState.items, search, ubicacion, marcaInversor, sorting],);
  // meses visibles
  const visibleMonths = useMemo(() => filterMonthsByProjects(monthsState.items, filtered), [monthsState.items, filtered]);

  // ------------------------
  // ------- funciones ------
  // ------------------------

  // refrescar estados
  async function refresh() {
    await projectsState.refetch();
    await monthsState.refetch();
  }

  // importar plantilla para la tabla anual (SUBIDA MASIVA)
  async function importAnnual(rows: Record<string, string>[]) {
    const forms: ProjectFormState[] = rows.map((row, index) => {
      transformAnnualRow(row, index);
      const estado = valueByHeader(row, "Estado").toLowerCase();
      return {
        nombre: valueByHeader(row, "PROYECTO / MES"),
        ubicacion: valueByHeader(row, "UBICACIÓN"),
        distrito: valueByHeader(row, "Distrito"),
        tipo_de_sistema: valueByHeader(row, "TIPO DE SISTEMA") || "Híbrido",
        pot_nominal_kw: valueByHeader(row, "POT. NOMINAL (kW)"),
        cap_instalada_kwp: valueByHeader(row, "CAP. INSTALADA (kWp)"),
        fecha_instalacion: valueByHeader(row, "FECHA INSTALACIÓN"),
        marca_inversor: valueByHeader(row, "Marca del inversor"),
        paneles_instalados: valueByHeader(row, "Paneles instalados"),
        estado: estado.includes("complet") ? "completado" : "en_ejecucion",
        descripcion: valueByHeader(row, "Descripción"),
      };
    });
    await projectMutations.createMany(forms);
    await refresh();
  }

  // importar plantilla para la tabla mensual (SUBIDA MASIVA)
  async function importMonths(rows: Record<string, string>[]) {
    const forms: ProjectMonthFormState[] = rows.map((row, index) => {
      transformMonthRow(row, index);
      const nombre = valueByHeader(row, "Proyecto") || valueByHeader(row, "PROYECTO / MES");
      const project = projectsState.items.find((item) => item.nombre.trim().toLowerCase() === nombre.trim().toLowerCase());
      if (!project) {
        throw new Error(`La fila ${index + 2} nombra una planta que no está en los registros anuales.`);
      }
      return {
        proyecto_id: project.id,
        mes: valueByHeader(row, "Mes"),
        tipico_diario: valueByHeader(row, "TÍPICO DIARIO"),
        pot_nominal_kw: valueByHeader(row, "POT. NOMINAL (kW)"),
        reduccion_co2: valueByHeader(row, "CO2 REDUCIDO (KG)"),
        reduccion_carbon: valueByHeader(row, "CARBÓN REDUCIDO (KG)"),
        arboles: valueByHeader(row, "ÁRBOLES EQUIVALENTES"),
      };
    });
    await monthMutations.createMany(forms);
    await refresh();
  }

  return (
    <PortalShell
      title="Lista de proyectos"
      subtitle="Registra, edita o elimina proyectos. Los meses se despliegan bajo cada proyecto y los totales siguen visibles."
      activePath="/project"
      actions={
        <Button2Add label="Proyecto">
          {(close) => (
            <AddProjectModal
              onAdd={async (form) => {
                await projectMutations.create(form);
                await refresh();
                close();
              }}
              onClose={close}
            />
          )}
        </Button2Add>
      }
    >
      {error ? (
        <div className="panel mb-4 p-4">
          <p className="font-medium">No se pudo sincronizar la lista</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{error}</p>
          <button type="button" className="btn-secondary mt-3" onClick={() => void refresh()}>
            Reintentar
          </button>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-3">

        <SearchBar value={search} onChange={setSearch} placeholder="        Buscar por planta, distrito o descripción" />
        <ProjectFiltersBar ubicacion={ubicacion} marcaInversor={marcaInversor} 
                          onUbicacion={setUbicacion} onMarca={setMarcaInversor} />
        <ProjectSorter value={sorting} onChange={setSorting} />

      </div>
      
      {projectsState.loading ? (
        <div className="skeleton h-64 rounded-[var(--radius-lg)]" />
      ) : (
        <ExcelWorkbook
          layout="split"
          sheets={[
            {
              id: "annual",
              label: "Registros anuales",
              content: (
                <>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Button2MassiveUpload label="Importar">
                      {(close) => (
                        <MassiveUploadModal
                          title="Importar registros anuales"
                          description="La primera fila debe traer las columnas de la plantilla. Un texto en una columna numérica rechaza el archivo."
                          expectedHeaders={PROJECT_ANNUAL_HEADERS}
                          onRows={async (rows) => {
                            await importAnnual(rows);
                            close();
                          }}
                          onClose={close}
                        />
                      )}
                    </Button2MassiveUpload>
                    <Button2MassiveDownload label="Exportar">
                      {(close) => (
                        <MassiveDownloadModal
                          title="Exportar registros anuales"
                          filename="proyectos-anuales.xlsx"
                          headers={[...PROJECT_ANNUAL_HEADERS]}
                          rows={filtered.map((project) => [
                            project.nombre,
                            project.ubicacion,
                            project.tipo_de_sistema,
                            project.pot_nominal_kw === null ? "" : String(project.pot_nominal_kw),
                            project.cap_instalada_kwp === null ? "" : String(project.cap_instalada_kwp),
                            formatDate(project.fecha_instalacion),
                            project.marca_inversor,
                            String(project.paneles_instalados),
                          ])}
                          onClose={close}
                        />
                      )}
                    </Button2MassiveDownload>
                    <Button2MassiveClean label="Limpiar">
                      {(close) => (
                        <MassiveCleanModal
                          title="Limpiar proyectos"
                          description="Se vaciará la lista de proyectos y, con ella, los registros mensuales de cada planta."
                          onClean={async () => {
                            await projectMutations.removeAll();
                            await refresh();
                            close();
                          }}
                          onClose={close}
                        />
                      )}
                    </Button2MassiveClean>
                  </div>
                  <ProjectAnnualTable
                    projects={filtered}
                    total={projectsState.items.length}
                    onUpdate={async (id, form) => {
                      await projectMutations.update(id, form);
                      await refresh();
                    }}
                    onDelete={async (id) => {
                      await projectMutations.remove(id);
                      await refresh();
                    }}
                  />
                </>
              ),
            },
            {
              id: "month",
              label: "Registros mensuales",
              content: (
                <>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Button2Add label="Mes">
                      {(close) => (
                        <AddMonthModal
                          projects={filtered}
                          onAdd={async (form) => {
                            await monthMutations.create(form);
                            await refresh();
                            close();
                          }}
                          onClose={close}
                        />
                      )}
                    </Button2Add>
                    <Button2MassiveUpload label="Importar">
                      {(close) => (
                        <MassiveUploadModal
                          title="Importar registros mensuales"
                          description="Columnas: Proyecto, Mes, Típico diario y Pot. nominal. El CO2, los árboles y el carbón se calculan."
                          expectedHeaders={MONTH_HEADERS}
                          onRows={async (rows) => {
                            await importMonths(rows);
                            close();
                          }}
                          onClose={close}
                        />
                      )}
                    </Button2MassiveUpload>
                    <Button2MassiveDownload label="Exportar">
                      {(close) => (
                        <MassiveDownloadModal
                          title="Exportar registros mensuales"
                          filename="proyectos-mensuales.xlsx"
                          headers={[...MONTH_HEADERS]}
                          rows={visibleMonths.map((month) => {
                            const project = projectsState.items.find((item) => item.id === month.proyecto_id);
                            return [project?.nombre ?? "", month.mes, String(month.tipico_diario), month.pot_nominal_kw === null ? "" : String(month.pot_nominal_kw)];
                          })}
                          onClose={close}
                        />
                      )}
                    </Button2MassiveDownload>
                    <Button2MassiveClean label="Limpiar">
                      {(close) => (
                        <MassiveCleanModal
                          title="Limpiar meses"
                          description="Se vaciarán los registros mensuales. Los proyectos anuales se mantienen."
                          onClean={async () => {
                            await monthMutations.removeAll();
                            await refresh();
                            close();
                          }}
                          onClose={close}
                        />
                      )}
                    </Button2MassiveClean>
                  </div>
                  <ProjectMonthTable
                    projects={filtered}
                    months={visibleMonths}
                    onUpdate={async (id, form) => {
                      await monthMutations.update(id, form);
                      await refresh();
                    }}
                    onDelete={async (id) => {
                      await monthMutations.remove(id);
                      await refresh();
                    }}
                  />
                </>
              ),
            },
          ]}
        />
      )}
    </PortalShell>
  );
}
