"use client";

import { FilterIcon } from "@/features/view/components/Icons/icons";
import { ProjectFiltersBarProps } from "@/lib/types/components/components";
import { BATTERY_BRAND_OPTIONS, DEPARTMENT_OPTIONS, INVERTER_BRAND_OPTIONS, PANEL_BRAND_OPTIONS } from "@/lib/utils/options";

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
