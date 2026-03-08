import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CompetitorMatrix } from '../components/CompetitorMatrix';

const DOCS_DIR = join(process.cwd(), '..', 'docs');
const DATA_DIR = join(process.cwd(), '..', 'data');

function readDoc(name: string): string {
  const path = join(DOCS_DIR, name);
  if (!existsSync(path)) return `*Content not found: ${name}*`;
  return readFileSync(path, 'utf-8');
}

const SECTIONS: { id: string; title: string; doc: string }[] = [
  { id: 'executive-summary', title: 'Executive Summary', doc: 'EXECUTIVE_SUMMARY.md' },
  { id: 'problem', title: 'Problem Statement', doc: 'PROBLEM_STATEMENT.md' },
  { id: 'hypotheses', title: 'Product Hypotheses', doc: 'PRODUCT_HYPOTHESES.md' },
  { id: 'segments', title: 'Customer Segments', doc: 'CUSTOMER_SEGMENTS.md' },
  { id: 'competitive', title: 'Competitive Landscape', doc: 'COMPETITIVE_LANDSCAPE.md' },
  { id: 'competitor-matrix', title: 'Competitor Matrix', doc: '' },
  { id: 'retailer', title: 'Retailer Landscape', doc: 'RETAILER_LANDSCAPE.md' },
  { id: 'data', title: 'Data Acquisition Strategy', doc: 'DATA_ACQUISITION_STRATEGY.md' },
  { id: 'market', title: 'Market Analysis', doc: 'MARKET_ANALYSIS.md' },
  { id: 'monetization', title: 'Monetization', doc: 'MONETIZATION.md' },
  { id: 'value-prop', title: 'User Value Proposition', doc: 'USER_VALUE_PROP.md' },
  { id: 'innovation', title: 'Innovation Assessment', doc: 'INNOVATION.md' },
  { id: 'risks', title: 'Risks', doc: 'RISKS.md' },
  { id: 'validation', title: 'Validation Plan', doc: 'VALIDATION_PLAN.md' },
  { id: 'mvp', title: 'MVP Recommendation', doc: 'MVP_RECOMMENDATION.md' },
  { id: 'go-nogo', title: 'Go / No-Go', doc: 'GO_NO_GO.md' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <div style={{ padding: '0 0.6rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Contents
        </div>
        <a href="#at-a-glance">At a glance</a>
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            {s.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default function ReportPage() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <header style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <h1 style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: '1.75rem', margin: 0, color: 'var(--text)' }}>
            US Cigar Buyer Platform
          </h1>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Market Research & Strategy Brief — Recommendation + Deal-Finding Opportunity Assessment
          </p>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Confidential · Internal use
          </p>
        </header>

        <section id="at-a-glance" style={{ marginBottom: '2.5rem', padding: '1.25rem', background: 'var(--callout-bg)', borderLeft: '4px solid var(--accent)', borderRadius: '0 6px 6px 0' }}>
          <h2 style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.8125rem', margin: '0 0 0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            At a glance
          </h2>
          <ul style={{ margin: '0 0 1rem', paddingLeft: '1.25rem', fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--text)' }}>
            <li><strong>Idea:</strong> One flow—enter a cigar you like → similar cigars + best price across US retailers → purchase via affiliate. US-only.</li>
            <li><strong>Gap:</strong> Recommendation and price comparison exist separately; no single product owns both in one trusted flow.</li>
            <li><strong>Opportunity:</strong> Plausible but unproven. Niche- or affiliate-viable; venture-scale would require material share or expansion.</li>
            <li><strong>Risks:</strong> Unvalidated demand for combined flow; retailer/data dependence; affiliate economics; trust; incumbent response.</li>
            <li><strong>Recommendation:</strong> Proceed narrowly. Validate first; then build with large catalog, ML recommendation engine, and significant RAG so recs are effective. Differentiate on trust and UX.</li>
          </ul>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem 0.75rem 0.5rem 0', fontWeight: 600, color: 'var(--text)', width: '7rem', verticalAlign: 'top' }}>Bull case</td>
                <td style={{ padding: '0.5rem 0', color: 'var(--text)' }}>Online US cigar is large and growing; discovery and deal-finding are real behaviors; the wedge (combined flow + trust) is not owned; affiliate programs exist; large catalog + ML + RAG is feasible with affiliate feeds and a solid RAG pipeline.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem 0.75rem 0.5rem 0', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top' }}>Bear case</td>
                <td style={{ padding: '0.5rem 0', color: 'var(--text)' }}>Users may prefer two separate tools; a new entrant may not win trust; affiliate conversion may not support the business; incumbents could add “similar” and own the space.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem 0.75rem 0.5rem 0', fontWeight: 600, color: 'var(--success-border)', verticalAlign: 'top' }}>Recommendation</td>
                <td style={{ padding: '0.5rem 0', color: 'var(--text)' }}><strong>Proceed narrowly.</strong> Validate first. If validation supports it, build with large catalog, ML recommendation engine, and significant RAG (reviews, tasting notes, expert content); one flow, 5–10 retailers, affiliate-only in v1. If not, pivot or stop.</td>
              </tr>
            </tbody>
          </table>
        </section>

        {SECTIONS.map(({ id, title, doc }) => (
          <section key={id} id={id} style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text)' }}>
              {title}
            </h2>
            {id === 'competitor-matrix' ? (
              <CompetitorMatrix dataDir={DATA_DIR} />
            ) : (
              <div className="report-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {doc ? readDoc(doc) : ''}
                </ReactMarkdown>
              </div>
            )}
          </section>
        ))}

        <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Research workspace: cigar-market-research. See <code>docs/</code> and <code>data/</code> for source files.
        </footer>
      </div>
    </div>
  );
}
