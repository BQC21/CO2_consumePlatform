"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/features/view/components/Images/Logo";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";
import { initialsFromName } from "@/lib/utils/helpers/render/format";
import { PortalShellProps } from "@/lib/types/components/components";
import { NAVIGATION } from "@/lib/utils/consts/navigation";

export function PortalShell({ title, subtitle, activePath, children, 
  tone = "light", actions, headerExtra, backgroundImage }: PortalShellProps) 
{
  const [name, setName] = useState("Usuario");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      return;
    }
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      const fullName = typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
      setName(fullName || user?.email || "Usuario");
    });
  }, []);

  async function handleSignOut() {
    if (hasSupabaseEnv()) {
      await createClient().auth.signOut();
    }
    window.location.href = "/login";
  }

  const shellStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgb(8 14 22 / 0.78), rgb(8 14 22 / 0.84)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed" as const,
      }
    : { background: tone === "dark" ? "var(--color-background-dark)" : "var(--color-background)" };

  return (
    <div className="min-h-screen" style={shellStyle}>
      <header className="sticky top-0 z-10 bg-white">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-3 text-[var(--color-text-primary)] no-underline">
            <Logo compact />
            <span className="hidden text-sm font-medium sm:inline">TEC - Energy Solutions S.A.C</span>
          </Link>
          <nav className="flex flex-1 flex-wrap justify-center gap-2" aria-label="Principal">
            {NAVIGATION.map((item) => (
              <Link key={item.href} href={item.href} className={item.href === activePath ? "nav-pill nav-pill-active" : "nav-pill nav-pill-inactive"}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="relative flex items-center gap-2">
            <span className="hidden text-sm font-medium md:inline">{name}</span>
            <button
              type="button"
              className="grid place-items-center rounded-full text-xs font-semibold text-white"
              style={{ width: "var(--avatar-size)", height: "var(--avatar-size)", background: "var(--color-primary)" }}
              aria-label={`Cuenta de ${name}`}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {initialsFromName(name)}
            </button>
            {menuOpen ? (
              <button type="button" className="btn-secondary absolute top-12 right-0 z-20 h-10" onClick={() => void handleSignOut()}>
                Cerrar sesión
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex h-1">
          <span className="flex-1" style={{ background: "var(--color-primary)" }} />
          <span className="flex-1" style={{ background: "var(--color-accent-green)" }} />
          <span className="flex-1" style={{ background: "var(--color-secondary)" }} />
        </div>
      </header>
      <main className="px-4 py-6 lg:px-8" style={{ color: tone === "dark" ? "var(--color-text-on-dark)" : "var(--color-text-primary)" }}>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="mb-5 text-2xl font-semibold md:text-3xl" style={{ color: tone === "dark" ? "var(--color-text-on-dark)" : "var(--color-text-primary)" }}>
              {title}
            </h1>
            <p className="mt-1 text-sm" style={{ color: tone === "dark" ? "var(--color-text-on-dark-muted)" : "var(--color-text-secondary)" }}>
              {subtitle}
            </p>
          </div>
          {headerExtra ? <div className="min-w-[min(100%,32rem)] flex-1">{headerExtra}</div> : null}
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
