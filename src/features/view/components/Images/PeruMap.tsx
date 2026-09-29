"use client";

import { DEPARTMENT_SHAPES, PERU_MAP_VIEWBOX } from "@/lib/utils/consts/peru-map";
import { PeruMapProps } from "@/lib/types/components/components";
import { FILL, STATUS_LABEL } from "@/lib/utils/consts/map_color_state";
import { departmentStatus } from "@/lib/utils/helpers/render/format";

export function PeruMap({ projects, selected, onSelect }: PeruMapProps) {
  return (
    <div className="relative mx-auto h-[50rem] w-full max-w-[100rem]">
      <svg viewBox={PERU_MAP_VIEWBOX} className="h-full w-full" role="img" aria-label="Mapa del Perú por departamentos">
        <rect width="5*420" height="5*640" fill="var(--color-map-water)" rx="16" />
        {DEPARTMENT_SHAPES.map((shape) => {
          const status = departmentStatus(shape.nombre, projects);
          const isSelected = shape.nombre === selected;
          const label = `${shape.nombre}: ${STATUS_LABEL[status]}`;
          return (
            <path
              key={shape.id}
              d={shape.d}
              fill={FILL[status]}
              stroke={isSelected ? "#ffffff" : "rgb(255 255 255 / 0.45)"}
              strokeWidth={isSelected ? 2.4 : 0.8}
              className="cursor-pointer"
              aria-label={label}
              onClick={() => onSelect(shape.nombre)}
            >
              <title>{label}</title>
            </path>
          );
        })}
        {DEPARTMENT_SHAPES.map((shape) => (
          <text
            key={`${shape.id}-label`}
            x={shape.labelX}
            y={shape.labelY}
            textAnchor="middle"
            fill="white"
            fontSize="7"
            style={{ pointerEvents: "none" }}
          >
            {shape.nombre}
          </text>
        ))}
      </svg>
      <ul className="absolute top-2 left-2 flex flex-col gap-1 rounded-xl bg-black/30 px-2 py-1 text-[20px] text-white">
        <li className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--color-primary)" }} /> En ejecución
        </li>
        <li className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--color-accent-green)" }} /> Completado
        </li>
        <li className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--color-secondary)" }} /> Sin proyecto
        </li>
      </ul>
    </div>
  );
}
