"use client";

import { useEffect, useState } from "react";
import { DashboardMetrics } from "@/lib/types/components/components";
import { formatNumber } from "@/lib/utils/helpers/render/format";
import { ExcelCell } from "../Shells/ExcelCell";

function panelTargetKey(year: number) {
    return `paneles-meta-anual:${year}`;
}

export function MetricCards({ metrics }: { metrics: DashboardMetrics }) {
    const year = new Date().getFullYear();
    const [panelesMetaAnual, setPanelesMetaAnual] = useState("");

    useEffect(() => {
        setPanelesMetaAnual(window.localStorage.getItem(panelTargetKey(year)) ?? "");
    }, [year]);

    function commitPanelesMeta(value: string) {
        const next = value.replace(/\D/g, "");
        setPanelesMetaAnual(next);
        window.localStorage.setItem(panelTargetKey(year), next);
    }

    return (
        <div className="grid gap-3 sm:grid-cols-5">
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
        </div>
    );
}
