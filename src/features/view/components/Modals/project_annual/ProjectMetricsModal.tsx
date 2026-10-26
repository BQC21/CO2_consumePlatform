"use client";

import { useEffect, useState } from "react";
import { DownloadIcon } from "@/features/view/components/Icons/icons";
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
import { displayMetric, formatMonthLabel, isSuggestedMonth, numberToInput, splitYearMonth, toYearMonth } from "@/lib/utils/helpers/normalization";
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
  
  const [impact, setImpact] = useState({
    reduccion_co2: numberToInput(project.reduccion_co2),
    reduccion_carbon: numberToInput(project.reduccion_carbon),
    arboles: numberToInput(project.arboles),
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false); 

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

  // -------------------------
  // --- Sincronización ------
  // -------------------------

  useEffect(() => {
    let active = true;
    getMonthlyRecords(project.id)
      .then((rows) => {
        if (active) {
          setRecords(sortMonthRecords(rows));
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
  }, [project.id]);

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
  }

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
    <ModalFrame title={`Métricas · ${project.nombre}`} onClose={onClose} wide>
      <form className="grid gap-4" onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>

        {/* Información del inversor */}
        <p className="text-sm text-[var(--color-text-secondary)]">
          Marca del inversor: {project.marca_inversor || "—"}
          {portalUrl ? (
            <>
              {" · "}
              <a className="font-medium text-[var(--color-primary)] underline" href={portalUrl} target="_blank" rel="noopener noreferrer">
                Portal del inversor
              </a>
            </>
          ) : null}
        </p>
        {/* Tipo de instalación */}
        <p className="text-sm text-[var(--color-text-secondary)]">
        Tipo de instalación: {project.tipo_de_sistema || "—"} </p>

        {/* Campo para agregar el mes */}
        <div className="flex flex-wrap items-end gap-2">
          <label className="block">
            <span className="field-label">Ingresar el mes y año bajo este formato: MM.YYYY</span>
            <input
              className="field-input input-focus"
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
            {monthFormatError ? <span className="field-error block">{SUGGESTED_MONTH_MESSAGE}</span> : null}
          </label>
          <button type="button" className="btn-secondary" onClick={addMonth} disabled={loading || Boolean(loadError)}>
            Agregar mes - año
          </button>
          <button type="button" className="btn-secondary" onClick={exportMetrics} disabled={loading || Boolean(loadError)}>
            <DownloadIcon />
            <span>Exportar</span>
          </button>
          <label className="block">
            <span className="field-label">Año</span>
            <select
              className="field-select input-focus w-32!"
              aria-label="Año"
              value={activeYear ?? ""}
              disabled={years.length === 0 || loading || Boolean(loadError)}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
            >
              {years.length === 0 ? <option value="">—</option> : null}
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? <p className="text-sm text-[var(--color-text-secondary)]">Leyendo registros mensuales…</p> : null}
        {loadError ? <p className="field-error">{loadError}</p> : null}

        {/* Tabla de registros mensuales */}
        {!loading && !loadError ? (
          <div className="excel-scroll">
            <table className="excel-table" aria-label="Registros mensuales">
              <thead>
                <tr>
                  <th>Métrica</th>
                  {visibleRecords.map((record) => (
                    <th key={record.mes}>
                      <span className="inline-flex items-center gap-2">
                        {formatMonthLabel(record.mes)}
                        <button
                          type="button"
                          className="text-xs font-medium normal-case tracking-normal text-[var(--color-primary)] underline"
                          aria-label={`Quitar ${formatMonthLabel(record.mes)}`}
                          onClick={() => removeMonth(record.mes)}
                        >
                          Quitar
                        </button>
                      </span>
                    </th>
                  ))}
                  <th>
                    Total
                    {records.length === 0 ? (
                      <span className="mt-1 block text-xs font-normal tracking-normal text-[var(--color-text-secondary)] normal-case">
                        No hay registros mensuales
                      </span>
                    ) : null}
                  </th>
                </tr>
              </thead>
              <tbody>
                {metricRows.map((row) => (
                  <tr key={row.key}>
                    <td className="whitespace-nowrap font-medium">{row.label}</td>
                    {visibleRecords.map((record) => {
                      const key = row.key;
                      return (
                        <td key={`${record.mes}-${key}`}>
                          <input
                            className="field-input input-focus w-28"
                            inputMode="decimal"
                            aria-label={`${row.label} de ${formatMonthLabel(record.mes)}`}
                            value={record[key]}
                            onChange={(event) => updateCell(record.mes, key, event.target.value)}
                          />
                        </td>
                      );
                    })}
                    <td>
                      <span className="excel-cell excel-calculated">{displayMetric(totalFor(row.key))}</span>
                    </td>
                  </tr>
                ))}

                {IMPACT_ROWS.map((row) => (
                  <tr key={row.key}>
                    <td className="whitespace-nowrap font-medium">{row.label}</td>
                    {/* Para las filas de reducción de CO2, reducción de Carbón y árboles plantados
                    dejar columnas vacías según la cantidad de meses considerados */}
                    <td colSpan={visibleRecords.length}></td>
                      <td>
                        <input
                          className="field-input input-focus w-28"
                          inputMode="decimal"
                          aria-label={`${row.label}`}
                          value={impact[row.key]}
                          onChange={(event) => updateImpact(row.key, event.target.value)}
                        />
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {error ? <p className="field-error">{error}</p> : null}

        {/* Botones para cancelar o ejecutar operación */}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={busy || loading || Boolean(loadError)}>
            {busy ? "Guardando…" : "Guardar métricas"}
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
