"use client";

import { SearchBar, ProjectSorter } from "@/features/view/components/Filters/ProjectFiltersBar";
import { ProjectSortingOrder } from "@/lib/types/components/options";
import { DEPARTMENT_OPTIONS } from "@/lib/utils/options";

export function GalleryToolbar({
  search,
  ubicacion,
  sorting,
  onSearch,
  onUbicacion,
  onSorting,
}: {
  search: string;
  ubicacion: string;
  sorting: ProjectSortingOrder;
  onSearch: (value: string) => void;
  onUbicacion: (value: string) => void;
  onSorting: (value: ProjectSortingOrder) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <SearchBar value={search} onChange={onSearch} placeholder="Buscar proyecto" />
      <label className={`relative inline-flex h-10 cursor-pointer items-center rounded-full border bg-white px-3 text-sm font-medium ${ubicacion ? "border-[var(--color-secondary)] text-[var(--color-secondary)]" : "border-[var(--border-color)]"}`}>
        <span>Departamento: {ubicacion || "Todos"}</span>
        <select
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Departamento"
          value={ubicacion}
          onChange={(event) => onUbicacion(event.target.value)}
        >
          <option value="">Todos</option>
          {DEPARTMENT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <ProjectSorter value={sorting} onChange={onSorting} />
    </div>
  );
}
