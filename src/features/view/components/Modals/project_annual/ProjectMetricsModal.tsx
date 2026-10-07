"use client";

import { useMemo, useState } from "react";
import { ModalFrame } from "@/features/view/refactor/ModalFrame";
import type { MonthlyEnergy } from "@/lib/types/supabase/monthly-energy";
import type { Project } from "@/lib/types/supabase/project-types";
import { monthPoint, multiYearSeries, seriesHasValues, yearSeries, type SeriesPoint } from "@/lib/utils/helpers/computes/project_series";
import { formatNumber } from "@/lib/utils/helpers/render/format";
import { Impact, Period } from "@/lib/types/components/options";
import { IMPACT_OPTIONS } from "@/lib/utils/options";
import { MONTHS } from "@/lib/utils/consts/months";
import { BarChart, ImpactChart, impactValue, LineChart } from "@/lib/utils/helpers/graphs/energy";

export function ProjectMetricsModal({
  project,
  months,
  onClose,
}: {
  project: Project;
  months: MonthlyEnergy[];
  onClose: () => void;
}) {
  const currentYear = new Date().getFullYear();
  const [period, setPeriod] = useState<Period>("mes");
  const [impact, setImpact] = useState<Impact>("co2");
  const [day, setDay] = useState(new Date().toISOString().slice(0, 10));
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);

  const years = useMemo(() => multiYearSeries(months, project.id).map((point) => Number(point.label)), [months, project.id]);
  const monthSeries = useMemo(() => yearSeries(months, project.id, year), [months, project.id, year]);
  const annualSeries = useMemo(() => multiYearSeries(months, project.id), [months, project.id]);
  const selectedMonth = monthPoint(months, project.id, year, month);
  const selectedYear = annualSeries.find((point) => point.label === String(year)) ?? { fv: 0, grid: 0, carga: 0 };
  const readout = period === "anio" ? selectedYear : selectedMonth;
  const powerPoints = period === "anio" ? annualSeries : monthSeries;
  const hasPower = seriesHasValues(powerPoints);
  const impactOption = IMPACT_OPTIONS.find((option) => option.value === impact) ?? IMPACT_OPTIONS[0];
  const impactTotal = impactValue(project, impact);

  return (
    <ModalFrame title={`Métricas · ${project.nombre}`} onClose={onClose} wide>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <label className="rounded-md bg-[#e8eef6] px-2 py-1 font-semibold text-[#24508f]">
          <span className="sr-only">Periodo</span>
          <select aria-label="Periodo" value={period} onChange={(event) => setPeriod(event.target.value as Period)}>
            <option value="diario">diario</option>
            <option value="mes">mes</option>
            <option value="anio">año</option>
          </select>
        </label>
        {period === "diario" ? (
          <input className="field-input h-9 w-auto" type="date" aria-label="Día" value={day} onChange={(event) => setDay(event.target.value)} />
        ) : null}
        {period === "mes" ? (
          <select className="field-select h-9 w-auto" aria-label="Mes" value={month} onChange={(event) => setMonth(Number(event.target.value))}>
            {MONTHS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        ) : null}
        {period !== "diario" ? (
          <select className="field-select h-9 w-auto" aria-label="Año" value={year} onChange={(event) => setYear(Number(event.target.value))}>
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        ) : null}
        <span className="rounded-md bg-[#d7ebf8] px-3 py-1">FV {formatNumber(readout.fv, 1)} kWh</span>
        <span className="rounded-md bg-[#d7ebf8] px-3 py-1">Carga {formatNumber(readout.carga, 1)} kWh</span>
        <span className="rounded-md bg-[#d7ebf8] px-3 py-1">Red {formatNumber(readout.grid, 1)} kWh</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-secondary)]">
            <p>{period === "diario" ? "La serie horaria se vacía al cerrar el día." : period === "mes" ? "La serie del mes usa los registros guardados." : "Barras por año registrado."}</p>
            <ul className="flex gap-3">
              <li className="text-[#a855f7]">Panel solar FV</li>
              <li className="text-[#2563eb]">Carga</li>
              <li className="text-[#22c55e]">Red eléctrica</li>
            </ul>
          </div>
          {period === "diario" ? (
            <p className="grid h-80 place-items-center rounded-xl bg-[var(--color-background)] px-4 text-center text-sm text-[var(--color-text-secondary)]">
              No hay lecturas horarias para {day}. Esa serie llega de la API del inversor y todavía no está conectada.
            </p>
          ) : hasPower ? (
            period === "anio" ? <BarChart points={powerPoints} /> : <LineChart points={powerPoints} />
          ) : (
            <p className="grid h-80 place-items-center rounded-xl bg-[var(--color-background)] px-4 text-center text-sm text-[var(--color-text-secondary)]">
              No hay registros de energía para este periodo.
            </p>
          )}
          <ul className="sr-only">
            {powerPoints.map((point) => (
              <li key={point.label}>
                {point.label}: FV {point.fv}, carga {point.carga}, red {point.grid}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs text-[var(--color-text-secondary)]">El total ambiental está guardado en el proyecto. No hay serie horaria.</p>
            <label>
              <span className="sr-only">Indicador ambiental</span>
              <select className="field-select h-9 w-auto" value={impact} onChange={(event) => setImpact(event.target.value as Impact)}>
                {IMPACT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {period === "diario" || period === "mes" ? (
            <p className="grid h-80 place-items-center rounded-xl bg-[var(--color-background)] px-4 text-center text-sm text-[var(--color-text-secondary)]">
              {impactOption.label}: {impactTotal === null ? "sin dato" : `${formatNumber(impactTotal, 2)} ${impactOption.unit}`.trim()}. La curva por hora o por mes todavía no está almacenada.
            </p>
          ) : (
            <ImpactChart value={impactTotal} label={`${impactOption.label} total`} />
          )}
          <p className="mt-2 text-center text-sm">
            Total registrado: {impactTotal === null ? "—" : `${formatNumber(impactTotal, 2)} ${impactOption.unit}`.trim()}
          </p>
        </section>
      </div>
    </ModalFrame>
  );
}
