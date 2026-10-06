import { DashboardMetrics } from "@/lib/types/components/components";
import { ImpactCard } from "../Form_fields/fields";

export function EnvironmentalCards({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid gap-3">
      <ImpactCard title="CO2 reducido" annual={metrics.co2Kg} accumulated={metrics.co2Kg} unit="kg" icon="🚛" />
      <ImpactCard title="Carbón reducido" annual={metrics.carbonKg} accumulated={metrics.carbonKg} unit="kg" icon="🏭" />
      <ImpactCard title="Árboles" annual={metrics.arboles} accumulated={metrics.arboles} unit="" icon="🌳" />
    </div>
  );
}
