import { DashboardMetrics } from "@/lib/types/components/components";
import { ImpactCard } from "../Form_fields/fields";
import { formatNumber, formatPercent } from "@/lib/utils/helpers/render/format";
import { useState } from "react";

export function EnvironmentalCards({ metrics }: { metrics: DashboardMetrics }) {

  return (
    <div className="grid gap-3">

      <ImpactCard title="Energía Generada (MWh)" accumulated={metrics.produccionAnualMwh} unit="MWh" icon="⚡" />
      <ImpactCard title="CO2 reducido" accumulated={metrics.co2Kg} unit="kg" icon="🚛" />
      <ImpactCard title="Carbón reducido" accumulated={metrics.carbonKg} unit="kg" icon="🏭" />
      <ImpactCard title="Árboles" accumulated={metrics.arboles} unit="" icon="🌳" />
    </div>
  );
}
