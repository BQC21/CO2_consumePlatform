import type { MonthlyRecordDraft, MonthlyRow, MonthlyTotals } from "@/lib/types/components/components";
import { numberToInput, splitYearMonth, sumOrNull, toNullableNumber, toYearMonth } from "../normalization";
import type { MetricKey } from "../../consts/metricRows";

/** Convierte un objeto MonthlyRow en un objeto MonthlyRecordDraft. */
export function toDraft(row: MonthlyRow): MonthlyRecordDraft {
    return {
        mes: toYearMonth(row.mes),
        rendimiento_fv: numberToInput(toNullableNumber(row.rendimiento_fv)),
        rendimiento_grid: numberToInput(toNullableNumber(row.rendimiento_grid)),
        rendimiento_carga: numberToInput(toNullableNumber(row.rendimiento_carga)),
    };
}

/** Crea un objeto MonthlyRecordDraft vacío para un mes específico. */
export function emptyMonth(mes: string): MonthlyRecordDraft {
    return {
        mes,
        rendimiento_fv: "",
        rendimiento_grid: "",
        rendimiento_carga: "",
    };
}

/** Compara dos meses en orden cronológico. */
export function compareMonths(left: string, right: string): number {
    const first = splitYearMonth(toYearMonth(left) || left);
    const second = splitYearMonth(toYearMonth(right) || right);
    if (!first || !second) {
        return left.localeCompare(right);
    }
    if (first.year !== second.year) {
        return first.year - second.year;
    }
    return first.month - second.month;
}

/** Ordena un array de MonthlyRecordDraft por mes. */
export function sortMonthRecords(records: MonthlyRecordDraft[]): MonthlyRecordDraft[] {
    return [...records].sort((left, right) => compareMonths(left.mes, right.mes));
}

/** Inserta el mes en orden cronológico: antes del primero, entre medias, o después del último. */
export function insertMonthRecord(records: MonthlyRecordDraft[], mes: string): MonthlyRecordDraft[] {
    const normalized = toYearMonth(mes) || mes.trim();
    const ordered = sortMonthRecords(records);
    const index = ordered.findIndex((record) => compareMonths(record.mes, normalized) > 0);
    const next = emptyMonth(normalized);
    if (index < 0) {
        return [...ordered, next];
    }
    return [...ordered.slice(0, index), next, ...ordered.slice(index)];
}

/** Suma los valores de un campo específico en un array de MonthlyRecordDraft. */
export function sumField(records: MonthlyRecordDraft[], field: keyof Omit<MonthlyRecordDraft, "mes">): string {
    return numberToInput(sumOrNull(records.map((record) => toNullableNumber(record[field]))));
}

/** Calcula los totales mensuales para un array de MonthlyRecordDraft. */
export function monthlyTotals(records: MonthlyRecordDraft[]): MonthlyTotals {
    return {
        rendimiento_fv_total: sumField(records, "rendimiento_fv"),
        rendimiento_grid_total: sumField(records, "rendimiento_grid"),
        carga_consumida_total: sumField(records, "rendimiento_carga"),
    };
}
// Nombrar el archivo a exportarse
export function metricsFilename(nombre: string): string {
    const slug = nombre
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return `metricas-${slug || "proyecto"}.xlsx`;
}

// Agrupar registros mensuales totales
export function summedMetric(records: MonthlyRecordDraft[], key: MetricKey): string {
    const totals = monthlyTotals(records);
    if (key === "rendimiento_carga") {
        return totals.carga_consumida_total;
    }
    if (key === "rendimiento_fv") {
        return totals.rendimiento_fv_total;
    }
    return totals.rendimiento_grid_total;
}

// años disponibles en el selector de periodo
export function periodYears(now = new Date()): number[] {
    const year = now.getFullYear();
    return [year, year - 1];
}