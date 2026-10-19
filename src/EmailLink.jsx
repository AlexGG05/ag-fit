import React, { useState } from "react";
import { Leaf } from "lucide-react";
export function readEmailLink() {
  const match = window.location.hash.match(/^#(verify|reset)=([a-f0-9]{64})$/);
  if (!match) return null;
  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search,
  );
  return { purpose: match[1], token: match[2] };
}
export default function EmailLink({ link, onDone }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const verify = link.purpose === "verify";
  async function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!verify && data.password !== data.repeat) {
      setError("Die beiden Passwörter stimmen nicht überein.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        verify ? "/api/verify-email" : "/api/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: link.token,
            ...(!verify ? { password: data.password } : {}),
          }),
          cache: "no-store",
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw Error(result.error || "Die Aktion ist fehlgeschlagen.");
      setMessage(result.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={submit}>
        <Leaf size={32} />
        <h1>
          {verify ? "E-Mail-Adresse bestätigen" : "Neues Passwort festlegen"}
        </h1>
        {message ? (
          <p role="status">{message}</p>
        ) : (
          <>
            <p>
              {verify
                ? "Bestätige die Aktivierung deines ag-fit-Kontos."
                : "Wähle ein neues Passwort. Bestehende Anmeldungen werden dadurch beendet."}
            </p>
            {!verify && (
              <>
                <label>
                  Neues Passwort
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={10}
                    maxLength={128}
                    required
                  />
                </label>
                <label>
                  Passwort wiederholen
                  <input
                    name="repeat"
                    type="password"
                    autoComplete="new-password"
                    minLength={10}
                    maxLength={128}
                    required
                  />
                </label>
              </>
            )}
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <button className="primary" disabled={busy || !navigator.onLine}>
              {busy
                ? "Einen Moment …"
                : verify
                  ? "Konto aktivieren"
                  : "Neues Passwort speichern"}
            </button>
          </>
        )}
        <button
          className="auth-switch"
          type="button"
          disabled={busy}
          onClick={onDone}
        >
          Zur Anmeldung
        </button>
        <p className="hint">
          Links sind einmalig und zeitlich begrenzt. Falls der Link nicht mehr
          gültig ist, fordere auf der Anmeldeseite einen neuen an.
        </p>
      </form>
    </div>
  );
}
