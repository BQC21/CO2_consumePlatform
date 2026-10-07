"use client";

import { useState } from "react";
import { ModalFrame } from "@/features/view/refactor/ModalFrame";
import type { Impact } from "@/lib/types/components/options";
import type { MonthlyEnergy } from "@/lib/types/supabase/monthly-energy";
import type { Project } from "@/lib/types/supabase/project-types";
import { ImpactChart, impactValue } from "@/lib/utils/helpers/graphs/energy";
import { toIsoDate } from "@/lib/utils/helpers/normalization";
import { formatDate, formatNumber } from "@/lib/utils/helpers/render/format";
import { IMPACT_OPTIONS } from "@/lib/utils/options";

export function ProjectMetricsModal({
  project,
  onClose,
}: {
  project: Project;
  months: MonthlyEnergy[];
  onClose: () => void;
}) {

  // Formatos de fecha
  const [dayText, setDayText] = useState(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${now.getFullYear()}`;
  });
  const dayIso = toIsoDate(dayText);
  const dayLabel = dayIso ? formatDate(dayIso) : dayText;

  // Marca seleccionada
  const brand = project.marca_inversor.trim();

  // Indicadores ambientales
  const [impact, setImpact] = useState<Impact>("co2"); 
  const impactOption = IMPACT_OPTIONS.find((option) => option.value === impact) ?? IMPACT_OPTIONS[0];
  const impactTotal = impactValue(project, impact);
  const impactText = impactTotal === null ? "sin dato" : `${formatNumber(impactTotal, 2)} ${impactOption.unit}`.trim();
  const impactPoints = impactTotal === null ? [] : [{ label: dayLabel, value: impactTotal }];

  return (
    <ModalFrame title={`Métricas · ${project.nombre}`} onClose={onClose} wide>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <input
          className="field-input h-9 w-auto"
          type="text"
          inputMode="numeric"
          placeholder="DD/MM/YYYY"
          aria-label="Día"
          value={dayText}
          onChange={(event) => setDayText(event.target.value)}
        />
        <span className="rounded-md bg-[#e8eef6] px-3 py-1 font-semibold text-[#24508f]">
          {brand || "Sin marca de inversor"}
        </span>
        <span className="rounded-md bg-[#d7ebf8] px-3 py-1">FV — kWh</span>
        <span className="rounded-md bg-[#d7ebf8] px-3 py-1">Carga — kWh</span>
        <span className="rounded-md bg-[#d7ebf8] px-3 py-1">Red — kWh</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Gráfica de rendimiento energético */}
        <section>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-secondary)]">
            <p>Serie horaria del día. Se registra desde la API del inversor y se vacía al cerrarlo.</p>
            <ul className="flex gap-3">
              <li className="text-[#a855f7]">Panel solar FV</li>
              <li className="text-[#2563eb]">Carga</li>
              <li className="text-[#22c55e]">Red eléctrica</li>
            </ul>
          </div>
          <p className="grid h-80 place-items-center rounded-xl bg-[var(--color-background)] px-4 text-center text-sm text-[var(--color-text-secondary)]">
            {brand
              ? `No hay lecturas horarias para ${dayLabel}. Esa serie se pedirá día a día a la API de ${brand}.`
              : `No hay lecturas horarias para ${dayLabel}. El proyecto no tiene marca de inversor, así que no hay API a la cual consultar.`}
          </p>
        </section>

        {/* Gráfica para los indicadores ambientales */}
        <section>
          <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs text-[var(--color-text-secondary)]">Indicador ambiental guardado en el proyecto.</p>
            <label>
              <span className="sr-only">Indicador ambiental</span>
              <select
                className="field-select h-9 w-auto"
                aria-label="Indicador ambiental"
                value={impact}
                onChange={(event) => setImpact(event.target.value as Impact)}
              >
                {IMPACT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ImpactChart points={impactPoints} label={impactOption.label} />
          <p className="mt-2 text-center text-sm">
            {impactOption.label}: {impactText}
          </p>
        </section>
      </div>
    </ModalFrame>
  );
}
