import type { Project, ProjectMonth } from "@/lib/types/supabase/project-types";
import { computeMonthEnergy } from "@/lib/utils/helpers/computes/energy_total";
import { formatDate, formatNumber } from "@/lib/utils/helpers/render/format";

type DepartmentCardProps = {
  department: string | null;
  projects: Project[];
  months: ProjectMonth[];
  year: number;
};

export function DepartmentCard({ department, projects, months, year }: DepartmentCardProps) {
  const local = projects.filter((project) => project.ubicacion === department);
  const project = local.find((item) => item.estado === "en_ejecucion") ?? local[0];

  if (!department || !project) {
    return (
      <article className="rounded-[var(--radius-xl)] bg-white p-5 text-[var(--color-text-primary)]">
        <p className="text-xs font-semibold tracking-wide text-[var(--color-primary)]">DEPARTAMENTO</p>
        <h2 className="mt-2 text-xl font-semibold">{department ?? "Sin selección"}</h2>
        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
          {department ? "Ningún departamento tiene un proyecto en esta selección." : "Elige un departamento del mapa para ver la ficha de la planta."}
        </p>
      </article>
    );
  }

  const projectMonths = months.filter((month) => month.proyecto_id === project.id);
  const latest = [...projectMonths].sort((left, right) => right.mes.localeCompare(left.mes))[0];
  const latestEnergy = latest ? computeMonthEnergy(latest.tipico_diario, latest.mes) : null;
  const annualKwh = projectMonths
    .filter((month) => month.mes.startsWith(`${year}-`))
    .reduce((total, month) => total + computeMonthEnergy(month.tipico_diario, month.mes).energiaKwh, 0);

  return (
    <article className="rounded-[var(--radius-xl)] bg-white p-5 text-[var(--color-text-primary)]">
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--color-text-secondary)]">DEPARTAMENTO · {department.toUpperCase()}</p>
      <h2 className="mt-1 text-xl font-semibold">{project.nombre}</h2>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        {project.descripcion || `${project.tipo_de_sistema || "Sistema FV"} en ${project.estado === "completado" ? "operación cerrada" : "operación"}.`}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Metric label="Capacidad" value={project.cap_instalada_kwp === null ? "—" : `${formatNumber(project.cap_instalada_kwp, 2)} kWp`} />
        <Metric label="Fecha inst." value={formatDate(project.fecha_instalacion)} />
        <Metric label="Tipo de sistema" value={project.tipo_de_sistema || "—"} />
        <Metric label="Pot. nominal" value={project.pot_nominal_kw === null ? "—" : `${formatNumber(project.pot_nominal_kw, 2)} kW`} />
        <Metric label="Prod. diaria" value={latest ? `${formatNumber(latest.tipico_diario, 1)} kWh` : "—"} />
        <Metric label="Prod. mensual" value={latestEnergy ? `${formatNumber(latestEnergy.energiaKwh, 1)} kWh` : "—"} />
        <Metric label="Prod. anual" value={`${formatNumber(annualKwh / 1000, 2)} MWh`} />
        <Metric label="Paneles" value={formatNumber(project.paneles_instalados, 0)} />
      </dl>
      {local.length > 1 ? <p className="mt-3 text-xs text-[var(--color-text-secondary)]">{local.length} plantas en este departamento. Se muestra la que sigue en ejecución.</p> : null}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-background)] px-3 py-2">
      <dt className="text-[0.65rem] tracking-wide text-[var(--color-text-secondary)] uppercase">{label}</dt>
      <dd className="numeric font-semibold">{value}</dd>
    </div>
  );
}
