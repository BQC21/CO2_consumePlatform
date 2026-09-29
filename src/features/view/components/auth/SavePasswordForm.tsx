"use client";

import { useState } from "react";
import { createClient, hasSupabaseEnv } from "@/features/model/supabase/client";

export function SavePasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (!hasSupabaseEnv()) {
      setError("Faltan las variables de Supabase.");
      return;
    }

    setBusy(true);
    
    const { error: authError } = await createClient().auth.updateUser({ password });
    if (authError) {
      setError("No se pudo guardar la contraseña. Abre de nuevo el enlace del correo.");
      setBusy(false);
      return;
    }
    
    window.location.href = "/dashboard";
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label>
        <span className="field-label">Nueva contraseña</span>
        <input className="field-input input-focus-brand" 
                type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>

      {error ? <p className="field-error">{error}</p> : null}
      <button className="btn-primary w-full" 
              type="submit" disabled={busy}>
        {busy ? "Guardando…" : "Guardar contraseña"}
      </button>
    
    </form>
  );
}
