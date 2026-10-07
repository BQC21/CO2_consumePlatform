import { Impact } from "@/lib/types/components/options";
import { Project } from "@/lib/types/supabase/project-types";
import { SeriesPoint } from "../computes/project_series";

export function impactValue(project: Project, impact: Impact): number | null {
  if (impact === "co2") {
    return project.reduccion_co2;
  }
  if (impact === "carbon") {
    return project.reduccion_carbon;
  }
  return project.arboles;
}
  
export function LineChart({ points }: { points: SeriesPoint[] }) {
  const width = 360;
  const height = 180;
  const pad = 28;
  const max = Math.max(1, ...points.flatMap((point) => [point.fv, point.grid, point.carga]));
  const step = points.length > 1 ? (width - pad * 2) / (points.length - 1) : 0;
  const pathFor = (key: "fv" | "grid" | "carga") =>
    points
      .map((point, index) => {
        const x = pad + index * step;
        const y = height - pad - (point[key] / max) * (height - pad * 2);
        return `${index === 0 ? "M" : "L"}${x} ${y}`;
      })
      .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full" role="img" aria-label="Potencia por periodo">
      <line x1={pad} y1={height - pad} x2={width - 8} y2={height - pad} stroke="#94a3b8" />
      <line x1={pad} y1={12} x2={pad} y2={height - pad} stroke="#94a3b8" />
      <path d={pathFor("fv")} fill="none" stroke="#a855f7" strokeWidth="2" />
      <path d={pathFor("carga")} fill="none" stroke="#2563eb" strokeWidth="2" />
      <path d={pathFor("grid")} fill="none" stroke="#22c55e" strokeWidth="2" />
      {points.map((point, index) => (
        <text key={point.label} x={pad + index * step} y={height - 8} textAnchor="middle" fontSize="10" fill="#64748b">
          {point.label}
        </text>
      ))}
    </svg>
  );
}
  
export function BarChart({ points }: { points: SeriesPoint[] }) {
  const width = 360;
  const height = 180;
  const pad = 28;
  const max = Math.max(1, ...points.flatMap((point) => [point.fv, point.grid, point.carga]));
  const group = points.length === 0 ? 0 : (width - pad * 2) / points.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full" role="img" aria-label="Energía por año">
      <line x1={pad} y1={height - pad} x2={width - 8} y2={height - pad} stroke="#94a3b8" />
      <line x1={pad} y1={12} x2={pad} y2={height - pad} stroke="#94a3b8" />
      {points.map((point, index) => {
        const base = pad + index * group + group / 2;
        const bar = (value: number, dx: number, color: string) => {
          const barHeight = (value / max) * (height - pad * 2);
          return <rect x={base + dx} y={height - pad - barHeight} width="8" height={barHeight} fill={color} />;
        };
        return (
          <g key={point.label}>
            {bar(point.fv, -12, "#a855f7")}
            {bar(point.carga, -2, "#2563eb")}
            {bar(point.grid, 8, "#22c55e")}
            <text x={base} y={height - 8} textAnchor="middle" fontSize="10" fill="#64748b">
              {point.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
  
export function ImpactChart({ points, label }: { points: { label: string; value: number }[]; label: string }) {
  const width = 360;
  const height = 180;
  const pad = 28;
  const max = Math.max(1, ...points.map((point) => point.value));
  const step = points.length > 1 ? (width - pad * 2) / (points.length - 1) : 0;
  const xAt = (index: number) => (points.length === 1 ? width / 2 : pad + index * step);
  const yAt = (value: number) => height - pad - (value / max) * (height - pad * 2);
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${xAt(index)} ${yAt(point.value)}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full" role="img" aria-label={label}>
      <line x1={pad} y1={height - pad} x2={width - 8} y2={height - pad} stroke="#94a3b8" />
      <line x1={pad} y1={12} x2={pad} y2={height - pad} stroke="#94a3b8" />
      {path ? <path d={path} fill="none" stroke="#111827" strokeWidth="2" /> : null}
      {points.map((point, index) => (
        <g key={`${point.label}-${index}`}>
          <circle cx={xAt(index)} cy={yAt(point.value)} r="3" fill="#111827" />
          <text x={xAt(index)} y={height - 8} textAnchor="middle" fontSize="10" fill="#64748b">
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}