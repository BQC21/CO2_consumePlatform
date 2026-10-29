"use client";

import { useMemo, useState } from "react";
import { Button2Add, Button2MassiveClean, Button2MassiveDownload, Button2MassiveUpload } from "@/features/view/components/Buttons/buttons";
import { ProjectFiltersBar, ProjectSorter, SearchBar } from "@/features/view/components/Filters/ProjectFiltersBar";
import { MassiveCleanModal } from "@/features/view/components/MassiveModals/MassiveCleanModal";
import { MassiveDownloadModal } from "@/features/view/components/MassiveModals/MassiveDownloadModal";
import { MassiveUploadModal } from "@/features/view/components/MassiveModals/MassiveUploadModal";
import { AddProjectModal } from "@/features/view/components/Modals/project_annual/AddProjectModal";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { ProjectAnnualTable } from "@/features/view/components/Tables/project_annual";
import { createProject } from "@/features/model/services/projectQueries";
import { replaceMonthlyRecords } from "@/features/model/services/monthlyRecordQueries";
import { useProjectMutations, useRealtimeProject } from "@/features/ViewModel/hooks/services/useRealtimeProject";
import { filterProjects } from "@/lib/utils/helpers/filters/filterProjects";
import { sortProjects } from "@/lib/utils/helpers/sorting/sortProjects";
import { PROJECT_ANNUAL_HEADERS } from "@/lib/utils/headers";
import { ImportedProjectBlock } from "@/lib/types/components/components";
import { ProjectSortingOrder } from "@/lib/types/components/options";
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
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [sorting, setSorting] = useState<ProjectSortingOrder>("fecha_desc");
  const [unsavedRows, setUnsavedRows] = useState(0);

  // -------------------------------
  // --- Almacenamiento ------------
  // -------------------------------

  const filtered = useMemo(
    () => sortProjects(filterProjects(projectsState.items, { search, ubicacion, marcaInversor, 
            marcaPanel: "", marcaBateria: "", tipo, estado }), sorting),
    [projectsState.items, search, ubicacion, marcaInversor, tipo, estado, sorting]);

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

  // Función para generar los chips de los filtros
  const chips = [
    ubicacion ? { id: "ubicacion", label: `Departamento: ${ubicacion}`, clear: () => setUbicacion("") } : null,
    marcaInversor ? { id: "inversor", label: `Inversor: ${marcaInversor}`, clear: () => setMarcaInversor("") } : null,
    tipo ? { id: "tipo", label: `Tipo: ${tipo}`, clear: () => setTipo("") } : null,
    estado ? { id: "estado", label: `Estado: ${estado === "completado" ? "Completado" : "En ejecución"}`, clear: () => setEstado("") } : null,
    search.trim() ? { id: "search", label: `Búsqueda: ${search.trim()}`, clear: () => setSearch("") } : null,
  ].filter((chip): chip is { id: string; label: string; clear: () => void } => chip !== null);

  // Función para limpiar los filtros
  function clearFilters() {
    setSearch("");
    setUbicacion("");
    setMarcaInversor("");
    setTipo("");
    setEstado("");
  }

  return (
    <PortalShell
      title="Lista de proyectos"
      subtitle="Registra, edita o elimina proyectos fotovoltaicos. Haz clic en el lápiz para editar una fila."
      activePath="/project"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {unsavedRows > 0 ? (
            <span className="unsaved-chip">
              <span className="h-2 w-2 rounded-full bg-[#f05a1a]" />
              Cambios sin guardar ({unsavedRows} {unsavedRows === 1 ? "fila" : "filas"})
            </span>
          ) : null}
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
                rows={filtered.map((project) => [
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
                ])}
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
          <Button2Add label="Nuevo proyecto" compact>
            {(close) => (
              <AddProjectModal
                onAdd={async (form) => {
                  const created = await projectMutations.create(form);
                  await refresh();
                  close();
                }}
                onClose={close}
              />
            )}
          </Button2Add>
        </div>
      }
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar proyecto o distrito" />
        <ProjectFiltersBar
          ubicacion={ubicacion}
          marcaInversor={marcaInversor}
          tipo={tipo}
          estado={estado}
          onUbicacion={setUbicacion}
          onMarca={setMarcaInversor}
          onTipo={setTipo}
          onEstado={setEstado}
        />
        <ProjectSorter value={sorting} onChange={setSorting} />
      </div>

      {chips.length > 0 ? (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-[var(--color-text-secondary)]">Filtros activos:</span>
          {chips.map((chip) => (
            <span key={chip.id} className="filter-chip">
              {chip.label}
              <button type="button" aria-label={`Quitar ${chip.label}`} onClick={chip.clear}>×</button>
            </span>
          ))}
          <button type="button" className="text-sm font-semibold text-[var(--color-primary)]" onClick={clearFilters}>
            Limpiar filtros
          </button>
        </div>
      ) : null}

      {projectsState.loading ? (
        <div className="panel p-4" aria-hidden="true">
          <div className="skeleton h-10 rounded-xl" />
          <div className="skeleton mt-2 h-12 rounded-xl" />
          <div className="skeleton mt-2 h-12 rounded-xl" />
          <div className="skeleton mt-2 h-12 rounded-xl" />
        </div>
      ) : (
        <section className="panel p-4">
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
            onEditingChange={setUnsavedRows}
          />
        </section>
      )}
    </PortalShell>
  );
}
