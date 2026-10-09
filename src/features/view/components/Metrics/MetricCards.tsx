"use client";

import { useEffect, useState } from "react";
import { DashboardMetrics } from "@/lib/types/components/components";
import { formatNumber, formatPercent } from "@/lib/utils/helpers/render/format";
import { ExcelCell } from "../Shells/ExcelCell";

function panelTargetKey(year: number) {
    return `paneles-meta-anual:${year}`;
}

export function MetricCards({ metrics }: { metrics: DashboardMetrics }) {
    // -----------------------
    // --- Estados -----------
    // -----------------------

    const year = new Date().getFullYear();
    const [panelesMetaAnual, setPanelesMetaAnual] = useState("");

    // Propieades para trackear progreso en paneles instalados
    const installed = metrics.paneles ?? 0; // paneles instalados
    const target = Number(panelesMetaAnual); // Paneles objetivo
    const hasTarget = panelesMetaAnual !== "" && Number.isFinite(target) && target > 0; // hay objetivo ?
    const progress = hasTarget ? (installed / target) * 100 : 0; // progreso
    const barWidth = Math.min(Math.max(progress, 0), 100); // tramo de la barra a colorearse

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
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
                <p className="text-sm font-medium tracking-wide text-[var(--color-text-secondary)]">Proyectos registrados</p>
                <p className="mt-2 numeric text-3xl font-bold">{metrics.proyectosRegistrados}</p>
            </article>
            <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
                <p className="text-sm font-medium tracking-wide text-[var(--color-text-secondary)]">Completados</p>
                <p className="mt-2 numeric text-3xl font-bold">{metrics.proyectosCompletados}</p>
            </article>
            <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
                <p className="text-sm font-medium tracking-wide text-[var(--color-text-secondary)]">Capacidad instalada</p>
                <p className="mt-2 numeric text-3xl font-bold">{formatNumber(metrics.capacidadInstaladaKwp, 1)} kWp</p>
            </article>
            <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
                <p className="text-sm font-medium tracking-wide text-[var(--color-text-secondary)]">Paneles instalados</p>
                <p className="mt-2 numeric text-3xl font-bold">{formatNumber(metrics.paneles, 0)} paneles</p>
            </article>
            <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
                <p className="text-sm font-medium tracking-wide text-[var(--color-text-secondary)]">
                    Cantidad de paneles a instalar durante el <strong className="font-bold text-blue-500">{year}</strong>
                </p>
                <div className="mt-2 flex items-center gap-2">
                    <ExcelCell
                        kind="editable"
                        ariaLabel={`Cantidad de paneles a instalar durante el ${year}`}
                        value={panelesMetaAnual}
                        onCommit={commitPanelesMeta}
                    />
                    <span className="text-sm text-[var(--color-text-secondary)]">paneles</span>
                </div>
            </article>
            <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
                <p className="text-sm font-medium tracking-wide text-[var(--color-text-secondary)]">
                    Avance respecto a la meta de <strong className="font-bold text-blue-500">{year}</strong>
                </p>
                <p className="mt-2 numeric text-3xl font-bold">{hasTarget ? formatPercent(progress) : "—"}</p>
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
        </div>
    );
}
