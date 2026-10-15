import { MonthlyRecordDraft, MonthlyRow, MonthlyTotals } from "@/lib/types/components/components";
import { numberToInput, sumOrNull, toNullableNumber, toYearMonth } from "../normalization";
import { MetricKey } from "../../consts/metricRows";

export function toDraft(row: MonthlyRow): MonthlyRecordDraft {
    return {
        mes: toYearMonth(row.mes),
        rendimiento_fv: numberToInput(toNullableNumber(row.rendimiento_fv)),
        rendimiento_grid: numberToInput(toNullableNumber(row.rendimiento_grid)),
        reduccion_co2: numberToInput(toNullableNumber(row.reduccion_co2)),
        reduccion_carbon: numberToInput(toNullableNumber(row.reduccion_carbon)),
        arboles: numberToInput(toNullableNumber(row.arboles)),
    };
}

export function emptyMonth(mes: string): MonthlyRecordDraft {
    return {
        mes,
        rendimiento_fv: "",
        rendimiento_grid: "",
        reduccion_co2: "",
        reduccion_carbon: "",
        arboles: "",
    };
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
    const rendimiento_fv_total = sumField(records, "rendimiento_fv");
    const rendimiento_grid_total = sumField(records, "rendimiento_grid");
    return {
        rendimiento_fv_total,
        rendimiento_grid_total,
        carga_consumida_total: addMetricValues(rendimiento_fv_total, rendimiento_grid_total),
        reduccion_co2: sumField(records, "reduccion_co2"),
        reduccion_carbon: sumField(records, "reduccion_carbon"),
        arboles: sumField(records, "arboles"),
    };
}

export function monthValue(record: MonthlyRecordDraft, key: MetricKey): string {
    if (key === "carga") {
        return addMetricValues(record.rendimiento_fv, record.rendimiento_grid);
    }
    return record[key];
}
