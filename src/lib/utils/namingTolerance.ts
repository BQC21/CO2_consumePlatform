// ------------- TABLAS --------------------
export const PROJECT_TABLE = "proyectos";
export const MONTH_TABLE = "registros_mensuales"; // Modal interna de cada fila del proyecto
export const PROJECT_IMAGE_BUCKET = "project-images"; // Imagen asociada al proyecto


// ------------- COLUMNAS -------------------

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