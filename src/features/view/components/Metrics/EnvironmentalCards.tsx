import { DashboardMetrics, MonthlyRecordDraft } from "@/lib/types/components/components";
import { ImpactCard } from "../Form_fields/fields";
import { useMemo, useState } from "react";
import { massFromKg } from "@/lib/utils/helpers/normalization";
import { energyMwhForPeriod, monthlyEnergyMwh, yearsFromOldestPeriod } from "@/lib/utils/helpers/computes/dashboard_metrics";
import { MonthlyYieldChart } from "../Charts/MonthlyYieldChart";

export function EnvironmentalCards({
  metrics,
  monthlyRecords,
  monthlyLoading,
  monthlyError,
}: {
  metrics: DashboardMetrics;
  monthlyRecords: MonthlyRecordDraft[];
  monthlyLoading: boolean;
  monthlyError: string | null;
}) {

    // -----------------------
    // --- Estados -----------
    // -----------------------

    const year = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const years = useMemo(() => yearsFromOldestPeriod(monthlyRecords, year), [monthlyRecords, year]);
    const activeYear = selectedYear !== null && years.includes(selectedYear) ? selectedYear : year;

    // --------------------------
    // --- Sincronización -------
    // --------------------------

    const periodEnergy = useMemo(() => {
      if (monthlyRecords.length === 0) {
        return metrics.produccionAnualMwh;
      }
      return energyMwhForPeriod(monthlyRecords, { mode: "anio", year: activeYear });
    }, [activeYear, metrics.produccionAnualMwh, monthlyRecords]);

    const monthlyYield = useMemo(
      () => monthlyEnergyMwh(monthlyRecords, activeYear),
      [activeYear, monthlyRecords],
    );

    // cambio de unidades
    const co2 = massFromKg(metrics.co2Kg);
    const carbon = massFromKg(metrics.carbonKg);

  return (
    <div className="grid gap-3">

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold md:text-2xl">Impacto ambiental acumulado</h1>
        
        {monthlyLoading ? <p className="text-sm text-white/70">Leyendo registros mensuales…</p> : null}
        {monthlyError ? <p className="field-error">{monthlyError}</p> : null}

        <ImpactCard title="CO2 reducido" accumulated={co2.amount} unit={co2.unit} icon="🚛" />
        <ImpactCard title="Carbón reducido" accumulated={carbon.amount} unit={carbon.unit} icon="🏭" />
        <ImpactCard
          title="Árboles"
          accumulated={metrics.arboles === null ? null : Math.ceil(metrics.arboles)}
          unit=""
          icon="🌳"
          digits={0}
        />

        <div className="h-px w-full bg-white/50" role="separator" />
        <div className="flex w-full items-center gap-2">
          <span className="text-sm">Seleccione el año</span>
          <select
            className="field-select input-focus w-28!"
            aria-label="Seleccione el año"
            value={activeYear}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

          <ImpactCard title="Energía Generada (MWh)" accumulated={periodEnergy} unit="MWh" icon="⚡" />
        </div>
        {monthlyLoading ? null : <MonthlyYieldChart year={activeYear} values={monthlyYield} />}
    </div>
  );
}
