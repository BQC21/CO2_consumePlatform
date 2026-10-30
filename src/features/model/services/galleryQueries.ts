import { galleryMediaToJson, mapSupabaseRowToGallery } from "@/features/model/mapping/mapping_gallery";
import { createClient } from "@/features/model/supabase/client";
import { GalleryMediaKind } from "@/lib/types/components/options";
import type { GalleryMediaItem, ProjectGallery, SupabaseGalleryRow } from "@/lib/types/supabase/gallery-types";
import { EXTENSION_KIND, PHOTO_TYPES, VIDEO_TYPES } from "@/lib/utils/consts/image_props";
import { GALLERY_FORMAT_ERROR } from "@/lib/utils/consts/messages";
import { safeFileName, throwIfAborted } from "@/lib/utils/helpers/normalization";
import { formatMediaDuration } from "@/lib/utils/helpers/render/format";
import { GALLERY_BUCKET, GALLERY_TABLE } from "@/lib/utils/namingTolerance";

// clasificacion de archivos de la galeria
export function classifyGalleryFile(file: File): GalleryMediaKind | null {
  if (PHOTO_TYPES.has(file.type)) {
    return "foto";
  }
  if (VIDEO_TYPES.has(file.type)) {
    return "video";
  }
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_KIND[extension] ?? null;
}

// lectura de las galerias
export async function getGalleries(): Promise<ProjectGallery[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from(GALLERY_TABLE).select("*");
  if (error) {
    throw new Error(`Error al leer la galería: ${error.message}`);
  }
  return (data as SupabaseGalleryRow[]).map(mapSupabaseRowToGallery);
}

// lectura de las urls de la galeria
export async function signedGalleryUrls(paths: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) {
    return {};
  }
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(GALLERY_BUCKET).createSignedUrls(unique, 60 * 60);
  if (error) {
    throw new Error(`Error al leer los archivos: ${error.message}`);
  }
  const urls: Record<string, string> = {};
  for (const row of data ?? []) {
    if (row.path && row.signedUrl) {
      urls[row.path] = row.signedUrl;
    }
  }
  return urls;
}

// agregacion de archivos a la galeria
export async function addGalleryFile(
  proyectoId: string,
  nombre: string,
  file: File,
  onProgress: (ratio: number) => void,
  signal?: AbortSignal,
): Promise<void> {
  const kind = classifyGalleryFile(file);
  if (!kind) {
    throw new Error(GALLERY_FORMAT_ERROR);
  }
  const item = await storeFile(proyectoId, file, kind, onProgress, signal);
  const current = await readGallery(proyectoId);
  const fotos = [...(current?.fotos ?? [])];
  const videos = [...(current?.videos ?? [])];
  if (kind === "foto") {
    fotos.push(item);
  } else {
    videos.push(item);
  }
  try {
    await saveGallery(proyectoId, nombre, fotos, videos);
  } catch (error) {
    await removeStored(item.path);
    throw error;
  }
}

// reemplazo de archivos en la galeria
export async function replaceGalleryFile(
  proyectoId: string,
  nombre: string,
  itemId: string,
  file: File,
  onProgress: (ratio: number) => void,
  signal?: AbortSignal,
): Promise<void> {
  const kind = classifyGalleryFile(file);
  if (!kind) {
    throw new Error(GALLERY_FORMAT_ERROR);
  }
  const current = await readGallery(proyectoId);
  if (!current) {
    throw new Error("Error al reemplazar el archivo: el proyecto no tiene galería.");
  }
  const previous = [...current.fotos, ...current.videos].find((item) => item.id === itemId);
  if (!previous) {
    throw new Error("Error al reemplazar el archivo: no está en la galería.");
  }
  const item = await storeFile(proyectoId, file, kind, onProgress, signal);
  const fotos = current.fotos.filter((entry) => entry.id !== itemId);
  const videos = current.videos.filter((entry) => entry.id !== itemId);
  if (kind === "foto") {
    fotos.push(item);
  } else {
    videos.push(item);
  }
  try {
    await saveGallery(proyectoId, nombre, fotos, videos);
  } catch (error) {
    await removeStored(item.path);
    throw error;
  }
  await removeStored(previous.path);
}

// eliminacion de archivos de la galeria
export async function removeGalleryFile(proyectoId: string, nombre: string, itemId: string): Promise<void> {
  const current = await readGallery(proyectoId);
  if (!current) {
    throw new Error("Error al quitar el archivo: el proyecto no tiene galería.");
  }
  const previous = [...current.fotos, ...current.videos].find((item) => item.id === itemId);
  if (!previous) {
    throw new Error("Error al quitar el archivo: no está en la galería.");
  }
  await saveGallery(
    proyectoId,
    nombre,
    current.fotos.filter((item) => item.id !== itemId),
    current.videos.filter((item) => item.id !== itemId),
  );
  await removeStored(previous.path);
}

// lectura de la galeria
async function readGallery(proyectoId: string): Promise<ProjectGallery | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from(GALLERY_TABLE).select("*").eq("proyecto_id", proyectoId).maybeSingle();
  if (error) {
    throw new Error(`Error al leer la galería: ${error.message}`);
  }
  return data ? mapSupabaseRowToGallery(data as SupabaseGalleryRow) : null;
}

// guardado de la galeria
async function saveGallery(proyectoId: string, nombre: string, fotos: GalleryMediaItem[], videos: GalleryMediaItem[]): Promise<void> {
  const supabase = createClient();
  const payload = {
    proyecto_id: proyectoId,
    nombre,
    fotos: galleryMediaToJson(fotos),
    videos: galleryMediaToJson(videos),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from(GALLERY_TABLE).upsert(payload, { onConflict: "proyecto_id" });
  if (error) {
    throw new Error(`Error al guardar la galería: ${error.message}`);
  }
}

// almacenamiento de archivos en la galeria
async function storeFile(
  proyectoId: string,
  file: File,
  kind: GalleryMediaKind,
  onProgress: (ratio: number) => void,
  signal?: AbortSignal,
): Promise<GalleryMediaItem> {
  throwIfAborted(signal);
  const id = crypto.randomUUID();
  const path = `${proyectoId}/${id}-${safeFileName(file.name)}`;
  const duracion = kind === "video" ? await readVideoDuration(file) : "";
  throwIfAborted(signal);
  await uploadWithProgress(path, file, onProgress, signal);
  if (signal?.aborted) {
    await removeStored(path);
    throw new Error("Se canceló la subida.");
  }
  return {
    id,
    path,
    nombre: file.name,
    bytes: file.size,
    duracion,
  };
}

// subida de archivos con progreso
async function uploadWithProgress(path: string, file: File, onProgress: (ratio: number) => void, signal?: AbortSignal): Promise<void> {
  const supabase = createClient();
  const signed = await supabase.storage.from(GALLERY_BUCKET).createSignedUploadUrl(path);
  if (signed.error || !signed.data) {
    throw new Error(`Error al subir el archivo: ${signed.error?.message ?? "sin URL de subida"}`);
  }
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append("cacheControl", "3600");
    form.append("", file);
    xhr.open("PUT", signed.data.signedUrl);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(event.loaded / event.total);
      }
    };
    const abort = () => xhr.abort();
    signal?.addEventListener("abort", abort, { once: true });
    xhr.onload = () => {
      signal?.removeEventListener("abort", abort);
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(1);
        resolve();
      } else {
        reject(new Error("Error al subir el archivo."));
      }
    };
    xhr.onerror = () => reject(new Error("Error al subir el archivo."));
    xhr.onabort = () => reject(new Error("Se canceló la subida."));
    xhr.send(form);
  });
}

// eliminacion de archivos almacenados en la galeria
async function removeStored(path: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(GALLERY_BUCKET).remove([path]);
  if (error) {
    throw new Error(`Error al quitar el archivo: ${error.message}`);
  }
}

// lectura de la duracion de videos
function readVideoDuration(file: File): Promise<string> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    const finish = (value: string) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };
    video.onloadedmetadata = () => finish(formatMediaDuration(video.duration));
    video.onerror = () => finish("");
    video.src = url;
  });
}
