"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DealComparisonTable, TrustBlock } from "@cigar/design";
import { AddToWishlistButton } from "../../../components/AddToWishlistButton";

interface DealRow {
  retailerId: string;
  retailerName: string;
  priceCents: number;
  perStickCents?: number;
  freshnessLabel?: string;
  ctaUrl: string;
  ctaLabel?: string;
}

const ID_TO_TITLE: Record<string, string> = {
  "1": "Padrón 1964 Anniversary Series Principe",
  "2": "Oliva Serie V Melanio",
  "3": "Dunbarton Tobacco & Trust Sin Compromiso",
};

export default function CigarDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [productTitle, setProductTitle] = useState<string>(ID_TO_TITLE[id] ?? "");
  const [rows, setRows] = useState<DealRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dealAlertEmail, setDealAlertEmail] = useState("");
  const [dealAlertSent, setDealAlertSent] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/cigar/${encodeURIComponent(id)}/deals`)
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(new Error(d.error ?? res.statusText)));
        return res.json();
      })
      .then((data: { productTitle?: string; rows: DealRow[] }) => {
        setProductTitle(data.productTitle ?? ID_TO_TITLE[id] ?? "");
        setRows(data.rows ?? []);
      })
      .catch((err: Error) => setError(err.message ?? "Could not load deals."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDealAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (dealAlertEmail.trim()) {
      const win = typeof window !== "undefined" ? (window as unknown as { __CIGAR_EMIT__?: (ev: unknown) => void }) : null;
      if (win?.__CIGAR_EMIT__) win.__CIGAR_EMIT__({ event: "deal_alert_signup", cigarId: id });
      setDealAlertSent(true);
    }
  };

  return (
    <main className="cigar-page">
      <Link href="/recommend" className="cigar-back-link">
        ← Back to results
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-6)", flexWrap: "wrap" }}>
        <AddToWishlistButton id={id} title={productTitle || `Cigar ${id}`} ctaHref={`/cigar/${id}`} />
      </div>

      {loading && <p style={{ color: "var(--text-muted)" }}>Loading…</p>}
      {error != null && (
        <p style={{ color: "var(--text-muted)", marginBottom: "var(--space-6)" }} role="alert">
          {error}
        </p>
      )}
      {!loading && !error && (
        <>
          <DealComparisonTable
            rows={rows}
            productTitle={rows.length > 0 ? `${productTitle || "Cigar"} (Box of 20)` : productTitle || `Cigar ${id}`}
            sortBy="price"
          />
          <section
            style={{
              marginTop: "var(--space-8)",
              padding: "var(--space-6)",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              maxWidth: "24rem",
            }}
            aria-label="Deal alert"
          >
            <h2 className="cigar-section-title" style={{ fontSize: "var(--font-size-base)", marginBottom: "var(--space-2)" }}>
              Notify me when price drops
            </h2>
            {dealAlertSent ? (
              <p style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>
                We&apos;ll email you if we see a better price for this cigar.
              </p>
            ) : (
              <form onSubmit={handleDealAlert}>
                <input
                  type="email"
                  placeholder="Your email"
                  value={dealAlertEmail}
                  onChange={(e) => setDealAlertEmail(e.target.value)}
                  className="cigar-form-input"
                  style={{ marginBottom: "var(--space-3)" }}
                  aria-label="Email for deal alert"
                />
                <button type="submit" className="cigar-btn-primary">
                  Subscribe
                </button>
              </form>
            )}
          </section>
        </>
      )}

      <div style={{ marginTop: "var(--space-12)", maxWidth: "28rem" }}>
        <TrustBlock
          disclaimer="We don't sell cigars; we refer you to retailers."
          retailerCount={17}
          lastUpdatedLabel="Prices updated daily."
        />
      </div>
    </main>
  );
}
