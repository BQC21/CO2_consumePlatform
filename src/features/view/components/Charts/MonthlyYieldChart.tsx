import { useState } from "react";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import { MONTH_NAMES } from "@/lib/utils/consts/monthNames";
import { formatNumber } from "@/lib/utils/helpers/normalization";

const BAR_COLOR = "#ff8c1a";
const LINE_COLOR = "#e10600";

export function MonthlyYieldChart({ year, values }: { year: number; values: number[] }) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const width = 280;
  const height = 156;
  const padL = 36;
  const padR = 6;
  const padT = 12;
  const padB = 22;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const peak = Math.max(...values, 0);
  const scaleMax = peak === 0 ? 1 : peak * 1.15;
  const slot = innerW / values.length;
  const barWidth = slot * 0.62;
  const digits = scaleMax >= 100 ? 0 : scaleMax >= 10 ? 1 : 2;

  const points = values.map((value, index) => {
    const x = padL + slot * index + slot / 2;
    const y = padT + innerH - (Math.max(value, 0) / scaleMax) * innerH;
    return { x, y, value };
  });

  const ticks = [scaleMax, scaleMax / 2, 0];

  return (
    <figure className="rounded-2xl border border-white/10 bg-black/35 px-3 py-3 text-white">
      <figcaption className="text-xs font-semibold tracking-wide text-white/80">
        Rendimiento FV por mes ({year})
      </figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-2 w-full"
        role="group"
        aria-label={`Rendimiento fotovoltaico mensual de ${year}, en megavatios-hora`}
      >
        {ticks.map((tick) => {
          const y = padT + innerH - (tick / scaleMax) * innerH;
          return (
            <g key={tick}>
              <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <text x={padL - 4} y={y + 3} textAnchor="end" fill="rgba(255,255,255,0.7)" fontSize="8">
                {formatNumber(tick, digits)}
              </text>
            </g>
          );
        })}
        {points.map((point, index) => {
          const barHeight = Math.max(padT + innerH - point.y, 0);
          return (
            <g key={MONTH_NAMES[index]}>
              <title>{`${MONTH_NAMES[index]} ${year}: ${formatNumber(point.value, 2)} MWh`}</title>
              <rect
                x={point.x - barWidth / 2}
                y={point.y}
                width={barWidth}
                height={barHeight}
                rx="2"
                fill={BAR_COLOR}
              />
              <text x={point.x} y={height - 6} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="8">
                {MONTH_NAMES[index].slice(0, 3)}
              </text>
            </g>
          );
        })}
        <polyline
          points={points.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((point, index) => (
          <g
            key={MONTH_NAMES[index]}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
            aria-label={`Ver el total de ${MONTH_NAMES[index]} ${year}`}
            onClick={() => setSelectedMonth(index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedMonth(index);
              }
            }}
          >
            <circle cx={point.x} cy={point.y} r="9" fill="transparent" />
            <circle cx={point.x} cy={point.y} r={selectedMonth === index ? 4.5 : 3} fill={LINE_COLOR} />
          </g>
        ))}
      </svg>
      {selectedMonth !== null ? (
        <ModalFrame title={`${MONTH_NAMES[selectedMonth]} ${year}`} onClose={() => setSelectedMonth(null)}>
          <p className="text-sm text-[var(--color-text-secondary)]">Total del mes</p>
          <p className="numeric mt-1 text-3xl font-bold text-[var(--color-text-primary)]">
            {formatNumber(values[selectedMonth], 2)} MWh
          </p>
        </ModalFrame>
      ) : null}
    </figure>
  );
}
