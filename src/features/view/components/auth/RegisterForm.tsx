"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";

export function RegisterForm() {
  const [name, setName] = useState(""); // incluye el nombre del usuario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasSupabaseEnv()) {
      setError("Faltan las variables de Supabase para registrar la cuenta.");
      return;
    }
    setBusy(true);
    setError("");

    const { error: authError } = await createClient().auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setBusy(false);

    if (authError) {
      setError("No se pudo crear la cuenta. Revisa el correo y que la contraseña tenga al menos 6 caracteres.");
      return;
    }

    setMessage("Cuenta creada. Si el proyecto pide confirmación, revisa el correo antes de ingresar.");
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      
      <label>
        <span className="field-label">Nombre</span>
        <input className="field-input input-focus-brand" 
              value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        <span className="field-label">Correo</span>
        <input className="field-input input-focus-brand" 
              type="email" value={email} 
              onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        <span className="field-label">Contraseña</span>
        <input className="field-input input-focus-brand" 
              type="password" value={password} 
              onChange={(event) => setPassword(event.target.value)} />
      </label>

      {error ? <p className="field-error">{error}</p> : null}
      {message ? <p className="text-sm text-[var(--color-success)]">{message}</p> : null}
      
      <button className="btn-primary w-full" 
              type="submit" disabled={busy}>
        {busy ? "Guardando…" : "Crear cuenta"}
      </button>

      <Link href="/login" className="text-center text-sm" 
            style={{ color: "var(--color-secondary)" }}>
        Ya tengo cuenta
      </Link>
    </form>
  );
}
