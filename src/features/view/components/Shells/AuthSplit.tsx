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
        <div className="absolute inset-0 bg-black/60" />
      </section>


      {/* Sección de la derecha */}
      <section className="grid place-items-center px-4 py-10" style={{ background: "var(--color-background)" }}>
        <div>
          {/* Texto debe ubicarse al centro de la sección derecha */}
          <h1 className="max-w-250 text-5xl text-center font-semibold leading-tight">Plataforma nacional de energía solar</h1>
          <p className="mt-20 max-w-300 text-2xl text-center text-black/45">
            Accede para consultar la cobertura por departamento, revisar el estado de cada planta y administrar los proyectos registrados.
          </p>
        </div>

        <div className="w-full max-w-xl rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)]">
          <div className="mb-10 flex justify-center">
            <Logo />
          </div>
          <h2 className="text-center text-3xl font-semibold">{title}</h2>
          <p className="mt-2 mb-6 text-center text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
          {children}
        </div>

        <div className="relative flex h-full flex-col justify-between p-10">
          {/* pie de página*/}
          <p className="text-sm">TEC - Energy Solutions S.A.C</p>
        </div>
      </section>
    </div>
  );
}
