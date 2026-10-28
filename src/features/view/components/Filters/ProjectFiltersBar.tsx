"use client";

import { FilterIcon, SearchIcon, SortIcon } from "@/features/view/components/Icons/icons";
import { ProjectFiltersBarProps, ProjectSorterProps, SearchBarProps } from "@/lib/types/components/components";
import { ProjectSortingOrder } from "@/lib/types/components/options";
import { BATTERY_BRAND_OPTIONS, DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS, PANEL_BRAND_OPTIONS, SORTING_OPTIONS } from "@/lib/utils/options";

// Barra de búsqueda
export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <label className="relative block w-200! max-w-full shrink-0">
      <span className="sr-only">Buscar</span>
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-text-secondary)]">
        <SearchIcon />
      </span>
      <input className="field-input input-focus pl-9" value={value} placeholder={placeholder}
              onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

// Barras de filtado
export function ProjectFiltersBar({
  ubicacion,
  marcaInversor,
  marcaPanel,
  marcaBateria,
  onUbicacion,
  onMarca,
  onMarcaPanel,
  onMarcaBateria,
}: ProjectFiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      
      <span className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
        <FilterIcon />
        Filtros
      </span>
      
      <div className="flex flex-wrap gap-2">
        {/* DEPARTAMENTOS */}
        <select className="field-select input-focus w-44!" aria-label="Departamento" 
                value={ubicacion} onChange={(event) => onUbicacion(event.target.value)}>
          <option value="">Todos los departamentos</option>
          {DEPARTMENT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* MARCA DEL INVERSOR */}
        <select className="field-select input-focus w-44!" aria-label="Marca del inversor" 
                value={marcaInversor} onChange={(event) => onMarca(event.target.value)}>
          <option value="">Todos los inversores</option>
          {INVERTER_BRAND_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* MARCA DEL PANEL SOLAR */}
        <select className="field-select input-focus w-44!" aria-label="Marca del panel solar"
                value={marcaPanel} onChange={(event) => onMarcaPanel(event.target.value)}>
          <option value="">Todos los paneles</option>
          {PANEL_BRAND_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* MARCA DE LA BATERÍA */}
        <select className="field-select input-focus w-44!" aria-label="Marca de la batería"
                value={marcaBateria} onChange={(event) => onMarcaBateria(event.target.value)}>
          <option value="">Todas las baterías</option>
          {BATTERY_BRAND_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}

// Barras de ordenamiento
export function ProjectSorter({ value, onChange }: ProjectSorterProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
      <SortIcon />
      <span className="sr-only">Orden</span>
      <select
        className="field-select input-focus max-w-64"
        aria-label="Ordenar proyectos"
        value={value}
        onChange={(event) => onChange(event.target.value as ProjectSortingOrder)}
      >
        {SORTING_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
