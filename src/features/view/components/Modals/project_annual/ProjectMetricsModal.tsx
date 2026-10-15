"use client";

import { useEffect, useState } from "react";
import { ModalFrame } from "@/features/view/components/Shells/ModalFrame";
import { createProjectFormStateFromProject } from "@/features/model/mapping/mapping_project";
import {
  getMonthlyRecords,
  replaceMonthlyRecords,
} from "@/features/model/services/monthlyRecordQueries";
import type { Project, ProjectFormState } from "@/lib/types/supabase/project-types";
import { inverterPortalUrl } from "@/lib/utils/options";
import { MonthlyRecordDraft } from "@/lib/types/components/components";
import { METRIC_ROWS, MetricKey } from "@/lib/utils/consts/metricRows";
import { displayMetric, formatMonthLabel } from "@/lib/utils/helpers/normalization";
import { emptyMonth, monthlyTotals } from "@/lib/utils/helpers/render/monthTable";

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
  
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false); 

  const portalUrl = inverterPortalUrl(project.marca_inversor); // enlace url del portal del inversor
  const totals = monthlyTotals(records); // Total de valores sumados por cada mes

  // -------------------------
  // --- Sincronización ------
  // -------------------------

  useEffect(() => {
    let active = true;
    getMonthlyRecords(project.id)
      .then((rows) => {
        if (active) {
          setRecords(rows);
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
    if (!mes) {
      setError("Elige un mes.");
      return;
    }
    if (records.some((record) => record.mes === mes)) {
      setError("Ese mes ya está en la tabla.");
      return;
    }
    setError("");
    setRecords((current) => [...current, emptyMonth(mes)].sort((left, right) => left.mes.localeCompare(right.mes)));
    setMonthDraft("");
  }

  // Remover mes
  function removeMonth(mes: string) {
    setRecords((current) => current.filter((record) => record.mes !== mes));
  }

  // Actualizar celda
  function updateCell(mes: string, key: Exclude<MetricKey, "carga">, value: string) {
    setRecords((current) =>
      current.map((record) => (record.mes === mes ? { ...record, [key]: value } : record)),
    );
  }

  // Almacenar totales
  function totalFor(key: MetricKey): string {
    if (key === "rendimiento_carga") {
      return totals.carga_consumida_total;
    }
    if (key === "rendimiento_fv") {
      return totals.rendimiento_fv_total;
    }
    if (key === "rendimiento_grid") {
      return totals.rendimiento_grid_total;
    }
    return totals[key];
  }

  // Handlers
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await replaceMonthlyRecords(project.id, records);
      const nextTotals = monthlyTotals(records);
      await onUpdate(project.id, { ...createProjectFormStateFromProject(project), ...nextTotals });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron guardar las métricas.");
      setBusy(false);
    }
  }

  return (
    <ModalFrame title={`Métricas · ${project.nombre}`} onClose={onClose} wide>
      <form className="grid gap-4" onSubmit={handleSubmit}>

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

        {/* Campo para agregar el mes */}
        <div className="flex flex-wrap items-end gap-2">
          <label className="block">
            <span className="field-label">Mes</span>
            <input
              className="field-input input-focus"
              type="month"
              value={monthDraft}
              aria-label="Mes a agregar"
              onChange={(event) => setMonthDraft(event.target.value)}
            />
          </label>
          <button type="button" className="btn-secondary" onClick={addMonth} disabled={loading || Boolean(loadError)}>
            Agregar mes
          </button>
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
                  {records.map((record) => (
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
                {METRIC_ROWS.map((row) => (
                  <tr key={row.key}>
                    <td className="whitespace-nowrap font-medium">{row.label}</td>
                    {records.map((record) => {
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
