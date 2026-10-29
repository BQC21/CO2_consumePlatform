"use client";

import { useMemo, useState } from "react";
import { MonthlyYieldChart } from "@/features/view/components/Charts/MonthlyYieldChart";
import { MonthlyRecordDraft } from "@/lib/types/components/components";
import { Project } from "@/lib/types/supabase/project-types";
import { computeDashboardMetrics, energyMwhForPeriod, monthlyEnergyMwh, sumEnergyMwh } from "@/lib/utils/helpers/computes/dashboard_metrics";
import { formatNumber, massFromKg } from "@/lib/utils/helpers/normalization";
import { ImpactTile, PeriodSwitcher, YearSwitcher } from "../Form_fields/fields";
import { ImpactIcon } from "../Icons/icons";
import { monthSpan } from "@/lib/utils/helpers/render/charts";
import { DashboardPeriod } from "@/lib/types/components/options";

export function EnvironmentalCards({
  projects,
  monthlyRecords,
  monthlyLoading,
  monthlyError,
}: {
  projects: Project[];
  monthlyRecords: MonthlyRecordDraft[];
  monthlyLoading: boolean;
  monthlyError: string | null;
}) {

  // ----------------------------
  // --- ESTADO Y VARIABLES ---
  // ----------------------------
  const currentYear = new Date().getFullYear(); // año actual
  const [period, setPeriod] = useState<DashboardPeriod>(currentYear); // periodo seleccionado
  const [chartYear, setChartYear] = useState(currentYear); // año seleccionado en el gráfico
  const metrics = useMemo(() => computeDashboardMetrics(projects), [projects]); // métricas del dashboard
  const periodYear = period === "todos" ? currentYear : period; // año seleccionado en el gráfico

  // ----------------------------
  // --- CALCULOS ---
  // ----------------------------
  const periodEnergy = useMemo(() => {
    if (period === "todos") {
      return sumEnergyMwh(monthlyRecords);
    }
    return energyMwhForPeriod(monthlyRecords, { mode: "anio", year: period });
  }, [monthlyRecords, period]);
  
  // ----------------------------
  // --- PERIODOS Y VALORES ---
  // ----------------------------
  
  const periodYield = useMemo(() => monthlyEnergyMwh(monthlyRecords, periodYear), [monthlyRecords, periodYear]); // energía generada en el periodo seleccionado
  const chartYield = useMemo(() => monthlyEnergyMwh(monthlyRecords, chartYear), [chartYear, monthlyRecords]); // energía generada en el año seleccionado en el gráfico
  const co2 = massFromKg(metrics.co2Kg); // CO₂ reducido
  const carbon = massFromKg(metrics.carbonKg); // Carbón reducido
  const range = monthSpan(periodYear, periodYield, period === "todos"); // rango de meses en el periodo seleccionado

  return (
    <section className="rounded-3xl border border-white/10 bg-[#101826]/80 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold md:text-4xl">Impacto ambiental acumulado</h2>
        <PeriodSwitcher value={period} onChange={setPeriod} />
      </div>
      {monthlyError ? <p className="field-error mt-3">{monthlyError}</p> : null}
      
      {/* --- TILES DE IMPACTO --- */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        <ImpactTile
          title="CO₂ reducido"
          value={co2.amount === null ? "—" : formatNumber(co2.amount, 2)}
          unit={co2.amount === null ? "" : `${co2.unit} CO₂`}
          tone="#2f6fed"
          icon="truck"
        />
        <ImpactTile
          title="Carbón reducido"
          value={carbon.amount === null ? "—" : formatNumber(carbon.amount, 2)}
          unit={carbon.amount === null ? "" : carbon.unit}
          tone="#7c5cff"
          icon="factory"
        />
        <ImpactTile
          title="Árboles equivalentes"
          value={metrics.arboles === null ? "—" : formatNumber(Math.ceil(metrics.arboles), 0)}
          unit={metrics.arboles === null ? "" : "árboles"}
          tone="#3caf53"
          icon="tree"
        />
        {monthlyLoading ? (
          <article className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3" aria-hidden="true">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f05a1a] text-white">
              <ImpactIcon name="bolt" />
            </span>
            <div className="skeleton-dark h-8 w-24 rounded-full" />
          </article>
        ) : (
          <ImpactTile
            title="Energía generada"
            value={periodEnergy === null ? "—" : formatNumber(periodEnergy, 2)}
            unit={periodEnergy === null ? "" : `MWh · ${range}`}
            tone="#f05a1a"
            icon="bolt"
          />
        )}
      </div>

      {/* --- GRÁFICO DE RENDIMIENTO MENSUAL --- */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-3 py-4 md:px-5">
        <div className="mb-3 flex justify-end">
          <YearSwitcher value={chartYear} onChange={setChartYear} />
        </div>
        {monthlyLoading ? <div className="skeleton-dark h-56 rounded-2xl" /> : 
              <MonthlyYieldChart year={chartYear} values={chartYield} />
        }
      </div>
    </section>
  );
}
