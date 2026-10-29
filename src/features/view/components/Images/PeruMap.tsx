"use client";

import { useMemo } from "react";
import { DEPARTMENT_SHAPES, PERU_MAP_VIEWBOX } from "@/lib/utils/consts/peru-map";
import { PeruMapProps } from "@/lib/types/components/components";
import { separateLabels } from "@/lib/utils/helpers/render/mapLayout";
import { departmentStatus } from "@/lib/utils/helpers/render/format";

const REGION_FILL = {
  sin_proyecto: "#d5dee7",
  completado: "#7dce6a",
  en_ejecucion: "#f05a1a",
  selected: "#1b7a34",
} as const;

export function PeruMap({ projects, selected, onSelect, onClear, loading = false }: PeruMapProps) {
  const labels = useMemo(
    () =>
      separateLabels(
        DEPARTMENT_SHAPES.map((shape) => ({
          id: shape.id,
          nombre: shape.nombre,
          x: shape.labelX,
          y: shape.labelY,
        })),
      ),
    [],
  );
  const labelById = new Map(labels.map((label) => [label.id, label]));

  return (
    <article className="relative rounded-3xl bg-white p-5 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] md:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold md:text-3xl">
          Proyectos por departamento
        </h2>
        {loading ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-[#b7e0c2] px-3 py-1 text-sm font-medium text-[#1f7a32]">
            <span className="h-2 w-2 rounded-full bg-[#1f7a32]" />
            Cargando datos…
          </span>
        ) : selected ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[#b7e0c2] px-3 py-1 text-sm font-medium text-[#1f7a32]"
            onClick={onClear}
          >
            <span className="h-2 w-2 rounded-full bg-[#1f7a32]" />
            Mostrando: {selected}
            <span aria-hidden="true">×</span>
            <span className="sr-only">Quitar selección</span>
          </button>
        ) : null}
      </div>
      <svg viewBox={PERU_MAP_VIEWBOX} className="mx-auto h-[42rem] w-full md:h-[58rem] xl:h-[68rem]" role="img" aria-label="Mapa del Perú por departamentos">
        {DEPARTMENT_SHAPES.map((shape) => {
          const status = loading ? "sin_proyecto" : departmentStatus(shape.nombre, projects);
          const isSelected = !loading && shape.nombre === selected;
          const count = loading ? 0 : projects.filter((project) => project.ubicacion === shape.nombre).length;
          const label = count === 0 ? shape.nombre : `${shape.nombre}: ${count} proyecto${count === 1 ? "" : "s"}`;
          return (
            <path
              key={shape.id}
              d={shape.d}
              fill={isSelected ? REGION_FILL.selected : REGION_FILL[status]}
              stroke="#ffffff"
              strokeWidth={1.1}
              className={loading ? undefined : "cursor-pointer"}
              aria-label={label}
              onClick={loading ? undefined : () => onSelect(shape.nombre)}
            >
              <title>{label}</title>
            </path>
          );
        })}
        {DEPARTMENT_SHAPES.map((shape) => {
          const label = labelById.get(shape.id);
          if (!label) {
            return null;
          }
          return (
            <text
              key={`${shape.id}-label`}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              fill="#16324f"
              fontSize="6.4"
              fontWeight="600"
              style={{ pointerEvents: "none" }}
            >
              {shape.nombre}
            </text>
          );
        })}
      </svg>
      <ul className="absolute bottom-6 left-6 rounded-2xl border border-[var(--border-color)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-sm)]">
        <li className="mb-1 font-semibold">Estado</li>
        <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: REGION_FILL.completado }} /> Completado</li>
        <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: REGION_FILL.en_ejecucion }} /> En ejecución</li>
        <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: REGION_FILL.sin_proyecto }} /> Sin proyectos</li>
        <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: REGION_FILL.selected }} /> Seleccionado</li>
      </ul>
    </article>
  );
}
