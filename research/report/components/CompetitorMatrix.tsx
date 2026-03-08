import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export function CompetitorMatrix({ dataDir }: { dataDir: string }) {
  const path = join(dataDir, 'competitor_matrix.csv');
  if (!existsSync(path)) {
    return <p>Competitor matrix data not found.</p>;
  }
  const csv = readFileSync(path, 'utf-8');
  const lines = csv.trim().split('\n');
  const parseRow = (line: string): string[] => {
    const out: string[] = [];
    let i = 0;
    while (i < line.length) {
      if (line[i] === '"') {
        i++;
        let cell = '';
        while (i < line.length && line[i] !== '"') {
          cell += line[i++];
        }
        if (line[i] === '"') i++;
        out.push(cell);
        if (line[i] === ',') i++;
      } else {
        let cell = '';
        while (i < line.length && line[i] !== ',') cell += line[i++];
        out.push(cell.trim());
        if (line[i] === ',') i++;
      }
    }
    return out;
  };
  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map((line) => parseRow(line));

  const colLabels: Record<string, string> = {
    company_name: 'Company',
    category: 'Category',
    target_user: 'Target user',
    offers_recommendations: 'Recommendations',
    offers_price_comparison: 'Price comparison',
    offers_subscription: 'Subscription',
    offers_reviews_or_community: 'Reviews / community',
    monetization_model: 'Monetization',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    likely_gap_we_could_fill: 'Gap we could fill',
    source_notes: 'Notes',
  };

  return (
    <div className="report-body" style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{colLabels[h] || h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
