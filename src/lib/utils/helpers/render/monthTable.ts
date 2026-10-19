import type { MonthlyRecordDraft, MonthlyRow, MonthlyTotals } from "@/lib/types/components/components";
import { numberToInput, splitYearMonth, sumOrNull, toNullableNumber, toYearMonth } from "../normalization";
import type { MetricKey } from "../../consts/metricRows";

export function toDraft(row: MonthlyRow): MonthlyRecordDraft {
    return {
        mes: toYearMonth(row.mes),
        rendimiento_fv: numberToInput(toNullableNumber(row.rendimiento_fv)),
        rendimiento_grid: numberToInput(toNullableNumber(row.rendimiento_grid)),
        rendimiento_carga: numberToInput(toNullableNumber(row.rendimiento_carga)),
    };
}

export function emptyMonth(mes: string): MonthlyRecordDraft {
    return {
        mes,
        rendimiento_fv: "",
        rendimiento_grid: "",
        rendimiento_carga: "",
    };
}

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

export function sumField(records: MonthlyRecordDraft[], field: keyof Omit<MonthlyRecordDraft, "mes">): string {
    return numberToInput(sumOrNull(records.map((record) => toNullableNumber(record[field]))));
}

export function addMetricValues(left: string, right: string): string {
    const first = toNullableNumber(left);
    const second = toNullableNumber(right);
    if (first === null && second === null) {
        return "";
    }
    return String((first ?? 0) + (second ?? 0));
}

export function monthlyTotals(records: MonthlyRecordDraft[]): MonthlyTotals {
    return {
        rendimiento_fv_total: sumField(records, "rendimiento_fv"),
        rendimiento_grid_total: sumField(records, "rendimiento_grid"),
        carga_consumida_total: sumField(records, "rendimiento_carga"),
    };
}

export function monthValue(record: MonthlyRecordDraft, key: MetricKey): string {
    return record[key];
}
