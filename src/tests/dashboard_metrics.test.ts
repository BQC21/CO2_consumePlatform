import { Meta } from "@/lib/types/supabase/meta-types";
import { Project } from "@/lib/types/supabase/project-types";
import { ProjectMonth } from "@/lib/types/supabase/projectMonth-types";
import { computeDashboardMetrics, computeProgress } from "@/lib/utils/helpers/computes/dashboard_metrics";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

const meta: Meta = { id: "meta", anio: 2026, meta_paneles_anual: 1000, meta_paneles_mensual: 100 };

const project: Project = {
  id: "p1",
  nombre: "Algarrobos — Chorrillos",
  ubicacion: "Lima",
  distrito: "Chorrillos",
  tipo_de_sistema: "Híbrido",
  pot_nominal_kw: 5,
  cap_instalada_kwp: 2.84,
  fecha_instalacion: "2026-05-03",
  marca_inversor: "GOODWE",
  paneles_instalados: 810,
  estado: "en_ejecucion",
  descripcion: "",
  updated_at: "",
};

const month: ProjectMonth = {
  id: "m1",
  proyecto_id: "p1",
  mes: "2026-09",
  tipico_diario: 10,
  pot_nominal_kw: 5,
  updated_at: "",
};

describe("métricas del dashboard", () => {
  it("mide el avance contra la meta anual y la mensual", () => {
    assert.equal(computeProgress(810, 1000), 81);
    assert.equal(computeProgress(0, 0), 0);
  });

  it("suma paneles del año de la meta y la energía de septiembre 2026", () => {
    const metrics = computeDashboardMetrics([project], [month], meta, new Date("2026-09-28T12:00:00Z"));
    assert.equal(metrics.proyectosRegistrados, 1);
    assert.equal(metrics.panelesAnio, 810);
    assert.equal(metrics.panelesMes, 0);
    assert.equal(metrics.avanceAnual, 81);
    assert.equal(metrics.produccionMensualMwh, (10 * 30) / 1000);
    assert.equal(metrics.capacidadInstaladaKwp, 2.84);
  });
});
