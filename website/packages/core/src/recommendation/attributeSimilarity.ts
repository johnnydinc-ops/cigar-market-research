/**
 * Attribute similarity baseline: same/similar wrapper, strength, body, origin.
 * No ML; used as fallback and for hybrid combination.
 */

import type { Cigar } from "../schema/index.js";

/** Strength/body difference: 0 = same, 1 = max spread (4 steps). */
function scaleDistance(a: number | undefined, b: number | undefined): number {
  if (a == null || b == null) return 0.5;
  const d = Math.abs(a - b);
  return d / 4;
}

/**
 * Score 0–1: 1 = perfect attribute match. Same wrapper + close strength/body + same origin score highest.
 */
export function attributeSimilarityScore(seed: Cigar, candidate: Cigar): number {
  if (seed.id === candidate.id) return 1;

  let score = 1;
  const wrapMatch = !seed.wrapper || !candidate.wrapper || seed.wrapper === candidate.wrapper;
  if (!wrapMatch) score *= 0.6;

  const strengthDiff = scaleDistance(seed.strength, candidate.strength);
  score *= 1 - strengthDiff * 0.4;

  const bodyDiff = scaleDistance(seed.body, candidate.body);
  score *= 1 - bodyDiff * 0.3;

  const originMatch = !seed.origin || !candidate.origin || seed.origin === candidate.origin;
  if (!originMatch) score *= 0.85;

  return Math.max(0, Math.min(1, score));
}

/**
 * Rank catalog by attribute similarity to seed. Returns (cigar, score) sorted by score desc.
 */
export function attributeBaselineRecommendations(
  seed: Cigar,
  catalog: Cigar[],
  options: { topK?: number; minScore?: number } = {}
): Array<{ cigar: Cigar; score: number }> {
  const topK = options.topK ?? 10;
  const minScore = options.minScore ?? 0.2;

  const scored = catalog
    .filter((c) => c.id !== seed.id)
    .map((c) => ({ cigar: c, score: attributeSimilarityScore(seed, c) }))
    .filter((x) => x.score >= minScore)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}
