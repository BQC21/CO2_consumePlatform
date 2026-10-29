"use client";

import { useEffect, useState } from "react";
import { DownloadIcon, TrashIcon } from "@/features/view/components/Icons/icons";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import { createProjectFormStateFromProject } from "@/features/model/mapping/mapping_project";
import {
  getMonthlyRecords,
  replaceMonthlyRecords,
} from "@/features/model/services/monthlyRecordQueries";
import type { Project, ProjectFormState } from "@/lib/types/supabase/project-types";
import { inverterPortalUrl } from "@/lib/utils/options";
import { isOffGrid } from "@/lib/utils/helpers/options";
import { MonthlyRecordDraft } from "@/lib/types/components/components";
import { SUGGESTED_MONTH_MESSAGE } from "@/lib/utils/consts/messages";
import { IMPACT_ROWS, ImpactKey, METRIC_ROWS, MetricKey } from "@/lib/utils/consts/metricRows";
import { downloadWorkbook } from "@/lib/utils/helpers/massive/buildWorkbook";
import { MONTH_NAMES } from "@/lib/utils/consts/monthNames";
import { displayMetric, formatDayMonthYear, formatMonthLabel, isSuggestedMonth, numberToInput, splitYearMonth, toNullableNumber, toYearMonth } from "@/lib/utils/helpers/normalization";
import { insertMonthRecord, metricsFilename, monthlyTotals, sortMonthRecords, summedMetric } from "@/lib/utils/helpers/render/monthTable";

export function ProjectMetricsModal({
  project,
  onUpdate,
  onClose,
}: {
  project: Project;
  onUpdate: (id: string, form: ProjectFormState) => Promise<void>;
  onClose: () => void;
}) {

  // --------------------
  // --- Estados --------
  // --------------------

  const [records, setRecords] = useState<MonthlyRecordDraft[]>([]); // grabaciones de columna mensual
  const [monthDraft, setMonthDraft] = useState(""); // columna mensual
  const [selectedYear, setSelectedYear] = useState<number | null>(null); // año seleccionado
  const [monthToRemove, setMonthToRemove] = useState<string | null>(null);
  
  const [impact, setImpact] = useState({
    reduccion_co2: numberToInput(project.reduccion_co2),
    reduccion_carbon: numberToInput(project.reduccion_carbon),
    arboles: numberToInput(project.arboles),
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [baseline, setBaseline] = useState<string | null>(null); 

  const portalUrl = inverterPortalUrl(project.marca_inversor); // enlace url del portal del inversor
  const years = Array.from(
    new Set(
      records.flatMap((record) => {
        const year = splitYearMonth(record.mes)?.year;
        return year ? [year] : [];
      }),
    ),
  ).sort((left, right) => right - left); // orddenamiento de años a mostrarse en el selector

  // Año activo + Grabaciones visibles
  const activeYear = selectedYear !== null && years.includes(selectedYear) ? selectedYear : (years[0] ?? null);
  const visibleRecords = activeYear === null
    ? []
    : records.filter((record) => splitYearMonth(record.mes)?.year === activeYear);

  // Filas de rendimiento energético a considerarse según el tipo de sistema
  const metricRows = isOffGrid(project.tipo_de_sistema)
    ? METRIC_ROWS.filter((row) => row.key !== "rendimiento_grid")
    : METRIC_ROWS;

  // Formatos de periodo no admisibles
  const monthFormatError = monthDraft.trim() !== "" && !isSuggestedMonth(monthDraft);
  const dirty = baseline !== null && baseline !== JSON.stringify({ records, impact }); // estado de cambios sin guardar
  const orderedRecords = sortMonthRecords(visibleRecords); // grabaciones ordenadas
  const monthBars = Array.from({ length: 12 }, (_, index) => {
    const record = orderedRecords.find((item) => splitYearMonth(item.mes)?.month === index + 1);
    return record ? toNullableNumber(record.rendimiento_fv) ?? 0 : 0;
  }); // barras de rendimiento fotovoltaico
  const barPeak = Math.max(...monthBars, 1); // pico de barras
  const today = new Date(); // fecha actual
  const columnLabel: Record<string, string> = { 
    rendimiento_fv: "Fotovoltaico (kWh)",
    rendimiento_grid: "Red eléctrica (kWh)",
    rendimiento_carga: "Carga (kWh)",
  }; // etiquetas de columnas

  // -------------------------
  // --- Sincronización ------
  // -------------------------

  const co2Baseline = numberToInput(project.reduccion_co2); // baseline de reducción de CO2
  const carbonBaseline = numberToInput(project.reduccion_carbon); // baseline de reducción de carbono
  const treesBaseline = numberToInput(project.arboles); // baseline de árboles

  // Efecto para sincronizar los baselines
  useEffect(() => {
    let active = true;
    const impactBaseline = {
      reduccion_co2: co2Baseline,
      reduccion_carbon: carbonBaseline,
      arboles: treesBaseline,
    };
    getMonthlyRecords(project.id)
      .then((rows) => {
        if (active) {
          const sorted = sortMonthRecords(rows);
          setRecords(sorted);
          setBaseline(JSON.stringify({ records: sorted, impact: impactBaseline }));
          setLoadError("");
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setLoadError(err instanceof Error ? err.message : "No se pudieron leer los registros mensuales.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [project.id, co2Baseline, carbonBaseline, treesBaseline]);

  // -------------------------
  // --- Funciones -----------
  // -------------------------

  // Añadir mes
  function addMonth() {
    const mes = monthDraft.trim();

    // No hay un mes escrito
    if (!mes) {
      setError("Elige un mes.");
      return;
    }

    // No se sube con el formato sugerido
    if (!isSuggestedMonth(mes)) {
      setError(SUGGESTED_MONTH_MESSAGE);
      return;
    }

    // Normalizar a MM.YYYY
    const normalized = toYearMonth(mes);

    // En caso el periodo ya exista en la tabla
    if (records.some((record) => record.mes === normalized)) {
      setError("Ese mes ya está en la tabla.");
      return;
    }
    setError("");
    setRecords((current) => insertMonthRecord(current, normalized));
    setMonthDraft("");

    // Selector de año
    const year = splitYearMonth(normalized)?.year;
    if (year) {
      setSelectedYear(year);
    }
  }

  // Remover mes
  function removeMonth(mes: string) {
    setRecords((current) => current.filter((record) => record.mes !== mes));
    setMonthToRemove(null);
  }

  useEffect(() => {
    if (!monthToRemove) {
      return;
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopImmediatePropagation();
        setMonthToRemove(null);
      }
    }
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [monthToRemove]);

  // Actualizar celda RENDIMIENTO
  function updateCell(mes: string, key: MetricKey, value: string) {
    setRecords((current) =>
      current.map((record) => (record.mes === mes ? { ...record, [key]: value } : record)),
    );
  }

  // Actualizar celda IMPACTO
  function updateImpact(key: ImpactKey, value: string){
    setImpact((current) => ({ ...current, [key]: value }));
  }

  // Almacenar totales
  function totalFor(key: MetricKey): string {
    if (records.length === 0) {
      if (key === "rendimiento_carga") {
        return numberToInput(project.carga_consumida_total);
      }
      if (key === "rendimiento_fv") {
        return numberToInput(project.rendimiento_fv_total);
      }
      return numberToInput(project.rendimiento_grid_total);
    }
    return summedMetric(visibleRecords, key);
  }

  // Exportar métricas
  function exportMetrics() {
    const headers = ["Mes", ...metricRows.map((row) => row.label), ...IMPACT_ROWS.map((row) => row.label)];
    const impactValues = IMPACT_ROWS.map((row) => impact[row.key]);
    const rows = records.length === 0
      ? [["", ...metricRows.map(() => ""), ...impactValues]]
      : [
          ...sortMonthRecords(records).map((record) => [
            formatMonthLabel(record.mes),
            ...metricRows.map((row) => record[row.key]),
            ...IMPACT_ROWS.map(() => ""),
          ]),
          ["Total", ...metricRows.map((row) => summedMetric(records, row.key)), ...impactValues],
        ];
    downloadWorkbook(metricsFilename(project.nombre), headers, rows);
  }

  // Controlar la manipulación por teclado
  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") {
      return;
    }
    const target = event.target;
    if (target instanceof HTMLInputElement && target.getAttribute("aria-label") === "Mes a agregar") {
      event.preventDefault();
      addMonth();
      return;
    }
    if (target instanceof HTMLButtonElement && target.type === "submit") {
      return;
    }
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
      event.preventDefault();
    }
  }

  // Handlers
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await replaceMonthlyRecords(project.id, records);
      const nextTotals = records.length > 0
        ? monthlyTotals(records)
        : {
            rendimiento_fv_total: numberToInput(project.rendimiento_fv_total),
            rendimiento_grid_total: numberToInput(project.rendimiento_grid_total),
            carga_consumida_total: numberToInput(project.carga_consumida_total),
          };
      await onUpdate(project.id, { 
        ...createProjectFormStateFromProject(project), 
        ...nextTotals,
        reduccion_co2: impact.reduccion_co2,
        reduccion_carbon: impact.reduccion_carbon,
        arboles: impact.arboles,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron guardar las métricas.");
      setBusy(false);
    }
  }

  // ---------------------------
  // ---- RENDERIZADO ----------
  // ---------------------------

  return (
    <>
    <ModalFrame
      title={`Métricas · ${project.nombre}${project.ubicacion ? ` – ${project.ubicacion}` : ""}`}
      onClose={onClose}
      wide
      headerExtra={
        <button type="button" className="btn-toolbar" onClick={exportMetrics} disabled={loading || Boolean(loadError)}>
          <DownloadIcon />
          <span>Exportar {activeYear ?? ""}</span>
        </button>
      }
    >
      {/* Formulario de métricas */}
      <form className="grid gap-4" onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
        {/* Encabezado del formulario */}
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-text-secondary)]">
          {/* Inversor */}
          <span>Inversor {project.marca_inversor || "—"}</span>
          {/* Portal del inversor */}
          {portalUrl ? (
            // Enlace al portal del inversor
            <a className="font-semibold text-[var(--color-primary)]" href={portalUrl} target="_blank" rel="noopener noreferrer">
              Portal del inversor ↗
            </a>
          ) : null}
          {/* Tipo de sistema */}
          <span>· {project.tipo_de_sistema || "—"}</span>
          {/* Capacidad instalada */}
          <span>· {project.cap_instalada_kwp === null ? "—" : `${project.cap_instalada_kwp} kWp`}</span>
          {/* Fecha de instalación */}
          <span>· Instalado el {formatDayMonthYear(project.fecha_instalacion)}</span>
          {/* Estado del proyecto */}
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${project.estado === "completado" ? "bg-[#e5f6e8] text-[#1f7a32]" : "bg-[#fff1e8] text-[#c44712]"}`}>
            {project.estado === "completado" ? "Completado" : "En ejecución"}
          </span>
        </p>

        {loading ? <p className="text-sm text-[var(--color-text-secondary)]">Leyendo registros mensuales…</p> : null}
        {loadError ? <p className="field-error">{loadError}</p> : null}

        {!loading && !loadError ? (
          <div className="grid items-start gap-5 lg:grid-cols-5">
            {/* Aside de métricas */}
            <aside className="grid gap-4 lg:col-span-3">
              {/* Selector de año */}
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide text-[var(--color-text-secondary)]">Año</p>
                <div className="flex flex-wrap gap-2">
                  {years.length === 0 ? <span className="text-sm text-[var(--color-text-secondary)]">Sin meses todavía</span> : null}
                  {years.map((year) => {
                    const count = records.filter((record) => splitYearMonth(record.mes)?.year === year).length;
                    const active = year === activeYear;
                    return (
                      <button
                        key={year}
                        type="button"
                        className={`rounded-xl px-3 py-2 text-left text-sm font-semibold ${active ? "bg-[var(--color-secondary)] text-white" : "bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]"}`}
                        aria-pressed={active}
                        onClick={() => setSelectedYear(year)}
                      >
                        {year}
                        <span className={`mt-0.5 block text-xs font-medium ${active ? "text-white/80" : "text-[var(--color-text-secondary)]"}`}>
                          {count} {count === 1 ? "mes" : "meses"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Agregar mes */}
              <div>
                <label className="field-label" htmlFor="month-draft">Agregar mes</label>
                <div className="flex gap-2">
                  <input
                    id="month-draft"
                    className="metric-input text-left"
                    type="text"
                    inputMode="numeric"
                    placeholder="MM.YYYY"
                    value={monthDraft}
                    aria-label="Mes a agregar"
                    aria-invalid={monthFormatError}
                    onChange={(event) => {
                      setMonthDraft(event.target.value);
                      setError("");
                    }}
                  />
                  <button type="button" className="btn-secondary btn-compact shrink-0" onClick={addMonth}>
                    + Agregar
                  </button>
                </div>
                {monthFormatError ? <span className="field-error block">{SUGGESTED_MONTH_MESSAGE}</span> : null}
              </div>

              {/* Gráfico de rendimiento fotovoltaico */}
              <div>
                <p className="text-xs font-semibold tracking-wide text-[var(--color-text-secondary)]">
                  Energía FV {activeYear ?? today.getFullYear()} (kWh)
                </p>
                <div className="mt-2 flex h-16 items-end gap-1" aria-hidden="true">
                  {monthBars.map((value, index) => (
                    <span
                      key={MONTH_NAMES[index]}
                      className="flex-1 rounded-sm"
                      title={`${MONTH_NAMES[index]}: ${value || "sin datos"}`}
                      style={{
                        height: `${Math.max((value / barPeak) * 100, value > 0 ? 12 : 8)}%`,
                        background: value > 0 ? "#f07a1a" : "#e6ebf2",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Impacto ambiental */}
              <div className="grid gap-3">
                <p className="text-xs font-semibold tracking-wide text-[var(--color-secondary)]">Impacto ambiental (ingreso manual)</p>
                {IMPACT_ROWS.map((row) => (
                  <label key={row.key} className="block">
                    <span className="field-label">{row.label}</span>
                    <span className="flex items-center gap-2">
                      <input
                        className="metric-input"
                        inputMode="decimal"
                        aria-label={row.label}
                        value={impact[row.key]}
                        placeholder="Ej.: 0"
                        onChange={(event) => updateImpact(row.key, event.target.value)}
                      />
                      <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">
                        {row.key === "arboles" ? "árboles" : "kg"}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </aside>

            {/* Tabla de datos ingresados */}
            <div className="min-w-0 lg:col-span-2">
              <p className="mb-2 text-xs font-semibold tracking-wide text-[var(--color-text-secondary)]">
                Datos ingresados · rendimientos {activeYear ?? ""} (kWh)
              </p>
              <div className="data-scroll">
                <table className="data-table data-table-compact" aria-label="Registros mensuales">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      {metricRows.map((row) => (
                        <th key={row.key}>{columnLabel[row.key] ?? row.label}</th>
                      ))}
                      <th className="sr-only">Quitar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderedRecords.length === 0 ? (
                      <tr>
                        <td colSpan={metricRows.length + 2} className="text-sm text-[var(--color-text-secondary)]">
                          No hay meses en este año. Agrega uno con el formato MM.YYYY.
                        </td>
                      </tr>
                    ) : (
                      orderedRecords.map((record) => {
                        const parts = splitYearMonth(record.mes);
                        const current = parts !== null && parts.year === today.getFullYear() && parts.month === today.getMonth() + 1;
                        return (
                          <tr key={record.mes} className={current ? "row-current" : undefined}>
                            <td className="whitespace-nowrap font-medium">
                              {parts ? `${String(parts.month).padStart(2, "0")} · ${MONTH_NAMES[parts.month - 1]}` : record.mes}
                              {current ? <span className="ml-2 rounded-full bg-[#ffe3c4] px-2 py-0.5 text-[11px] font-semibold text-[#9a4b12]">Mes en curso</span> : null}
                            </td>
                            {metricRows.map((row) => (
                              <td key={`${record.mes}-${row.key}`}>
                                <input
                                  className="metric-input"
                                  inputMode="decimal"
                                  aria-label={`${row.label} de ${formatMonthLabel(record.mes)}`}
                                  value={record[row.key]}
                                  onChange={(event) => updateCell(record.mes, row.key, event.target.value)}
                                />
                              </td>
                            ))}
                            <td>
                              <button type="button" className="icon-button text-[var(--color-text-secondary)]" aria-label={`Quitar ${formatMonthLabel(record.mes)}`} onClick={() => setMonthToRemove(record.mes)}>
                                <TrashIcon />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                    <tr className="row-total">
                      <td>
                        Total {activeYear ?? ""} ({orderedRecords.length} {orderedRecords.length === 1 ? "mes" : "meses"})
                      </td>
                      {metricRows.map((row) => (
                        <td key={row.key} className="numeric">
                          {displayMetric(totalFor(row.key))}
                        </td>
                      ))}
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        {error ? <p className="field-error">{error}</p> : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={`text-sm font-medium ${dirty ? "text-[#9a4b12]" : "text-[#1f7a32]"}`}>
            {loading ? "Leyendo registros…" : dirty ? "Cambios sin guardar" : "Todo guardado · sin cambios"}
          </p>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button type="submit" className="btn-primary" disabled={busy || loading || Boolean(loadError) || !dirty}>
              {busy ? "Guardando…" : "Guardar métricas"}
            </button>
          </div>
        </div>
      </form>
    </ModalFrame>
    {monthToRemove ? (
      <div className="modal-backdrop" onMouseDown={() => setMonthToRemove(null)}>
        <div
          className="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-month-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <h2 id="remove-month-title" className="mb-4 text-xl font-semibold text-[var(--color-text-primary)]">Quitar mes</h2>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              removeMonth(monthToRemove);
            }}
          >
            <p>
              Se quitará <strong>{formatMonthLabel(monthToRemove)}</strong> de las métricas de este proyecto.
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">El cambio queda en esta tabla hasta que guardes las métricas.</p>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setMonthToRemove(null)}>
                Cancelar
              </button>
              <button type="submit" className="btn-danger">
                Quitar mes
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : null}
    </>
  );
}
