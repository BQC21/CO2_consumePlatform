import { MonthEnergy } from "@/lib/types/components/components";
import { FACTOR_CARBON_KG_POR_KWH, FACTOR_CO2_KG_POR_KWH, FACTOR_KG_CO2_POR_ARBOL } from "../../consts/factors";

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function splitYearMonth(mes: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(mes);
  if (!match) {
    return null;
  }
  return { year: Number(match[1]), month: Number(match[2]) };
}

/** El típico diario es kWh/día. El mes se reconstruye con los días reales de ese periodo. */
export function energiaMensualKwh(tipicoDiario: number, mes: string): number {
  const parts = splitYearMonth(mes);
  if (!parts || !Number.isFinite(tipicoDiario)) {
    return 0;
  }
  return tipicoDiario * daysInMonth(parts.year, parts.month);
}

export function reduccionCo2Kg(energiaKwh: number): number {
  return energiaKwh * FACTOR_CO2_KG_POR_KWH;
}

export function ahorroCarbonKg(energiaKwh: number): number {
  return energiaKwh * FACTOR_CARBON_KG_POR_KWH;
}

export function arbolesPlantados(co2Kg: number): number {
  if (co2Kg <= 0) {
    return 0;
  }
  return co2Kg / FACTOR_KG_CO2_POR_ARBOL;
}

export function computeMonthEnergy(tipicoDiario: number, mes: string): MonthEnergy {
  const energiaKwh = energiaMensualKwh(tipicoDiario, mes);
  const co2Kg = reduccionCo2Kg(energiaKwh);
  return {
    mes,
    tipicoDiario,
    energiaKwh,
    co2Kg,
    carbonKg: ahorroCarbonKg(energiaKwh),
    arboles: arbolesPlantados(co2Kg),
  };
}

export function sumEnergy(rows: MonthEnergy[]): number {
  return rows.reduce((total, row) => total + row.energiaKwh, 0);
}
