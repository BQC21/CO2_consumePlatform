import { ProjectFilters } from "@/lib/types/components/components";
import type { Project } from "@/lib/types/supabase/project-types";

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
  const search = filters.search.trim().toLowerCase();
  return projects.filter((project) => {
    const matchesSearch =
      !search ||
      project.nombre.toLowerCase().includes(search) ||
      project.descripcion.toLowerCase().includes(search) ||
      project.distrito.toLowerCase().includes(search);
    const matchesDepartment = !filters.ubicacion || project.ubicacion === filters.ubicacion;
    const matchesBrand = !filters.marcaInversor || project.marca_inversor === filters.marcaInversor;
    return matchesSearch && matchesDepartment && matchesBrand;
  });
}

export function PeriodSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
}) {
  return (
    <label className="relative inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#d7e4f2] px-2.5 py-1 text-xs font-semibold text-[#24508f] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--color-secondary)]">
      <span className="inline-block h-0 w-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-[#3b6cb5]" aria-hidden />
      {label}
      <select
        aria-label={label}
        className="absolute inset-0 cursor-pointer opacity-0"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}