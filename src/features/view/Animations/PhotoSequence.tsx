"use client";

import { useCallback, useEffect, useState } from "react";
import { HERO_SLIDE_SECONDS } from "@/lib/utils/consts/sizes";
import { mediaFileName, mediaKind, publicMediaSrc } from "@/lib/utils/helpers/normalization";
import { PhotoSequenceProps } from "@/lib/types/components/components";

export function PhotoSequence({ files, label, contained = false }: PhotoSequenceProps) {

  // --------------------
  // --- Estados --------
  // --------------------

  const slideCount: number = files.length; // Cantidad de fotos
  const signature = files.join("\0"); // Firma de las fotos
  const [tracked, setTracked] = useState(signature); // seguimiento de las fotos
  const [slide, setSlide] = useState(0); // slide actual

  // --------------------
  // --- Efectos --------
  // --------------------

    if (signature !== tracked) {
        setTracked(signature); // Actualizar la firma de las fotos
        setSlide(0);
    }

  // Slide seguro para evitar errores
    const safeSlide = slideCount === 0 ? 0 : Math.min(slide, slideCount - 1);

  // --------------------
  // --- Funciones ------
  // --------------------

  // Mostrar el slide actual
    const showSlide = useCallback((next: number) => {
        if (slideCount === 0) {
            return;
        }
        setSlide(((next % slideCount) + slideCount) % slideCount);
    }, [slideCount]);

  // En el modal la foto se muestra completa y no usa el zoom del Hero.
  // El pase automático sigue el mismo intervalo.
    useEffect(() => {
        if (!contained || slideCount < 2 || mediaKind(files[safeSlide]) !== "image") {
            return;
        }
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }
        const timer = window.setTimeout(() => showSlide(safeSlide + 1), HERO_SLIDE_SECONDS * 1000);
        return () => window.clearTimeout(timer);
    }, [contained, files, safeSlide, showSlide, slideCount]);

  // Avanzar al siguiente slide
    const advanceSlide = useCallback((index: number) => {
        if (index !== safeSlide || slideCount < 2) {
            return;
        }
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }
        showSlide(index + 1);
    }, [safeSlide, showSlide, slideCount]);

  // Si no hay fotos, no mostrar nada
    if (slideCount === 0) {
        return null;
    }

    return (
        <div
            className="hero-sequence hero-sequence-card mt-4"
            style={contained ? { aspectRatio: "auto", height: "min(72vh, calc(92vh - 7.5rem))" } : undefined}
            aria-label={label}
            onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                showSlide(safeSlide - 1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                showSlide(safeSlide + 1);
            }
            }}
        >
            {files.map((src, index) => { // Mapear las fotos
            const kind = mediaKind(src); // Tipo de archivo
            const active = index === safeSlide; // Si es el slide actual, mostrar el frame
            if (kind === "video") { // Si es un video, mostrar el video
                return active ? ( // Si es el slide actual, mostrar el video
                <video
                    key={`frame-${index}-${src}`}
                    className="hero-sequence-frame is-active is-video"
                    controls
                    preload="metadata"
                    src={publicMediaSrc(src)}
                >
                    {label}
                </video>
                ) : null;
            }
            if (kind === "unsupported") { // Si es un archivo no soportado, mostrar el mensaje
                return active ? (
                <p key={`frame-${index}-${src}`} className="hero-sequence-note">
                    El archivo {mediaFileName(src)} no se puede mostrar en el navegador.
                </p>
                ) : null;
            }
            return ( // Si es una imagen, mostrar la imagen
                <img
                key={`frame-${index}-${src}`}
                src={publicMediaSrc(src)}
                alt={active ? `${label}, imagen ${index + 1} de ${slideCount}` : ""}
                className={active ? "hero-sequence-frame is-active" : "hero-sequence-frame"}
                style={{ 
                    animationDuration: `${HERO_SLIDE_SECONDS}s`,
                    ...(contained ? { objectFit: "contain", transform: "none", animation: "none" } : {}),
                }}
                aria-hidden={!active}
                onAnimationEnd={() => advanceSlide(index)}
                />
            );
            })}
            {slideCount > 1 ? ( // Si hay más de un slide, mostrar los botones de navegación
            <>
                <button type="button" className="hero-sequence-nav hero-sequence-nav-prev" aria-label="Imagen anterior" onClick={() => showSlide(safeSlide - 1)}>
                <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                    <path d="M17 6 L9 14 L17 22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                </button>
                <button type="button" className="hero-sequence-nav hero-sequence-nav-next" aria-label="Imagen siguiente" onClick={() => showSlide(safeSlide + 1)}>
                <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                    <path d="M11 6 L19 14 L11 22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                </button>
                <div className="hero-sequence-dots">
                {files.map((src, index) => ( // Mapear los botones de navegación
                    <button
                    key={`dot-${index}-${src}`}
                    type="button"
                    className={index === safeSlide ? "hero-sequence-dot is-active" : "hero-sequence-dot"}
                    aria-label={`Imagen ${index + 1}`}
                    aria-current={index === safeSlide ? "true" : undefined}
                    onClick={() => showSlide(index)}
                    />
                ))}
                </div>
            </>
            ) : null}
        </div>
    );
}
