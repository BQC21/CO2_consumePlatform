import { createClient } from "@/features/model/supabase/client";
import { MonthlyRecordDraft, MonthlyRow } from "@/lib/types/components/components";
import { toNullableNumber } from "@/lib/utils/helpers/normalization";
import { toDraft } from "@/lib/utils/helpers/render/monthTable";
import { MONTH_TABLE } from "@/lib/utils/namingTolerance";

// ---- Obtener registros mensuales
export async function getMonthlyRecords(proyectoId: string): Promise<MonthlyRecordDraft[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(MONTH_TABLE)
    .select("mes, rendimiento_fv, rendimiento_grid, reduccion_co2, reduccion_carbon, arboles")
    .eq("proyecto_id", proyectoId)
    .order("mes", { ascending: true });
  if (error) {
    throw new Error(`Error al leer los registros mensuales: ${error.message}`);
  }
  return (data as MonthlyRow[]).map(toDraft).filter((record) => record.mes);
}

// ----- Reemplazar registros mensuales
export async function replaceMonthlyRecords(proyectoId: string, records: MonthlyRecordDraft[]): Promise<void> {
  const supabase = createClient();
  const rows = records
    .filter((record) => record.mes)
    .map((record) => ({
      proyecto_id: proyectoId,
      mes: `${record.mes}-01`,
      rendimiento_fv: toNullableNumber(record.rendimiento_fv),
      rendimiento_grid: toNullableNumber(record.rendimiento_grid),
      reduccion_co2: toNullableNumber(record.reduccion_co2),
      reduccion_carbon: toNullableNumber(record.reduccion_carbon),
      arboles: toNullableNumber(record.arboles),
    }));

  const { data: existing, error: readError } = await supabase
    .from(MONTH_TABLE)
    .select("id, mes")
    .eq("proyecto_id", proyectoId);
  if (readError) {
    throw new Error(`Error al leer los registros mensuales: ${readError.message}`);
  }

  if (rows.length > 0) {
    const { error } = await supabase.from(MONTH_TABLE).upsert(rows, { onConflict: "proyecto_id,mes" });
    if (error) {
      throw new Error(`Error al guardar los registros mensuales: ${error.message}`);
    }
  }

  const keep = new Set(rows.map((row) => row.mes));
  const removeIds = ((existing ?? []) as { id: string; mes: string }[])
    .filter((row) => !keep.has(String(row.mes).slice(0, 10)))
    .map((row) => row.id);
  if (removeIds.length === 0) {
    return;
  }
  const { error } = await supabase.from(MONTH_TABLE).delete().in("id", removeIds);
  if (error) {
    throw new Error(`Error al guardar los registros mensuales: ${error.message}`);
  }
}
