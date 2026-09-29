import { formatNumber, formatPercent } from "@/lib/utils/helpers/render/format";

export function Progress({ label, current, target, percent, color }: { 
    label: string; current: number; target: number; percent: number; color: string }) {
    return (
        <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs" style={{ color: "var(--color-text-on-dark-muted)" }}>
                <span className="numeric">
                {formatNumber(current, 0)} / {formatNumber(target, 0)}
                </span>
                <span>
                {label} · {formatPercent(percent)}
                </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: `${Math.min(percent, 100)}%`, background: color }} />
            </div>
        </div>
    );
}