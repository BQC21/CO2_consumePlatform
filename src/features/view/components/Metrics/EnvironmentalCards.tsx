import { DashboardMetrics, MonthlyRecordDraft } from "@/lib/types/components/components";
import { ImpactCard } from "../Form_fields/fields";
import { useMemo, useState } from "react";
import { massFromKg } from "@/lib/utils/helpers/normalization";
import { energyMwhForPeriod, monthlyEnergyMwh, yearsFromOldestPeriod } from "@/lib/utils/helpers/computes/dashboard_metrics";
import { MonthlyYieldChart } from "./MonthlyYieldChart";

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
    // const [panelesMetaAnual, setPanelesMetaAnual] = useState("");
    // const [loadedTargetYear, setLoadedTargetYear] = useState<number | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const years = useMemo(() => yearsFromOldestPeriod(monthlyRecords, year), [monthlyRecords, year]);
    const activeYear = selectedYear !== null && years.includes(selectedYear) ? selectedYear : year;

    // if (typeof window !== "undefined" && loadedTargetYear !== year) {
    //   setLoadedTargetYear(year);
    //   setPanelesMetaAnual(window.localStorage.getItem(panelTargetKey(year)) ?? "");
    // }

    // Propieades para trackear progreso en paneles instalados
    // const installed = metrics.paneles ?? 0; // paneles instalados
    // const target = Number(panelesMetaAnual); // Paneles objetivo
    // const hasTarget = panelesMetaAnual !== "" && Number.isFinite(target) && target > 0; // 
    // const progress = hasTarget ? (installed / target) * 100 : 0;
    // const barWidth = Math.min(Math.max(progress, 0), 100);

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

    // function commitPanelesMeta(value: string) {
    //     const next = value.replace(/\D/g, "");
    //     setPanelesMetaAnual(next);
    //     window.localStorage.setItem(panelTargetKey(year), next);
    // }

  return (
    <div className="grid gap-3">

      {/* <h1 className= "text-2xl font-semibold md:text-2xl"> Paneles a instalar ( 
        <strong className="font-bold text-blue-500">{year}</strong>) </h1>

      <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
        <div className="mt-2 flex items-center gap-2">
            <ExcelCell
                kind="editable"
                ariaLabel={`Cantidad de paneles a instalar durante el ${year}`}
                value={panelesMetaAnual}
                onChange={commitPanelesMeta}
                onCommit={commitPanelesMeta}
            />
            <span className="text-sm text-[var(--color-text-secondary)]">paneles</span>
        </div>
      </article>

      <h1 className= "text-2xl font-semibold md:text-2xl"> Avance vs meta (<strong className="font-bold text-blue-500">{year}</strong>) </h1>
      
      <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">

        <p className="mt-2 numeric text-2xl font-bold">{hasTarget ? formatPercent(progress) : "—"}</p>
        <div
            className="mt-2 h-2 overflow-hidden rounded-full"
            style={{ background: "var(--color-surface-muted)" }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(barWidth)}
            aria-valuetext={hasTarget ? formatPercent(progress) : "Sin meta anual"}
            aria-label={`Porcentaje de paneles instalados respecto a la meta de ${year}`}
        >
            <div
                className="h-full rounded-full"
                style={{
                    width: `${barWidth}%`,
                    background: progress >= 100 ? "var(--color-success)" : "var(--color-secondary)",
                }}
            />
        </div>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            {hasTarget
                ? `${formatNumber(installed, 0)} de ${formatNumber(target, 0)} paneles`
                : "Define la meta anual"}
        </p>
      </article> */}

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
