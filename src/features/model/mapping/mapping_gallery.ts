import type { GalleryMediaItem, ProjectGallery, SupabaseGalleryRow } from "@/lib/types/supabase/gallery-types";
import { toNullableNumber, toText } from "@/lib/utils/helpers/normalization";

// mapeo de items de la galeria
function mapMediaItem(value: unknown): GalleryMediaItem | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const row = value as Record<string, unknown>;
  const path = toText(row.path);
  if (!path) {
    return null;
  }
  return {
    id: toText(row.id) || path,
    path,
    nombre: toText(row.nombre) || path.split("/").pop() || "archivo",
    bytes: toNullableNumber(row.bytes) ?? 0,
    duracion: toText(row.duracion),
  };
}

// mapeo de listas de items de la galeria
function mapMediaList(value: unknown): GalleryMediaItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    const item = mapMediaItem(entry);
    return item ? [item] : [];
  });
}

// mapeo de filas de la galeria
export function mapSupabaseRowToGallery(row: SupabaseGalleryRow): ProjectGallery {
  return {
    id: String(row.id ?? ""),
    proyecto_id: String(row.proyecto_id),
    nombre: toText(row.nombre),
    fotos: mapMediaList(row.fotos),
    videos: mapMediaList(row.videos),
    updated_at: toText(row.updated_at),
  };
}

// mapeo de items de la galeria a json
export function galleryMediaToJson(items: GalleryMediaItem[]): GalleryMediaItem[] {
  return items.map((item) => ({
    id: item.id,
    path: item.path,
    nombre: item.nombre,
    bytes: item.bytes,
    duracion: item.duracion,
  }));
}
