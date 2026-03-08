/**
 * In-memory price history store for development and testing.
 * Replace with a persistent implementation (DB, Redis) for production graphs.
 */

import type { PriceHistoryEntry, PriceHistoryStore } from "./priceHistory.js";

export class InMemoryPriceHistoryStore implements PriceHistoryStore {
  private entries: PriceHistoryEntry[] = [];

  async append(entry: PriceHistoryEntry): Promise<void> {
    this.entries.push(entry);
  }

  async getHistory(
    cigarId: string,
    retailerId: string,
    options?: { limit?: number }
  ): Promise<PriceHistoryEntry[]> {
    const limit = options?.limit ?? 100;
    const out = this.entries
      .filter((e) => e.cigarId === cigarId && e.retailerId === retailerId)
      .sort((a, b) => new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime())
      .slice(0, limit);
    return out;
  }
}
