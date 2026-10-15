import { DashboardMetrics } from "@/lib/types/components/components";
import { ImpactCard } from "../Form_fields/fields";
import { panelTargetKey } from "@/lib/utils/helpers/render/format";
import { useEffect, useState } from "react";
import { ExcelCell } from "../Shells/ExcelCell";
import { formatNumber, formatPercent } from "@/lib/utils/helpers/normalization";

export function EnvironmentalCards({ metrics }: { metrics: DashboardMetrics }) {

    // -----------------------
    // --- Estados -----------
    // -----------------------

    const year = new Date().getFullYear();
    const [panelesMetaAnual, setPanelesMetaAnual] = useState("");

    // Propieades para trackear progreso en paneles instalados
    const installed = metrics.paneles ?? 0; // paneles instalados
    const target = Number(panelesMetaAnual); // Paneles objetivo
    const hasTarget = panelesMetaAnual !== "" && Number.isFinite(target) && target > 0; // 
    const progress = hasTarget ? (installed / target) * 100 : 0;
    const barWidth = Math.min(Math.max(progress, 0), 100);

    // --------------------------
    // --- Sincronización -------
    // --------------------------

    // Persistir la meta anual de paneles solares
    useEffect(() => {
      setPanelesMetaAnual(window.localStorage.getItem(panelTargetKey(year)) ?? "");
    }, [year]);

    function commitPanelesMeta(value: string) {
        const next = value.replace(/\D/g, "");
        setPanelesMetaAnual(next);
        window.localStorage.setItem(panelTargetKey(year), next);
    }

  return (
    <div className="grid gap-3">

      <h1 className= "text-2xl font-semibold md:text-2xl"> Paneles a instalar ( 
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
      </article>

      <h1 className= "mt-5 text-2xl font-semibold md:text-2xl"> Impacto ambiental acumulado </h1>

      <ImpactCard title="Energía Generada (MWh)" accumulated={metrics.produccionAnualMwh} unit="MWh" icon="⚡" />
      <ImpactCard title="CO2 reducido" accumulated={metrics.co2Kg} unit="kg" icon="🚛" />
      <ImpactCard title="Carbón reducido" accumulated={metrics.carbonKg} unit="kg" icon="🏭" />
      <ImpactCard title="Árboles" accumulated={metrics.arboles} unit="" icon="🌳" />
    </div>
  );
}
