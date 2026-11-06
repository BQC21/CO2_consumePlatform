"use server";

import { readdir } from "node:fs/promises";
import path from "node:path";
import { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS } from "@/lib/utils/consts/mediaCatalog";

function isGalleryFile(name: string): boolean {
  const extension = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1).toLowerCase() : "";
  return IMAGE_EXTENSIONS.has(extension) || VIDEO_EXTENSIONS.has(extension);
}

/** Lee las fotos y videos de una carpeta dentro de public/Proyectos o public/Ferias. */
export async function filesInFolder(folder: string): Promise<string[]> {
  const roots = ["Proyectos", "Ferias"].map((name) => path.resolve(process.cwd(), "public", name));
  const absolute = path.resolve(process.cwd(), "public", folder.replace(/^\/+/, ""));
  const allowed = roots.some((root) => absolute === root || absolute.startsWith(`${root}${path.sep}`));
  if (!allowed) {
    return [];
  }

  let names: string[] = [];
  try {
    names = await readdir(absolute);
  } catch {
    return [];
  }

  const prefix = folder.endsWith("/") ? folder : `${folder}/`;
  return names
    .filter(isGalleryFile)
    .map((name) => `${prefix}${name}`)
    .sort((left, right) => left.localeCompare(right, "es", { numeric: true, sensitivity: "base" }));
}
