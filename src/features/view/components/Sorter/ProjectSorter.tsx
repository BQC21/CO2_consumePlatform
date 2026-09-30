"use client";

import { SortIcon } from "@/features/view/components/Icons/icons";
import { ProjectSorterProps } from "@/lib/types/components/components";
import { ProjectSortingOrder } from "@/lib/types/components/options";
import { SORTING_OPTIONS } from "@/lib/utils/options";

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
