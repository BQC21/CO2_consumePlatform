import { LabelPoint } from "@/lib/types/components/components";
import { LABEL_HEIGHT } from "@/lib/utils/consts/peru-map";

// Ancho del texto
function labelWidth(nombre: string): number {
  return Math.max(22, nombre.length * 3.35);
}

/** Separa etiquetas que comparten caja, sin salir del viewBox del mapa. */
export function separateLabels(points: LabelPoint[], iterations = 48): LabelPoint[] {
  const nodes = points.map((point) => ({ ...point }));

  for (let step = 0; step < iterations; step += 1) {
    for (let left = 0; left < nodes.length; left += 1) {
      for (let right = left + 1; right < nodes.length; right += 1) {
        const a = nodes[left];
        const b = nodes[right];
        const overlapX = (labelWidth(a.nombre) + labelWidth(b.nombre)) / 2 - Math.abs(a.x - b.x);
        const overlapY = LABEL_HEIGHT - Math.abs(a.y - b.y);
        if (overlapX <= 0 || overlapY <= 0) {
          continue;
        }
        if (overlapY <= overlapX) {
          const push = overlapY / 2 + 0.8;
          const sign = a.y >= b.y ? 1 : -1;
          a.y += sign * push;
          b.y -= sign * push;
        } else {
          const push = overlapX / 2 + 0.8;
          const sign = a.x >= b.x ? 1 : -1;
          a.x += sign * push;
          b.x -= sign * push;
        }
      }
    }
  }

  return nodes.map((node) => ({
    ...node,
    x: Math.min(400, Math.max(18, node.x)),
    y: Math.min(628, Math.max(14, node.y)),
  }));
}
