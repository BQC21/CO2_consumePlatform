"use client";

import { FilterIcon } from "@/features/view/components/Icons/icons";
import { ProjectFiltersBarProps } from "@/lib/types/components/components";
import { DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS } from "@/lib/utils/options";

export function ProjectFiltersBar({ ubicacion, marcaInversor, onUbicacion, onMarca }: ProjectFiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      
      <span className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
        <FilterIcon />
        Filtros
      </span>
      
      <div className="grid grid-cols-2 gap-2">
        {/* DEPARTAMENTOS */}
        <select className="field-select input-focus max-w-48" aria-label="Departamento" 
                value={ubicacion} onChange={(event) => onUbicacion(event.target.value)}>
          <option value="">Todos los departamentos</option>
          {DEPARTMENT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* MARCA DEL INVERSOR */}
        <select className="field-select input-focus max-w-48" aria-label="Marca del inversor" 
                value={marcaInversor} onChange={(event) => onMarca(event.target.value)}>
          <option value="">Todas las marcas</option>
          {INVERTER_BRAND_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
