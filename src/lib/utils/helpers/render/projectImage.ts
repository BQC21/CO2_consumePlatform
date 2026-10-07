import { PROJECT_IMAGE_BUCKET } from "@/lib/utils/namingTolerance";

const PLATFORM_IMAGE_PREFIX = `/storage/v1/object/public/${PROJECT_IMAGE_BUCKET}/`;

/** URL pública del bucket de imágenes del proyecto de la plataforma. */
export function platformProjectImageUrl(url: string): string {
  const value = url.trim();
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value || !base) {
    return "";
  }
  try {
    const image = new URL(value);
    const platform = new URL(base);
    if (image.host !== platform.host || !image.pathname.startsWith(PLATFORM_IMAGE_PREFIX)) {
      return "";
    }
    return value;
  } catch {
    return "";
  }
}

/** Nombre de archivo, con extensión, guardado en esa URL. */
export function platformProjectImageName(url: string): string {
  const safe = platformProjectImageUrl(url);
  if (!safe) {
    return "—";
  }
  const name = decodeURIComponent(safe.split("?")[0].split("/").pop() || "");
  return name || "—";
}
