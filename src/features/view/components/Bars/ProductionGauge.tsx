import { formatNumber } from "@/lib/utils/helpers/render/format";

export function ProductionGauge({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <figure className="text-center">
        <svg viewBox="0 0 120 120" className="mx-auto h-36 w-36" aria-hidden="true">
            <circle cx="60" cy="60" r="54" fill={color} />
            <text x="60" y="64" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">
            {formatNumber(value, 3)}
            </text>
        </svg>
        <figcaption className="text-sm" style={{ color: "var(--color-text-on-dark-muted)" }}>
            {label}
            <span className="mt-1 block text-xs">MWh</span>
        </figcaption>
        </figure>
    );
}