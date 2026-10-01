import { computeMonthEnergy, energiaMensualKwh } from "../lib/utils/helpers/computes/energy_total";
import { daysInMonth } from "../lib/utils/helpers/normalization";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("rendimiento FV", () => {
  it("usa los días reales del mes para pasar del típico diario a energía mensual", () => {
    assert.equal(daysInMonth(2026, 2), 28);
    assert.equal(energiaMensualKwh(10, "2026-02"), 280);
    assert.equal(energiaMensualKwh(10, "2026-01"), 310);
  });

  it("separa la energía FV y la de red del mes", () => {
    const energy = computeMonthEnergy(8, 2, "2026-01", 12, 4, 1);
    assert.equal(energy.energiaFVKwh, 248);
    assert.equal(energy.energiGRIDKwh, 62);
    assert.equal(energy.co2Kg, 12);
    assert.equal(energy.carbonKg, 4);
    assert.equal(energy.arboles, 1);
  });

  it("no inventa energía si el mes no se puede leer", () => {
    assert.equal(energiaMensualKwh(12, "enero"), 0);
  });
});
