import type { ReactNode } from "react";
import { Logo } from "@/features/view/components/Images/Logo";
import { AuthImage } from "../Images/AuthImage";

export function AuthSplit({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      

      {/* Sección de la izquierda */}
      <section className="relative hidden min-h-72 overflow-hidden text-white lg:block">
        <div className="absolute inset-0"/>
          <AuthImage/>
        <div className="absolute inset-0 bg-black/10" />
      </section>


      {/* Sección de la derecha */}
      <section className="flex min-h-screen flex-col items-center px-6 py-8" style={{ background: "var(--color-background)" }}>
        <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center">
          <h1 className="text-center text-[clamp(1.25rem,2.7vw,2.55rem)] font-bold uppercase leading-[1.15] tracking-[0.02em] text-[var(--color-section-title)]">
            <span className="block whitespace-nowrap">Plataforma nacional</span>
            <span className="block whitespace-nowrap">de energía solar</span>
          </h1>
          <p className="mt-6 max-w-lg text-center text-base leading-relaxed text-[var(--color-text-secondary)]">
            Accede para consultar la cobertura por departamento, revisar el estado de cada planta y administrar los proyectos registrados.
          </p>

          <div className="mt-8 w-full max-w-md rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)]">
            <div className="mb-8 flex justify-center">
              <Logo />
            </div>
            <h2 className="text-center text-2xl font-semibold">{title}</h2>
            <p className="mt-2 mb-6 text-center text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
            {children}
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">TEC - Energy Solutions S.A.C</p>
      </section>
    </div>
  );
}
