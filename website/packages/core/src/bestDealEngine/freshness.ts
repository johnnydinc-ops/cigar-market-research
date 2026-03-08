/**
 * Freshness labels and confidence from fetchedAt.
 */

import type { FreshnessLabel, MatchConfidence } from "./types.js";

const DEFAULT_FRESH_HOURS = 24;
const DEFAULT_RECENT_HOURS = 72;

export function getAgeHours(fetchedAt: Date): number {
  return (Date.now() - new Date(fetchedAt).getTime()) / (1000 * 60 * 60);
}

export function getFreshnessLabel(
  fetchedAt: Date,
  options: { freshThresholdHours?: number; recentThresholdHours?: number } = {}
): FreshnessLabel {
  const ageHours = getAgeHours(fetchedAt);
  const fresh = options.freshThresholdHours ?? DEFAULT_FRESH_HOURS;
  const recent = options.recentThresholdHours ?? DEFAULT_RECENT_HOURS;
  if (ageHours <= fresh) return "fresh";
  if (ageHours <= recent) return "recent";
  return "stale";
}

/**
 * Match confidence 0–1: higher when fresh and in stock.
 */
export function getMatchConfidence(
  pricing: { fetchedAt: Date; inStock?: boolean },
  options: { freshThresholdHours?: number; recentThresholdHours?: number } = {}
): MatchConfidence {
  const label = getFreshnessLabel(pricing.fetchedAt, options);
  const inStock = pricing.inStock !== false;
  let freshnessScore = 0.5;
  if (label === "fresh") freshnessScore = 1;
  else if (label === "recent") freshnessScore = 0.7;
  else freshnessScore = 0.3;
  return inStock ? freshnessScore : freshnessScore * 0.5;
}
