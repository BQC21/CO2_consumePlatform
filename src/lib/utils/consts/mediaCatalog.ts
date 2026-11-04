export type MediaKind = "image" | "video" | "unsupported";

export type ProjectMedia = {
  aliases: readonly string[];
  files: readonly string[];
};

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const VIDEO_EXTENSIONS = new Set(["mp4", "webm"]);

export const PROJECT_MEDIA: readonly ProjectMedia[] = [
  { aliases: ["Familia Castillo Salazar"], files: [] },
  { aliases: ["Artesco"], files: ["/Proyectos/Artesco/IMG_3036.HEIC"] },
  { aliases: ["Killa"], files: [] },
  {
    aliases: ["Ribera del Ríos", "Cieneguilla"],
    files: ["/Proyectos/Cieneguilla/DJI_0107.jpg", "/Proyectos/Cieneguilla/_DSC3665.jpg"],
  },
  {
    aliases: ["Quilmaná", "Quilmana"],
    files: ["/Proyectos/Quilmana/_DSC4491.jpg", "/Proyectos/Quilmana/_DSC4577.jpg"],
  },
  { aliases: ["Algarrobos"], files: [] },
  {
    aliases: ["Honda"],
    files: ["/Proyectos/Loreto/EDIT IQUITOS (3).jpg", "/Proyectos/Loreto/TEC WEB (3).jpg"],
  },
  {
    aliases: ["CENTRIKA", "Centrika"],
    files: ["/Proyectos/Centrika/1 (1).jpg", "/Proyectos/Centrika/WhatsApp Image 2025-11-06 at 10.33.00 PM.jpeg"],
  },
  {
    aliases: ["Caja los Andes"],
    files: ["/Proyectos/Puno/instalacion-puno-edit.jpg", "/Proyectos/Puno/EQUIPO TÉCNICO (13).jpg"],
  },
  {
    aliases: ["Laguna Seca", "Laguna SECA"],
    files: ["/Proyectos/Cajamarca/LAGUNA SECA- TEC (26).jpg", "/Proyectos/Cajamarca/LAGUNA SECA- TEC (61).jpg"],
  },
  {
    aliases: ["La Floresta", "San Borja"],
    files: ["/Proyectos/SanBorja/DJI_20250912113552_0046_D.jpg", "/Proyectos/SanBorja/_DSC8408.jpg"],
  },
  {
    aliases: ["Cafetero", "Satipo"],
    files: ["/Proyectos/Junin/TEC V2 (1).jpg", "/Proyectos/Junin/TEC V2 (6).jpg"],
  },
];

export const EXPOFERIA_2026_IMAGES: readonly string[] = ["/Ferias/Expoferia2026/_DSC4626.jpg"];

export function normalizeMediaName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function mediaForProject(projectName: string | null): ProjectMedia | null {
  if (!projectName) {
    return null;
  }
  const normalized = normalizeMediaName(projectName);
  let best: { entry: ProjectMedia; score: number } | null = null;
  for (const entry of PROJECT_MEDIA) {
    for (const alias of entry.aliases) {
      const key = normalizeMediaName(alias);
      if (!key || !normalized.includes(key)) {
        continue;
      }
      if (!best || key.length > best.score) {
        best = { entry, score: key.length };
      }
    }
  }
  return best?.entry ?? null;
}

export function publicMediaSrc(path: string): string {
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

export function mediaFileName(path: string): string {
  const name = path.split("/").pop() ?? path;
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

export function mediaKind(path: string): MediaKind {
  const name = path.split("?")[0]?.split("/").pop() ?? "";
  const extension = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1).toLowerCase() : "";
  if (IMAGE_EXTENSIONS.has(extension)) {
    return "image";
  }
  if (VIDEO_EXTENSIONS.has(extension)) {
    return "video";
  }
  return "unsupported";
}
