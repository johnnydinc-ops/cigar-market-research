/**
 * Compliance / legal — affiliate disclosure, we don't sell, privacy.
 */
export default function CompliancePage() {
  return (
    <main className="cigar-page" style={{ maxWidth: "65ch" }}>
      <h1 className="cigar-hero-title">Compliance &amp; disclosure</h1>

      <section style={{ marginTop: "var(--space-8)" }}>
        <h2 className="cigar-section-title">We refer; we don&apos;t sell</h2>
        <p style={{ color: "var(--text)", lineHeight: 1.6, margin: 0 }}>
          We do not sell cigars or tobacco. We help you discover cigars and compare prices
          across US retailers. When you click through to a retailer, you buy from them.
          We may earn a referral fee from the retailer at no extra cost to you.
        </p>
      </section>

      <section style={{ marginTop: "var(--space-8)" }}>
        <h2 className="cigar-section-title">Affiliate disclosure</h2>
        <p style={{ color: "var(--text)", lineHeight: 1.6, margin: 0 }}>
          This site may include affiliate links. If you make a purchase after clicking
          a link to a retailer, we may receive a commission. This does not affect the
          price you pay. We only link to retailers we include in our comparison.
        </p>
      </section>

      <section style={{ marginTop: "var(--space-8)" }}>
        <h2 className="cigar-section-title">US only</h2>
        <p style={{ color: "var(--text)", lineHeight: 1.6, margin: 0 }}>
          Our service is intended for users in the United States. Retailers we link to
          may have their own shipping and age-verification policies.
        </p>
      </section>

      <section style={{ marginTop: "var(--space-8)" }}>
        <h2 className="cigar-section-title">Privacy</h2>
        <p style={{ color: "var(--text)", lineHeight: 1.6, margin: 0 }}>
          We collect minimal data necessary to provide recommendations and deal
          comparison. For deal alerts, we store your email only to send price
          notifications. We do not sell your data. A full privacy policy will be
          available before launch.
        </p>
      </section>
    </main>
  );
}
