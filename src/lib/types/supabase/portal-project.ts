// Tipado -- tabla Proyectos
export type PortalProjectRow = {
  id: number;
  nombre: string | null;
  version: string | null;
  tipo_instalacion: string | null;
  zona_id: number | null;
};

// Tipado -- tabla Zonas
export type PortalZoneRow = {
  id: number;
  departamento: string | null;
  zona: string | null;
};

// Tipado -- tabla Join Proyecto_equipos
export type PortalJoinRow = {
  proyecto_id: number | null;
  equipo_id: number | null;
  cantidad: number | string | null;
};

// Tipado -- tabla Equipos Principales
export type PortalEquipmentRow = {
  id: number;
  tipo_de_producto: string | null;
  marca: string | null;
  potencia_maxima: number | string | null;
  descripcion?: string | null;
  unidad?: string | null;
  paneles_palet?: number | string | null;
};


export type PortalProjectOption = {
  id: number;
  nombre: string;
  version: string;
  departamento: string;
  distrito: string;
  tipo_de_sistema: string;
  marca_inversor: string;
  pot_nominal_kw: number | null;
  cap_instalada_kwp: number | null;
  paneles_instalados: number;
};
