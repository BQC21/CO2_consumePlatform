/** Deja fuera del pase de fotos los recuadros informativos de la feria. */
export function gallerySlides(found: readonly string[]): string[] {
  return found.filter((file) => {
    const name = file.split("/").pop() ?? "";
    return !name.toLowerCase().startsWith("recurso");
  });
}
