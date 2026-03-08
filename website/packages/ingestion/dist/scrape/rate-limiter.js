/**
 * In-memory rate limiter for scrape connectors.
 * Respects maxRequestsPerMinute from ToS metadata.
 */
export class RateLimiter {
    timestamps = [];
    maxPerMinute;
    constructor(config) {
        this.maxPerMinute = config.maxRequestsPerMinute;
    }
    /** Returns true if request is allowed and recorded; false if rate exceeded. */
    allow() {
        const now = Date.now();
        const oneMinuteAgo = now - 60_000;
        this.timestamps = this.timestamps.filter((t) => t > oneMinuteAgo);
        if (this.timestamps.length >= this.maxPerMinute)
            return false;
        this.timestamps.push(now);
        return true;
    }
    /** Current count in the sliding window. */
    currentCount() {
        const oneMinuteAgo = Date.now() - 60_000;
        return this.timestamps.filter((t) => t > oneMinuteAgo).length;
    }
}
//# sourceMappingURL=rate-limiter.js.map