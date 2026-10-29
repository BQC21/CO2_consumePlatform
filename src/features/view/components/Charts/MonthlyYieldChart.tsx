"use client";

import { useState } from "react";
import { MONTH_NAMES, MONTH_SHORT } from "@/lib/utils/consts/monthNames";
import { formatNumber } from "@/lib/utils/helpers/normalization";

const BAR_COLOR = "#f07a1a";

function niceMax(peak: number): number {
  if (peak <= 0) {
    return 5;
  }
  const padded = peak * 1.25;
  const power = 10 ** Math.floor(Math.log10(padded));
  const normalized = padded / power;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * power;
}

export function MonthlyYieldChart({ year, values }: { year: number; values: number[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 720;
  const height = 280;
  const padL = 46;
  const padR = 12;
  const padT = 28;
  const padB = 32;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const now = new Date();
  const scaleMax = niceMax(Math.max(...values, 0));
  const slot = innerW / 12;
  const barWidth = slot * 0.62;
  const digits = scaleMax >= 100 ? 0 : 1;
  const ticks = [scaleMax, scaleMax / 2, 0];

  return (
    <figure>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <figcaption className="text-xl font-semibold text-white md:text-2xl">
          Energía generada por mes (MWh)
          <span className="year-pill">{year}</span>
        </figcaption>
        <div className="flex flex-wrap items-center gap-4 text-base text-white/75">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: BAR_COLOR }} />
            Energía generada (MWh)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-white/50" />
            Sin datos (mes futuro)
          </span>
        </div>
      </div>
      <div className="relative mt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          role="group"
          aria-label={`Energía generada por mes en ${year}, en megavatios-hora`}
        >
          <text x="14" y={padT + innerH / 2} fill="rgba(255,255,255,0.55)" fontSize="11" transform={`rotate(-90 14 ${padT + innerH / 2})`}>
            MWh
          </text>
          {ticks.map((tick) => {
            const y = padT + innerH - (tick / scaleMax) * innerH;
            return (
              <g key={tick}>
                <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <text x={padL - 8} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.6)" fontSize="11">
                  {formatNumber(tick, digits)}
                </text>
              </g>
            );
          })}
          {values.map((value, index) => {
            const future = year > now.getFullYear() || (year === now.getFullYear() && index > now.getMonth());
            const x = padL + slot * index + slot / 2;
            const barHeight = future ? innerH * 0.72 : Math.max((Math.max(value, 0) / scaleMax) * innerH, value > 0 ? 4 : 0);
            const y = padT + innerH - barHeight;
            const label = MONTH_SHORT[index] ? MONTH_SHORT[index].charAt(0).toUpperCase() + MONTH_SHORT[index].slice(1) : "";
            return (
              <g key={MONTH_NAMES[index]}>
                {future ? (
                  <rect
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="6"
                    fill="rgba(255,255,255,0.04)"
                    stroke="rgba(255,255,255,0.28)"
                    strokeDasharray="4 3"
                  />
                ) : (
                  <rect x={x - barWidth / 2} y={y} width={barWidth} height={barHeight} rx="6" fill={BAR_COLOR} />
                )}
                {future ? (
                  <text x={x} y={y + barHeight / 2} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10">
                    sin datos
                  </text>
                ) : value > 0 ? (
                  <text x={x} y={y - 6} textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
                    {formatNumber(value, value >= 10 ? 1 : 1)}
                  </text>
                ) : null}
                <text x={x} y={height - 8} textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="12">
                  {label}
                </text>
                <rect
                  x={padL + slot * index}
                  y={padT}
                  width={slot}
                  height={innerH}
                  fill="transparent"
                  role="button"
                  tabIndex={0}
                  aria-label={future ? `${MONTH_NAMES[index]} ${year}: sin datos` : `${MONTH_NAMES[index]} ${year}: ${formatNumber(value, 2)} MWh`}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover((current) => (current === index ? null : current))}
                  onFocus={() => setHover(index)}
                  onBlur={() => setHover((current) => (current === index ? null : current))}
                />
              </g>
            );
          })}
        </svg>
        {hover !== null ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-xl bg-white px-3 py-2 text-[var(--color-text-primary)] shadow-[var(--shadow-md)]"
            style={{ left: `${((padL + slot * hover + slot / 2) / width) * 100}%`, top: "18%" }}
          >
            <p className="text-xs text-[var(--color-text-secondary)]">{MONTH_NAMES[hover]} {year}</p>
            <p className="numeric text-sm font-bold">
              {year > now.getFullYear() || (year === now.getFullYear() && hover > now.getMonth())
                ? "Sin datos"
                : `${formatNumber(values[hover], 2)} MWh`}
            </p>
          </div>
        ) : null}
      </div>
    </figure>
  );
}
