"use client";

import Link from "next/link";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@/features/view/components/Icons/icons";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";

export function LoginForm() {

  // ------ estados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false); // es visible?
  const [error, setError] = useState(""); // mensaje de error
  const [busy, setBusy] = useState(false); // esta ocupado?

  // ----- handlers
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (!email.includes("@")) {
      setError("Ingresa el correo corporativo.");
      return;
    }
    if (!hasSupabaseEnv()) {
      setError("Faltan las variables de Supabase para iniciar sesión.");
      return;
    }
    setBusy(true);
    setError("");

    const { error: authError } = await createClient().auth.signInWithPassword({ email, password });
    
    if (authError) {
      setError("Correo o contraseña incorrectos.");
      setBusy(false);
      return;
    }
    
    window.location.href = "/dashboard";
  }


  // ----- renderizado
  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      
      <label>
        <span className="field-label">Correo electrónico</span>
        <input className="field-input input-focus-brand" 
          type="email" autoComplete="username" 
          value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      
      <label>
        <span className="field-label">Contraseña</span>
        <span className="relative block">
          <input
            className="field-input input-focus-brand pr-24"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="button" 
            className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-[var(--color-text-secondary)]" 
            onClick={() => setVisible((current) => !current)}>
            <span className="inline-flex items-center gap-1">
              {visible ? <EyeSlashIcon /> : <EyeIcon />}
              {visible ? "Ocultar" : "Mostrar"}
            </span>
          </button>
        </span>
      </label>
      {error ? <p className="field-error">{error}</p> : null}

      <button className="btn-primary w-full" 
              type="submit" disabled={busy}>
        {busy ? "Ingresando…" : "Ingresar"}
      </button>
      
      <Link href="/update_password" 
            className="text-center text-sm font-medium" 
            style={{ color: "var(--color-secondary)" }}>
        ¿Olvidaste tu contraseña?
      </Link>
      
      <p className="border-t pt-3 text-center text-xs text-[var(--color-text-secondary)]" 
          style={{ borderColor: "var(--border-color)" }}>
          Se enviará un enlace de recuperación al correo corporativo.{" "}
          <Link href="/register" style={{ color: "var(--color-secondary)" }}>
            Crear cuenta
          </Link>
      </p>
    </form>
  );
}
