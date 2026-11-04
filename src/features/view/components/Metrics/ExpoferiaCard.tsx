import Image from "next/image";
import { EXPOFERIA_2026_IMAGES, publicMediaSrc } from "@/lib/utils/consts/mediaCatalog";

export function ExpoferiaCard() {
  return (
    <section className="rounded-3xl bg-white p-5 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]" aria-label="Expoferia 2026">
      <p className="text-sm font-semibold tracking-[0.14em] text-[var(--color-text-secondary)]">EXPOFERIA 2026</p>
      <h2 className="mt-1 text-2xl font-semibold">Expoferia 2026</h2>
      {EXPOFERIA_2026_IMAGES.length === 0 ? (
        <p className="mt-3 text-base text-[var(--color-text-secondary)]" role="status">
          No hay fotos de la expoferia.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {EXPOFERIA_2026_IMAGES.map((path) => (
            <Image
              key={path}
              src={publicMediaSrc(path)}
              alt="Expoferia 2026"
              width={1600}
              height={1066}
              unoptimized
              className="h-auto w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      )}
    </section>
  );
}
