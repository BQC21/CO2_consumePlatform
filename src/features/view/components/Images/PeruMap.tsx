"use client";

import { useMemo } from "react";
import { DEPARTMENT_SHAPES, PERU_MAP_VIEWBOX } from "@/lib/utils/consts/peru-map";
import { PeruMapProps } from "@/lib/types/components/components";
import { separateLabels, stackOffsets } from "@/lib/utils/helpers/render/mapLayout";

const DOT_COLOR = {
  en_ejecucion: "#f05a1a",
  completado: "#3caf53",
} as const;

export function PeruMap({ projects, selected, onSelect }: PeruMapProps) {
  const labels = useMemo(
    () =>
      separateLabels(
        DEPARTMENT_SHAPES.map((shape) => ({
          id: shape.id,
          nombre: shape.nombre,
          x: shape.labelX,
          y: shape.labelY - 12,
        })),
      ),
    [],
  );
  const labelById = new Map(labels.map((label) => [label.id, label]));

  return (
    <div className="relative mx-auto h-[28rem] w-full max-w-3xl rounded-2xl bg-white p-3 md:h-[36rem]">
      <svg viewBox={PERU_MAP_VIEWBOX} className="h-full w-full" role="img" aria-label="Mapa del Perú por departamentos">
        <rect width="420" height="640" fill="#eef6fb" rx="16" />
        {DEPARTMENT_SHAPES.map((shape) => {
          const isSelected = shape.nombre === selected;
          const count = projects.filter((project) => project.ubicacion === shape.nombre).length;
          const label = count === 0 ? shape.nombre : `${shape.nombre}: ${count} proyecto${count === 1 ? "" : "s"}`;
          return (
            <path
              key={shape.id}
              d={shape.d}
              fill={isSelected ? "#b7daf2" : "#c5e3f6"}
              stroke={isSelected ? "#f05a1a" : "#ffffff"}
              strokeWidth={isSelected ? 2.2 : 1}
              className="cursor-pointer"
              aria-label={label}
              onClick={() => onSelect(shape.nombre)}
            >
              <title>{label}</title>
            </path>
          );
        })}
        {DEPARTMENT_SHAPES.map((shape) => {
          const local = projects.filter((project) => project.ubicacion === shape.nombre);
          const offsets = stackOffsets(local.length);
          return offsets.map((offset, index) => {
            const project = local[index];
            return (
              <circle
                key={`${shape.id}-dot-${project.id}`}
                cx={shape.labelX + offset.dx}
                cy={shape.labelY + offset.dy}
                r={3.4}
                fill={DOT_COLOR[project.estado]}
                stroke="#ffffff"
                strokeWidth={0.6}
                className="cursor-pointer"
                aria-label={`${project.nombre}, ${project.estado === "completado" ? "completado" : "en ejecución"}`}
                onClick={() => onSelect(shape.nombre)}
              >
                <title>{project.nombre}</title>
              </circle>
            );
          });
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
      <ul className="absolute top-4 left-4 flex flex-col gap-1 rounded-xl bg-black/55 px-3 py-2 text-xs text-white">
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: DOT_COLOR.en_ejecucion }} /> En ejecución
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: DOT_COLOR.completado }} /> Completado
        </li>
      </ul>
    </div>
  );
}
