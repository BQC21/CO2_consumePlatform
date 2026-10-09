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
import { useProjectMutations, useRealtimeProject } from "@/features/ViewModel/hooks/services/useRealtimeProject";
import { filterProjects } from "@/lib/utils/helpers/filters/filterProjects";
import { transformAnnualRow, valueByHeader } from "@/lib/utils/helpers/massive/parseWorkbook";
import { formatDate } from "@/lib/utils/helpers/render/format";
import { platformProjectImageName } from "@/lib/utils/helpers/render/projectImage";
import { sortProjects } from "@/lib/utils/helpers/sorting/sortProjects";
import { PROJECT_ANNUAL_HEADERS } from "@/lib/utils/headers";
import { ProjectSortingOrder } from "@/lib/types/components/options";
import { Button2MassiveClean, Button2MassiveDownload, Button2MassiveUpload } from "@/features/view/components/Buttons/button2Massive";
import { ProjectFormState } from "@/lib/types/supabase/project-types";

export default function ProjectPage() {

  const projectsState = useRealtimeProject();
  const projectMutations = useProjectMutations();
  // -------------------------------
  // Estados de filtrado y sorting
  // -------------------------------

  const [search, setSearch] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [marcaInversor, setMarcaInversor] = useState("");
  const [sorting, setSorting] = useState<ProjectSortingOrder>("fecha_desc");

  // -------------------------------
  // --- Almacenamiento ------------
  // -------------------------------

  const filtered = useMemo(
    () => sortProjects(filterProjects(projectsState.items, { search, ubicacion, marcaInversor }), sorting),
    [projectsState.items, search, ubicacion, marcaInversor, sorting]);

  // ----------------------------------
  // --- Refrescar estados ------------
  // ----------------------------------

  async function refresh() {
    await projectsState.refetch();
  }

  // --------------------------------------------
  // --- Template para subida masiva ------------
  // --------------------------------------------

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
        marca_inversor: valueByHeader(row, "MARCA DEL INVERSOR") || valueByHeader(row, "Marca del inversor"),
        paneles_instalados: valueByHeader(row, "Paneles instalados"),
        rendimiento_fv_total: valueByHeader(row, "RENDIMIENTO FV TOTAL"),
        rendimiento_grid_total: valueByHeader(row, "RENDIMIENTO GRID TOTAL"),
        carga_consumida_total: valueByHeader(row, "CONSUMO CARGA TOTAL"),
        reduccion_co2: valueByHeader(row, "REDUCCIÓN CO2 TOTAL"),
        reduccion_carbon: valueByHeader(row, "REDUCCIÓN CARBON TOTAL"),
        arboles: valueByHeader(row, "ÁRBOLES TOTALES"),
        estado: estado.includes("complet") ? "completado" : "en_ejecucion",
        descripcion: valueByHeader(row, "Descripción"),
        insercion: "independiente",
        portal_proyecto_id: "",
        created_at: valueByHeader(row, "FECHA CREACIÓN"),
        updated_at: valueByHeader(row, "FECHA ACTUALIZACIÓN"),
      };
    });
    await projectMutations.createMany(forms);
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
        <ProjectFiltersBar ubicacion={ubicacion} marcaInversor={marcaInversor} onUbicacion={setUbicacion} onMarca={setMarcaInversor} />
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
                  description="La primera fila debe traer las columnas de la plantilla. Los proyectos importados quedan como independientes."
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
                      project.estado === "completado" ? "Completado" : "En ejecución",
                      platformProjectImageName(project.imagen_url),
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
