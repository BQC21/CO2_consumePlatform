/** Un archivo guardado en el vector de fotos o de videos. */
export type GalleryMediaItem = {
  id: string;
  path: string;
  nombre: string;
  bytes: number;
  duracion: string;
};

/** Fila de `galeria_proyectos` tal como llega de Supabase. */
export type SupabaseGalleryRow = {
  id?: string;
  proyecto_id: string;
  nombre: string | null;
  fotos: unknown;
  videos: unknown;
  updated_at?: string | null;
};

export type ProjectGallery = {
  id: string;
  proyecto_id: string;
  nombre: string;
  fotos: GalleryMediaItem[];
  videos: GalleryMediaItem[];
  updated_at: string;
};
