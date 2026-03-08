"use client";

import { useCallback, useEffect, useState } from "react";
import { getProfile, setProfile, type ProfilePreferences } from "../../lib/profile";
import { TrustBlock } from "@cigar/design";

const STRENGTH_OPTIONS = ["Mild", "Medium", "Medium-Full", "Full"];
const BODY_OPTIONS = ["Light", "Medium", "Full"];

export default function ProfilePage() {
  const [prefs, setPrefs] = useState<ProfilePreferences>({});

  const load = useCallback(() => setPrefs(getProfile()), []);

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("cigar-profile-change", handler);
    return () => window.removeEventListener("cigar-profile-change", handler);
  }, [load]);

  const update = (next: Partial<ProfilePreferences>) => {
    const updated = { ...prefs, ...next };
    setPrefs(updated);
    setProfile(updated);
  };

  return (
    <main className="cigar-page">
      <h1 className="cigar-hero-title">Profile</h1>
      <p className="cigar-section-subtitle" style={{ marginBottom: "var(--space-8)" }}>
        Optional preferences. Used to tailor recommendations when you search.
      </p>

      <section
        style={{
          marginBottom: "var(--space-8)",
          padding: "var(--space-6)",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          maxWidth: "24rem",
        }}
        aria-label="Taste preferences"
      >
        <h2 className="cigar-section-title" style={{ fontSize: "var(--font-size-base)", marginBottom: "var(--space-4)" }}>
          Taste preferences
        </h2>
        <label style={{ display: "block", marginBottom: "var(--space-4)" }}>
          <span style={{ display: "block", fontSize: "var(--font-size-sm)", marginBottom: "var(--space-2)", color: "var(--text-muted)" }}>
            Preferred strength
          </span>
          <select
            value={prefs.strength ?? ""}
            onChange={(e) => update({ strength: e.target.value || undefined })}
            className="cigar-form-input"
          >
            <option value="">Any</option>
            {STRENGTH_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label style={{ display: "block" }}>
          <span style={{ display: "block", fontSize: "var(--font-size-sm)", marginBottom: "var(--space-2)", color: "var(--text-muted)" }}>
            Preferred body
          </span>
          <select
            value={prefs.body ?? ""}
            onChange={(e) => update({ body: e.target.value || undefined })}
            className="cigar-form-input"
          >
            <option value="">Any</option>
            {BODY_OPTIONS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>
      </section>

      <div style={{ maxWidth: "28rem" }}>
        <TrustBlock
          disclaimer="We don't sell cigars; we refer you to retailers."
          retailerCount={17}
          lastUpdatedLabel="Prices updated daily."
        />
      </div>
    </main>
  );
}
