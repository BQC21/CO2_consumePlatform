import { MonthEnergy } from "@/lib/types/components/components";
import { daysInMonth, splitYearMonth } from "../normalization";

/** El típico diario es kWh/día. El mes se reconstruye con los días reales de ese periodo. */
export function energiaMensualKwh(tipicoDiario: number, mes: string): number {
  const parts = splitYearMonth(mes);
  if (!parts || !Number.isFinite(tipicoDiario)) {
    return 0;
  }
  return tipicoDiario * daysInMonth(parts.year, parts.month);
}

export function computeMonthEnergy(tipicoDiario: number, mes: string,
  co2Kg: number, carbonKg: number, arboles: number
): MonthEnergy {
  const energiaKwh = energiaMensualKwh(tipicoDiario, mes);
  return {
    mes,
    tipicoDiario,
    energiaKwh,
    co2Kg,
    carbonKg,
    arboles,
  };
}

export function sumEnergy(rows: MonthEnergy[]): number {
  return rows.reduce((total, row) => total + row.energiaKwh, 0);
}
