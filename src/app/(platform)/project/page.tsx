"use client";

import { useMemo, useState } from "react";
import { Button2Add } from "@/features/view/components/Buttons/button2Add";
import { SearchBar } from "@/features/view/components/Metrics/SearchBar";
import { ProjectFiltersBar } from "@/features/view/components/Filters/ProjectFiltersBar";
import { MassiveCleanModal } from "@/features/view/components/MassiveModals/MassiveCleanModal";
import { MassiveDownloadModal } from "@/features/view/components/MassiveModals/MassiveDownloadModal";
import { MassiveUploadModal } from "@/features/view/components/MassiveModals/MassiveUploadModal";
import { AddProjectModal } from "@/features/view/components/Modals/project_annual/AddProjectModal";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { ProjectSorter } from "@/features/view/components/Sorter/ProjectSorter";
import { ProjectAnnualTable } from "@/features/view/components/Tables/project_annual";
import { createProject } from "@/features/model/services/projectQueries";
import { replaceMonthlyRecords } from "@/features/model/services/monthlyRecordQueries";
import { useProjectMutations, useRealtimeProject } from "@/features/ViewModel/hooks/services/useRealtimeProject";
import { filterProjects } from "@/lib/utils/helpers/filters/filterProjects";
import { sortProjects } from "@/lib/utils/helpers/sorting/sortProjects";
import { PROJECT_ANNUAL_HEADERS } from "@/lib/utils/headers";
import { ImportedProjectBlock } from "@/lib/types/components/components";
import { ProjectSortingOrder } from "@/lib/types/components/options";
import { Button2MassiveClean, Button2MassiveDownload, Button2MassiveUpload } from "@/features/view/components/Buttons/button2Massive";
import { ProjectFormState } from "@/lib/types/supabase/project-types";
import { formatDate } from "@/lib/utils/helpers/normalization";
import { monthlyTotals } from "@/lib/utils/helpers/render/monthTable";

export default function ProjectPage() {

  const projectsState = useRealtimeProject();
  const projectMutations = useProjectMutations();
  // -------------------------------
  // Estados de filtrado y sorting
  // -------------------------------

  const [search, setSearch] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [marcaInversor, setMarcaInversor] = useState("");
  const [marcaPanel, setMarcaPanel] = useState("");
  const [marcaBateria, setMarcaBateria] = useState("");
  const [sorting, setSorting] = useState<ProjectSortingOrder>("fecha_desc");

  // -------------------------------
  // --- Almacenamiento ------------
  // -------------------------------

  const filtered = useMemo(
    () => sortProjects(filterProjects(projectsState.items, { search, ubicacion, marcaInversor, marcaPanel, marcaBateria }), sorting),
    [projectsState.items, search, ubicacion, marcaInversor, marcaPanel, marcaBateria, sorting]);

  // ----------------------------------
  // --- Refrescar estados ------------
  // ----------------------------------

  async function refresh() {
    await projectsState.refetch();
  }

  // --------------------------------------------
  // --- Template para subida masiva ------------
  // --------------------------------------------

  // Separación de bloques
  function formFromBlock(block: ImportedProjectBlock): ProjectFormState {
    const totals = block.months.length > 0
      ? monthlyTotals(block.months)
      : {
          rendimiento_fv_total: block.rendimiento_fv_total,
          rendimiento_grid_total: block.rendimiento_grid_total,
          carga_consumida_total: block.carga_consumida_total,
        };
    return {
      nombre: block.nombre,
      ubicacion: "",
      distrito: "",
      tipo_de_sistema: block.tipo_de_sistema,
      pot_nominal_kw: block.pot_nominal_kw,
      cap_instalada_kwp: block.cap_instalada_kwp,
      fecha_instalacion: block.fecha_instalacion,
      marca_inversor: "",
      marca_panel: "",
      marca_bateria: "",
      paneles_instalados: "",
      rendimiento_fv_total: totals.rendimiento_fv_total,
      rendimiento_grid_total: totals.rendimiento_grid_total,
      carga_consumida_total: totals.carga_consumida_total,
      reduccion_co2: block.reduccion_co2,
      reduccion_carbon: block.reduccion_carbon,
      arboles: block.arboles,
      estado: "en_ejecucion",
      descripcion: "",
      insercion: "independiente",
      portal_proyecto_id: "",
      created_at: "",
      updated_at: "",
    };
  }

  // Importación per se. Los meses y el impacto quedan en la tabla del modal de métricas.
  async function importAnnual(blocks: ImportedProjectBlock[]) {
    for (const block of blocks) {
      const created = await createProject(formFromBlock(block));
      if (!created.id) {
        throw new Error(`No se pudo crear el proyecto ${block.nombre}.`);
      }
      await replaceMonthlyRecords(created.id, block.months);
    }
    await refresh();
  }

  return (
    <PortalShell
      title="Lista de proyectos"
      subtitle="Registra, edita o elimina proyectos. Las celdas verdes se calculan y las azules llegan de otra base."
      activePath="/project"
      actions={
        <Button2Add label="Proyecto">
          {(close) => (
            <AddProjectModal
              onAdd={async (form, image) => {
                const created = await projectMutations.create(form);
                if (image) {
                  await projectMutations.saveImage(created.id, image);
                }
                await refresh();
                close();
              }}
              onClose={close}
            />
          )}
        </Button2Add>
      }
    >

      {/* 1ra fila */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="     Buscar por planta, distrito o descripción" />
        <ProjectFiltersBar
          ubicacion={ubicacion}
          marcaInversor={marcaInversor}
          marcaPanel={marcaPanel}
          marcaBateria={marcaBateria}
          onUbicacion={setUbicacion}
          onMarca={setMarcaInversor}
          onMarcaPanel={setMarcaPanel}
          onMarcaBateria={setMarcaBateria}
        />
        <ProjectSorter value={sorting} onChange={setSorting} />
      </div>

      {/* Tabla de proyectos */}
      {projectsState.loading ? (
        <div className="skeleton h-64 rounded-[var(--radius-lg)]" />
      ) : (
        <section className="panel p-4">
          {/* Operaciones masivas */}
          <div className="mb-3 flex flex-wrap gap-2">
            <Button2MassiveUpload label="Importar">
              {(close) => (
                <MassiveUploadModal
                  title="Importar proyectos"
                  description="Cada proyecto es un bloque: el nombre, sus meses y una fila Total. Los meses y el impacto quedan en la tabla de métricas. La fecha de creación y la de actualización se asignan al importar."
                  onBlocks={async (blocks) => {
                    await importAnnual(blocks);
                    close();
                  }}
                  onClose={close}
                />
              )}
            </Button2MassiveUpload>
            <Button2MassiveDownload label="Exportar">
              {(close) => (
                <MassiveDownloadModal
                  title="Exportar proyectos"
                  filename="proyectos.xlsx"
                  headers={[...PROJECT_ANNUAL_HEADERS]}
                  rows={filtered.map((project) => {
                    return [
                      project.nombre,
                      project.ubicacion,
                      project.tipo_de_sistema,
                      project.cap_instalada_kwp === null ? "" : String(project.cap_instalada_kwp),
                      formatDate(project.fecha_instalacion),
                      project.marca_inversor,
                      project.marca_panel,
                      project.marca_bateria,
                      project.paneles_instalados === null ? "" : String(project.paneles_instalados),
                      formatDate(project.created_at),
                      formatDate(project.updated_at),
                      project.estado === "completado" ? "Completado" : "En ejecución",
                    ];
                  })}
                  onClose={close}
                />
              )}
            </Button2MassiveDownload>
            <Button2MassiveClean label="Limpiar">
              {(close) => (
                <MassiveCleanModal
                  title="Limpiar proyectos"
                  description="Se vaciará la lista de proyectos."
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
          {/* Contenido per se */}
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
            onReplaceImage={async (id, file) => {
              await projectMutations.saveImage(id, file);
              await refresh();
            }}
          />
        </section>
      )}
    </PortalShell>
  );
}
