"use client";

import { useMemo } from "react";
import { PeruMapProps } from "@/lib/types/components/components";
import { REGION_FILL } from "@/lib/utils/consts/design";
import { DEPARTMENT_SHAPES, PERU_MAP_VIEWBOX } from "@/lib/utils/consts/peru-map";
import { departmentStatus } from "@/lib/utils/helpers/render/format";
import { separateLabels } from "@/lib/utils/helpers/render/mapLayout";

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
    <article className="relative isolate min-w-0 overflow-hidden rounded-3xl bg-white p-4 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] sm:p-5 md:p-6">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="min-w-0 text-xl font-semibold sm:text-2xl md:text-3xl">
          Proyectos por departamento
        </h2>
        {loading ? (
          <span className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[#b7e0c2] px-3 py-1 text-sm font-medium text-[#1f7a32]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#1f7a32]" />
            Cargando datos…
          </span>
        ) : selected ? (
          <button
            type="button"
            className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[#b7e0c2] px-3 py-1 text-left text-sm font-medium text-[#1f7a32]"
            onClick={onClear}
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#1f7a32]" />
            <span className="min-w-0 break-words">Mostrando: {selected}</span>
            <span aria-hidden="true">×</span>
            <span className="sr-only">Quitar selección</span>
          </button>
        ) : null}
      </div>
      <p className="max-w-prose text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-2xl">
        Seleccione uno de los departamentos para ver mayor información de los proyectos desarrollados
      </p>
      <div className="relative mx-auto mt-5 w-full min-w-0 overflow-hidden rounded-2xl">
        <div className="map-photo-backdrop" aria-hidden="true" />
        <svg viewBox={PERU_MAP_VIEWBOX} preserveAspectRatio="xMidYMid meet" className="relative z-10 block h-auto w-full" role="img" aria-label="Mapa del Perú por departamentos">
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
        <ul className="relative z-10 m-3 flex w-fit max-w-[calc(100%-1.5rem)] flex-col gap-1 rounded-2xl border border-[var(--border-color)] bg-white/80 px-4 py-3 text-sm shadow-[var(--shadow-sm)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
          <li className="font-semibold sm:w-full">Estado</li>
          <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: REGION_FILL.completado }} /> Completado</li>
          <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: REGION_FILL.en_ejecucion }} /> En ejecución</li>
          <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: REGION_FILL.sin_proyecto }} /> Sin proyectos</li>
          <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: REGION_FILL.selected }} /> Seleccionado</li>
        </ul>
      </div>
    </article>
  );
}
