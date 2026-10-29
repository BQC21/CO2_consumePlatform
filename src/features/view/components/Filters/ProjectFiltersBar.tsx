"use client";

import type { ReactNode } from "react";
import { SearchIcon, SortIcon } from "@/features/view/components/Icons/icons";
import { ProjectFiltersBarProps, ProjectSorterProps, SearchBarProps } from "@/lib/types/components/components";
import { ProjectSortingOrder } from "@/lib/types/components/options";
import { DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS, PROJECT_STATUS_OPTIONS, SORTING_OPTIONS, SYSTEM_TYPE_OPTIONS } from "@/lib/utils/options";

// barra de búsqueda
export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <label className="relative block min-w-[16rem] flex-1">
      <span className="sr-only">Buscar</span>
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-text-secondary)]">
        <SearchIcon />
      </span>
      <input
        className="h-10 w-full rounded-full border border-[var(--border-color)] bg-white pr-4 pl-9 text-sm outline-none focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-secondary)]"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

// selector de pill
function PillSelect({
  prefix,
  value,
  display,
  ariaLabel,
  onChange,
  children,
}: {
  prefix: string;
  value: string;
  display: string;
  ariaLabel: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className={`relative inline-flex h-10 cursor-pointer items-center rounded-full border bg-white px-3 text-sm font-medium ${value ? "border-[var(--color-secondary)] text-[var(--color-secondary)]" : "border-[var(--border-color)]"}`}>
      <span>{prefix}: {display}</span>
      <select
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Todos</option>
        {children}
      </select>
    </label>
  );
}

// barra de filtros
export function ProjectFiltersBar({
  ubicacion,
  marcaInversor,
  tipo,
  estado,
  onUbicacion,
  onMarca,
  onTipo,
  onEstado,
}: ProjectFiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <PillSelect prefix="Departamento" value={ubicacion} display={ubicacion || "Todos"} ariaLabel="Departamento" onChange={onUbicacion}>
        {DEPARTMENT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </PillSelect>
      <PillSelect prefix="Inversor" value={marcaInversor} display={marcaInversor || "Todos"} ariaLabel="Marca del inversor" onChange={onMarca}>
        {INVERTER_BRAND_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </PillSelect>
      <PillSelect prefix="Tipo" value={tipo} display={tipo || "Todos"} ariaLabel="Tipo de sistema" onChange={onTipo}>
        {SYSTEM_TYPE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </PillSelect>
      <PillSelect
        prefix="Estado"
        value={estado}
        display={estado === "completado" ? "Completado" : estado === "en_ejecucion" ? "En ejecución" : "Todos"}
        ariaLabel="Estado"
        onChange={onEstado}
      >
        {PROJECT_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </PillSelect>
    </div>
  );
}

// selector de orden
export function ProjectSorter({ value, onChange }: ProjectSorterProps) {
  return (
    <label className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border-color)] bg-white px-3 text-sm">
      <SortIcon />
      <span className="sr-only">Orden</span>
      <select
        className="max-w-52 bg-transparent font-medium outline-none"
        aria-label="Ordenar proyectos"
        value={value}
        onChange={(event) => onChange(event.target.value as ProjectSortingOrder)}
      >
        {SORTING_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            Orden: {option.label.replace("Fecha de instalación · ", "Instalación ")}
          </option>
        ))}
      </select>
    </label>
  );
}
