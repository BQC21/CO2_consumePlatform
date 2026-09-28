"use client";

import { DEPARTMENT_SHAPES, PERU_MAP_VIEWBOX } from "@/lib/utils/consts/peru-map";
import type { Project } from "@/lib/types/supabase/project-types";

export type MapStatus = "en_ejecucion" | "completado" | "sin_proyecto";

const FILL: Record<MapStatus, string> = {
  en_ejecucion: "var(--color-primary)",
  completado: "var(--color-accent-green)",
  sin_proyecto: "#2f6fbf",
};

export function departmentStatus(nombre: string, projects: Project[]): MapStatus {
  const local = projects.filter((project) => project.ubicacion === nombre);
  if (local.some((project) => project.estado === "en_ejecucion")) {
    return "en_ejecucion";
  }
  if (local.some((project) => project.estado === "completado")) {
    return "completado";
  }
  return "sin_proyecto";
}

type PeruMapProps = {
  projects: Project[];
  selected: string | null;
  onSelect: (nombre: string) => void;
};

export function PeruMap({ projects, selected, onSelect }: PeruMapProps) {
  return (
    <div className="relative h-full min-h-[28rem]">
      <svg viewBox={PERU_MAP_VIEWBOX} className="h-full w-full" role="img" aria-label="Mapa del Perú por departamentos">
        <rect width="420" height="640" fill="var(--color-map-water)" rx="16" />
        {DEPARTMENT_SHAPES.map((shape) => {
          const status = departmentStatus(shape.nombre, projects);
          const isSelected = shape.nombre === selected;
          return (
            <path
              key={shape.id}
              d={shape.d}
              fill={FILL[status]}
              stroke={isSelected ? "#ffffff" : "rgb(255 255 255 / 0.45)"}
              strokeWidth={isSelected ? 2.4 : 0.8}
              className="cursor-pointer"
              onClick={() => onSelect(shape.nombre)}
            >
              <title>
                {shape.nombre}: {status === "en_ejecucion" ? "En ejecución" : status === "completado" ? "Completado" : "Sin proyecto"}
              </title>
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
      <ul className="absolute top-3 left-3 flex gap-3 rounded-full bg-black/30 px-3 py-1 text-xs text-white">
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
