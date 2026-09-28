/** Nombres canónicos de tablas y candidatos de columnas para la carga Excel. */
export const PROJECT_TABLE = "proyectos";
export const PROJECT_MONTH_TABLE = "registros_mensuales";
export const META_TABLE = "metas";

export const PROJECT_COLUMN_CANDIDATES = {
  nombre: ["proyecto / mes", "proyecto", "nombre", "nombre de la planta", "planta"],
  ubicacion: ["ubicación", "ubicacion", "departamento"],
  distrito: ["distrito", "ciudad"],
  tipo_de_sistema: ["tipo de sistema", "tipo"],
  pot_nominal_kw: ["pot. nominal (kw)", "potencia nominal", "pot nominal", "pot. nominal"],
  cap_instalada_kwp: ["cap. instalada (kwp)", "capacidad instalada", "cap instalada"],
  fecha_instalacion: ["fecha instalación", "fecha instalacion", "fecha de instalación"],
  marca_inversor: ["marca del inversor", "marca inversor", "inversor"],
  paneles_instalados: ["paneles instalados", "paneles"],
  estado: ["estado"],
  descripcion: ["descripción", "descripcion"],
} as const;

export const PROJECT_MONTH_COLUMN_CANDIDATES = {
  proyecto: ["proyecto / mes", "proyecto", "nombre", "planta"],
  mes: ["mes", "periodo", "período", "datetime"],
  tipico_diario: ["típico diario", "tipico diario", "producción diaria", "produccion diaria"],
  pot_nominal_kw: ["pot. nominal (kw)", "potencia nominal", "pot nominal"],
} as const;
