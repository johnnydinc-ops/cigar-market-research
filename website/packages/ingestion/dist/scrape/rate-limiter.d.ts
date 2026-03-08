/**
 * In-memory rate limiter for scrape connectors.
 * Respects maxRequestsPerMinute from ToS metadata.
 */
export interface RateLimiterConfig {
    maxRequestsPerMinute: number;
}
export declare class RateLimiter {
    private timestamps;
    private readonly maxPerMinute;
    constructor(config: RateLimiterConfig);
    /** Returns true if request is allowed and recorded; false if rate exceeded. */
    allow(): boolean;
    /** Current count in the sliding window. */
    currentCount(): number;
}
//# sourceMappingURL=rate-limiter.d.ts.map