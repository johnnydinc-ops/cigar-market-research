/**
 * Pluggable page fetchers for scraping: fetch with browser-like headers + retries, or Playwright.
 * Use browser-like fetch by default; use Playwright for sources that block simple HTTP.
 */
import type { ScrapeFetchOptions } from "./scrape-connector.js";
/** Browser-like request headers to reduce 403 from bot detection. */
export declare function browserLikeHeaders(origin?: string): Record<string, string>;
export interface FetchFetcherOptions {
    /** Use browser-like headers (default true). */
    browserLike?: boolean;
    /** Number of retries on 403/429/5xx (default 3). */
    retries?: number;
}
export type FetchPageFn = (url: string, opts: ScrapeFetchOptions) => Promise<string>;
/**
 * Create a fetch-based page fetcher with optional browser-like headers and retries.
 * Use this as the default; switch to Playwright for sources that still return 403.
 */
export declare function createFetchFetcher(options?: FetchFetcherOptions): FetchPageFn;
/** Default fetcher used when none is provided: browser-like headers + 3 retries. */
export declare const defaultFetchPage: FetchPageFn;
/** Options for Playwright fetcher to handle JS and bot protection. */
export interface PlaywrightFetcherOptions {
    headless?: boolean;
    timeoutMs?: number;
    viewport?: {
        width: number;
        height: number;
    };
    /** Wait this many ms after load before capturing HTML (helps JS-rendered product lists). */
    waitAfterLoadMs?: number;
    /** "load" = wait for load event; "networkidle" = wait until no network for 500ms (slower, better for SPAs). */
    waitUntil?: "domcontentloaded" | "load" | "networkidle";
    /** Optional: wait for one of these selectors (e.g. product links) before capturing. Helps JS-heavy pages. */
    waitForSelector?: string | string[];
    /** Timeout for waitForSelector in ms. */
    waitForSelectorTimeoutMs?: number;
    /** Slight random delay (0–N ms) before capture to appear more human. */
    jitterMs?: number;
    /** Block images/fonts to speed up (can help avoid some bot triggers that rely on rendering). Default true. */
    blockMedia?: boolean;
}
/**
 * Create a Playwright-based fetcher (headless browser) with JS and bot-protection handling.
 * Use for sites that block fetch or render content via JavaScript.
 * Returns fetchPage and close(); caller must call close() when done to free resources.
 */
export declare function createPlaywrightFetcher(options?: PlaywrightFetcherOptions): Promise<{
    fetchPage: FetchPageFn;
    close: () => Promise<void>;
}>;
//# sourceMappingURL=fetcher.d.ts.map