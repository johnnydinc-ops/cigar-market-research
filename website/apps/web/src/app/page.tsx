"use client";

import { useRouter } from "next/navigation";
import { SearchEntry, TrustBlock } from "@cigar/design";

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    const q = encodeURIComponent(query.trim());
    router.push(`/recommend?q=${q}`);
  };

  return (
    <main className="cigar-page">
      <div style={{ maxWidth: "42rem" }}>
        <h1 className="cigar-hero-title">
          Find cigars you&apos;ll like. See the best price.
        </h1>
        <p className="cigar-hero-subtitle">
          US-only · We refer you to retailers; we don&apos;t sell.
        </p>
        <SearchEntry
          placeholder="Enter a cigar you like (name or brand)"
          onSubmit={handleSearch}
          ariaLabel="Search for a cigar you like"
        />
      </div>
      <div style={{ marginTop: "var(--space-16)", maxWidth: "28rem" }}>
        <TrustBlock
          disclaimer="We don't sell cigars; we refer you to retailers."
          retailerCount={17}
          lastUpdatedLabel="Prices updated daily."
        />
      </div>
    </main>
  );
}
