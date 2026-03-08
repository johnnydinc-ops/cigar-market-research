"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RecommendationCard, TrustBlock } from "@cigar/design";
import { AddToWishlistButton } from "../../components/AddToWishlistButton";

interface ApiResult {
  id: string;
  title: string;
  explanation?: string;
  provenance?: Array<{ documentId: string; citationUrl?: string; attribution?: string; snippet?: string }>;
  attributes?: { strength?: string; body?: string; wrapper?: string };
  bestPrice?: { amountCents: number; retailerName: string };
  retailerCount?: number;
}

function RecommendContent() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();
  const [results, setResults] = useState<ApiResult[]>([]);
  const [seedTitle, setSeedTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q) {
      setResults([]);
      setSeedTitle("");
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/recommend?q=${encodeURIComponent(q)}`)
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(new Error(d.error ?? res.statusText)));
        return res.json();
      })
      .then((data: { results: ApiResult[]; seedTitle?: string }) => {
        setResults(data.results ?? []);
        setSeedTitle(data.seedTitle ?? q);
      })
      .catch((err: Error) => setError(err.message ?? "Could not load recommendations."))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <>
      <Link href="/" className="cigar-back-link">
        ← Back to search
      </Link>
      <h1 className="cigar-hero-title">
        Similar to {seedTitle || q || "your cigar"}
      </h1>
      <p className="cigar-section-subtitle" style={{ marginBottom: "var(--space-8)" }}>
        Recommendations from our engine. Click through for best price.
      </p>

      {loading && (
        <p style={{ color: "var(--text-muted)", marginBottom: "var(--space-6)" }}>Loading…</p>
      )}
      {error != null && (
        <p style={{ color: "var(--text-muted)", marginBottom: "var(--space-6)" }} role="alert">
          {error}
        </p>
      )}
      {!loading && !error && results.length > 0 && (
        <div className="cigar-card-grid">
          {results.map((r) => (
            <div key={r.id} style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: "var(--space-4)", right: "var(--space-4)", zIndex: 1 }}>
                <AddToWishlistButton id={r.id} title={r.title} ctaHref={`/cigar/${r.id}`} />
              </div>
              <RecommendationCard
                title={r.title}
                explanation={r.explanation}
                provenance={r.provenance}
                bestPrice={r.bestPrice}
                retailerCount={r.retailerCount}
                ctaLabel="See best deal"
                ctaHref={`/cigar/${r.id}`}
                attributes={r.attributes}
              />
            </div>
          ))}
        </div>
      )}
      {!loading && !error && q && results.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>No recommendations found. Try another search.</p>
      )}
      {!loading && !q && (
        <p style={{ color: "var(--text-muted)" }}>Enter a cigar on the home page to see similar recommendations.</p>
      )}

      <div style={{ marginTop: "var(--space-12)", maxWidth: "28rem" }}>
        <TrustBlock
          disclaimer="We don't sell cigars; we refer you to retailers."
          retailerCount={17}
          lastUpdatedLabel="Prices updated daily."
        />
      </div>
    </>
  );
}

export default function RecommendPage() {
  return (
    <main className="cigar-page">
      <Suspense fallback={<p style={{ color: "var(--text-muted)" }}>Loading…</p>}>
        <RecommendContent />
      </Suspense>
    </main>
  );
}
