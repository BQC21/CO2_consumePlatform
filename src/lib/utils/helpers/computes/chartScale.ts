/** Tope del eje Y: el mayor valor mensual, redondeado al entero, más 5. */
export function monthlyAxisMax(peak: number): number {
  const safe = Number.isFinite(peak) ? Math.max(peak, 0) : 0;
  return Math.round(safe) + 5;
}
