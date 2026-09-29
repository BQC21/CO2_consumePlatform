import type { ReactNode } from "react";
import { Logo } from "@/features/view/components/Images/Logo";

export function AuthSplit({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      
      {/* Sección de la izquierda */}
      <section className="relative hidden min-h-72 overflow-hidden text-white lg:block">
        <div className="absolute inset-0" 
              style={{ background: "linear-gradient(160deg, #1b242c 0%, #31404a 42%, #0e1418 100%)" }} />
            {/* Considerar la imagen de Puno */}

            {/* <SolarField /> */}
        <div className="absolute inset-0 bg-black/45" />
          <div className="relative flex h-full flex-col justify-between p-10">
            <div className="w-fit rounded-2xl bg-white p-3">
              <Logo />
            </div>
            <div>
              <h1 className="max-w-md text-4xl font-semibold leading-tight">Plataforma nacional de energía solar</h1>
              <p className="mt-4 max-w-md text-sm text-white/85">
                Accede para consultar la cobertura por departamento, revisar el estado de cada planta y administrar los proyectos registrados.
              </p>
              <div className="mt-6 flex gap-2 text-sm font-semibold">
                <span className="rounded-full px-3 py-1" style={{ background: "var(--color-primary)" }}>
                  Cobertura
                </span>
                <span className="rounded-full px-3 py-1" style={{ background: "var(--color-accent-green)" }}>
                  Proyectos
                </span>
                <span className="rounded-full px-3 py-1" style={{ background: "var(--color-secondary)" }}>
                  Operación
                </span>
            </div>
          </div>
          <p className="text-sm">TEC - Energy Solutions S.A.C</p>
        </div>
      </section>

      {/* Sección de la derecha */}
      <section className="grid place-items-center px-4 py-10" style={{ background: "var(--color-background)" }}>
        <div className="w-full max-w-md rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)]">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <h2 className="text-center text-3xl font-semibold">{title}</h2>
          <p className="mt-2 mb-6 text-center text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}
