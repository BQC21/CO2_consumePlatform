import { createClient } from "@/features/model/supabase/client";
import type { MonthlyEnergy } from "@/lib/types/supabase/monthly-energy";
import { toNullableNumber } from "@/lib/utils/helpers/normalization";
import { MONTH_TABLE } from "@/lib/utils/namingTolerance";

type MonthlyRow = {
  proyecto_id: string | null;
  mes: string | null;
  rendimiento_fv: number | string | null;
  rendimiento_grid: number | string | null;
  consumo_carga: number | string | null;
};

export async function getMonthlyEnergy(): Promise<MonthlyEnergy[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(MONTH_TABLE)
    .select("proyecto_id, mes, rendimiento_fv, rendimiento_grid, consumo_carga");
  if (error) {
    throw new Error(`Error al leer la energía mensual: ${error.message}`);
  }
  
  return (data as MonthlyRow[]).flatMap((row) => {
    if (!row.proyecto_id || !row.mes) {
      return [];
    }
    return [{
      proyecto_id: row.proyecto_id,
      mes: row.mes,
      rendimiento_fv: toNullableNumber(row.rendimiento_fv) ?? 0,
      rendimiento_grid: toNullableNumber(row.rendimiento_grid) ?? 0,
      consumo_carga: toNullableNumber(row.consumo_carga) ?? 0,
    }];
  });
}
