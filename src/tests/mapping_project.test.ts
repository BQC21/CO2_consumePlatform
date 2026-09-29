import { createProjectFormStateFromProject, mapProjectToSupabaseRow, mapSupabaseRowToProject } from "@/features/model/mapping/mapping_project";
import { mapProjectMonthToSupabaseRow, mapSupabaseRowToProjectMonth } from "@/features/model/mapping/mapping_project_month";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("mapping de proyectos", () => {
  it("convierte la fila de Supabase y conserva null en potencias vacías", () => {
    const project = mapSupabaseRowToProject({
      id: "abc",
      nombre: "Killa — Miraflores",
      ubicacion: "Lima",
      distrito: "Miraflores",
      tipo_de_sistema: "On-grid",
      pot_nominal_kw: null,
      cap_instalada_kwp: "2.00",
      fecha_instalacion: "03/05/2026",
      marca_inversor: "SOLIS",
      paneles_instalados: "16",
      estado: "completado",
      descripcion: "Planta en azotea",
      updated_at: "2026-09-01",
    });
    assert.equal(project.fecha_instalacion, "2026-05-03");
    assert.equal(project.pot_nominal_kw, null);
    assert.equal(project.cap_instalada_kwp, 2);
    assert.equal(project.estado, "completado");
    assert.equal(createProjectFormStateFromProject(project).pot_nominal_kw, "");
  });

  it("escribe números y deja la fecha nula si no viene", () => {
    const row = mapProjectToSupabaseRow({
      nombre: "Hotel Laguna Seca",
      ubicacion: "Cajamarca",
      distrito: "",
      tipo_de_sistema: "On-grid",
      pot_nominal_kw: "",
      cap_instalada_kwp: "32",
      fecha_instalacion: "",
      marca_inversor: "LIVOLTEK",
      paneles_instalados: "80",
      estado: "en_ejecucion",
      descripcion: "",
    });
    assert.equal(row.pot_nominal_kw, null);
    assert.equal(row.fecha_instalacion, null);
    assert.equal(row.paneles_instalados, 80);
    assert.equal(typeof row.updated_at, "string");
  });

  it("acepta el mes 09.2026 del reporte de planta", () => {
    const month = mapSupabaseRowToProjectMonth({
      id: "m",
      proyecto_id: "abc",
      mes: "09.2026",
      tipico_diario: "12.4",
      pot_nominal_kw: "5,5",
    });
    assert.equal(month.mes, "2026-09");
    assert.equal(month.tipico_diario, 12.4);
    assert.equal(month.pot_nominal_kw, 5.5);
    const stored = mapProjectMonthToSupabaseRow({
      proyecto_id: "abc",
      mes: "09.2026",
      tipico_diario: "12.4",
      pot_nominal_kw: "",
    });
    assert.equal(stored.mes, "2026-09");
    assert.equal(stored.pot_nominal_kw, null);
  });
});
