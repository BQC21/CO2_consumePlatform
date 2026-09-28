import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  arbolesPlantados,
  computeMonthEnergy,
  daysInMonth,
  energiaMensualKwh,
  reduccionCo2Kg,
} from "../lib/utils/helpers/computes/energy_total.ts";

describe("rendimiento FV", () => {
  it("usa los días reales del mes para pasar del típico diario a energía mensual", () => {
    assert.equal(daysInMonth(2026, 2), 28);
    assert.equal(energiaMensualKwh(10, "2026-02"), 280);
    assert.equal(energiaMensualKwh(10, "2026-01"), 310);
  });

  it("calcula CO2, carbón y árboles a partir de la energía", () => {
    const energy = computeMonthEnergy(8, "2026-01");
    assert.equal(energy.energiaKwh, 248);
    assert.equal(energy.co2Kg, reduccionCo2Kg(248));
    assert.ok(Math.abs(energy.arboles - arbolesPlantados(energy.co2Kg)) < 0.0001);
    assert.ok(energy.carbonKg > 0);
  });

  it("no inventa energía si el mes no se puede leer", () => {
    assert.equal(energiaMensualKwh(12, "enero"), 0);
  });
});
