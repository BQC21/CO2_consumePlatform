/** Lectura de `registros_mensuales` usada por el dashboard y las gráficas. */
export type MonthlyEnergy = {
  proyecto_id: string;
  mes: string;
  rendimiento_fv: number;
  rendimiento_grid: number;
  consumo_carga: number;
};
