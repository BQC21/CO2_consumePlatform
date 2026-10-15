export const METRIC_ROWS = [
    { key: "rendimiento_fv", label: "Rendimiento fotovoltaico (kWh)" },
    { key: "rendimiento_grid", label: "Rendimiento de la red eléctrica (kWh)" },
    { key: "carga", label: "Rendimiento de la carga (kWh)" },
    { key: "reduccion_co2", label: "Reducción de CO2 (kg)" },
    { key: "reduccion_carbon", label: "Reducción de carbón convencional (kg)" },
    { key: "arboles", label: "Árboles equivalentes plantados" },
] as const;

export type MetricKey = (typeof METRIC_ROWS)[number]["key"];