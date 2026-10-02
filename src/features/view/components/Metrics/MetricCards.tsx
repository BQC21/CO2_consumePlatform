import { DashboardMetrics } from "@/lib/types/components/components";
import { formatNumber } from "@/lib/utils/helpers/render/format";

export function MetricCards({ metrics }: { metrics: DashboardMetrics }) {
    return (
        <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
                <p className="text-[1.65rem] font-medium tracking-wide text-[var(--color-text-secondary)]">Proyectos registrados</p>
                <p className="mt-5 numeric text-4xl font-bold">{metrics.proyectosRegistrados}</p>
            </article>
            <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
                <p className="text-[1.65rem] font-medium tracking-wide text-[var(--color-text-secondary)]">Completados</p>
                <p className="mt-5 numeric text-4xl font-bold">{metrics.proyectosCompletados}</p>
            </article>
            <article className="rounded-[var(--radius-lg)] bg-white px-4 py-3 text-[var(--color-text-primary)]">
                <p className="text-[1.65rem] font-medium tracking-wide text-[var(--color-text-secondary)]">Capacidad instalada</p>
                <p className="mt-5 numeric text-4xl font-bold">{formatNumber(metrics.capacidadInstaladaKwp, 1)} kWp</p>
            </article>
        </div>
    );
}
