import { DashboardMetrics, MonthlyRecordDraft } from "@/lib/types/components/components";
import { ImpactCard } from "../Form_fields/fields";
import { panelTargetKey } from "@/lib/utils/helpers/render/format";
import { useMemo, useState } from "react";
import { ExcelCell } from "../Shells/ExcelCell";
import { formatNumber, formatPercent, massFromKg } from "@/lib/utils/helpers/normalization";
import { MONTH_NAMES } from "@/lib/utils/consts/monthNames";
import { energyMwhForPeriod, yearsInMonthlyRecords } from "@/lib/utils/helpers/computes/dashboard_metrics";

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
    const [periodMode, setPeriodMode] = useState<"anio" | "mes">("anio");
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const years = useMemo(() => yearsInMonthlyRecords(monthlyRecords), [monthlyRecords]);
    const activeYear = selectedYear !== null && years.includes(selectedYear) ? selectedYear : (years[0] ?? null);

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
      // condicionar para aquellas propiedades que solo son acumulativas
      if (monthlyRecords.length === 0) {
        return metrics.produccionAnualMwh;
      }
      // Si es por año
      if (periodMode === "anio") {
        return activeYear === null
          ? metrics.produccionAnualMwh
          : energyMwhForPeriod(monthlyRecords, { mode: "anio", year: activeYear });
      }
      return energyMwhForPeriod(monthlyRecords, { mode: "mes", month: selectedMonth });
    }, [activeYear, metrics.produccionAnualMwh, monthlyRecords, periodMode, selectedMonth]);

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
        <ImpactCard title="Árboles" accumulated={metrics.arboles} unit="" icon="🌳" />

        <div className="flex flex-wrap items-center gap-2">
            <select
              className="field-select input-focus w-28!"
              aria-label="Ver impacto por año o por mes"
              value={periodMode}
              onChange={(event) => setPeriodMode(event.target.value === "mes" ? "mes" : "anio")}
            >
              <option value="anio">Año</option>
              <option value="mes">Mes</option>
            </select>
            {periodMode === "anio" ? (
              <select
                className="field-select input-focus w-28!"
                aria-label="Año"
                value={activeYear ?? ""}
                disabled={monthlyLoading || years.length === 0}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
              >
                {years.length === 0 ? <option value="">Sin años</option> : null}
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <select
                className="field-select input-focus w-36!"
                aria-label="Mes"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(Number(event.target.value))}
              >
                {MONTH_NAMES.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            )}
        </div>

          <ImpactCard title="Energía Generada (MWh)" accumulated={periodEnergy} unit="MWh" icon="⚡" />
        </div>
    </div>
  );
}
