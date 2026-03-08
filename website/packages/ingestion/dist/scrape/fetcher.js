/**
 * Pluggable page fetchers for scraping: fetch with browser-like headers + retries, or Playwright.
 * Use browser-like fetch by default; use Playwright for sources that block simple HTTP.
 */
const DEFAULT_RETRIES = 3;
const RETRY_DELAY_MS = [2000, 4000, 6000];
/** Browser-like request headers to reduce 403 from bot detection. */
export function browserLikeHeaders(origin) {
    return {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"macOS"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": origin ? "none" : "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        ...(origin ? { Referer: origin } : {}),
    };
}
/**
 * Create a fetch-based page fetcher with optional browser-like headers and retries.
 * Use this as the default; switch to Playwright for sources that still return 403.
 */
export function createFetchFetcher(options = {}) {
    const browserLike = options.browserLike !== false;
    const retries = options.retries ?? DEFAULT_RETRIES;
    return async (url, opts) => {
        if (opts.rateLimiter && !opts.rateLimiter.allow()) {
            throw new Error("Rate limit exceeded");
        }
        const origin = url.replace(/\/[^/]*$/, "");
        const headers = browserLike ? browserLikeHeaders(origin) : { "User-Agent": "CigarIngestion/1.0", Accept: "text/html" };
        let lastError = null;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const res = await fetch(url, {
                    headers,
                    redirect: "follow",
                });
                if (res.ok)
                    return res.text();
                const status = res.status;
                const retryable = status === 403 || status === 429 || (status >= 500 && status < 600);
                if (!retryable || attempt === retries) {
                    throw new Error(`HTTP ${status}: ${url}`);
                }
                lastError = new Error(`HTTP ${status}: ${url}`);
                const delay = RETRY_DELAY_MS[Math.min(attempt, RETRY_DELAY_MS.length - 1)];
                await new Promise((r) => setTimeout(r, delay));
            }
            catch (err) {
                lastError = err instanceof Error ? err : new Error(String(err));
                if (attempt === retries)
                    throw lastError;
                const delay = RETRY_DELAY_MS[Math.min(attempt, RETRY_DELAY_MS.length - 1)];
                await new Promise((r) => setTimeout(r, delay));
            }
        }
        throw lastError ?? new Error(`Failed: ${url}`);
    };
}
/** Default fetcher used when none is provided: browser-like headers + 3 retries. */
export const defaultFetchPage = createFetchFetcher({ browserLike: true, retries: 3 });
const STEALTH_LAUNCH_ARGS = [
    "--disable-blink-features=AutomationControlled",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--disable-gpu",
    "--no-first-run",
    "--no-zygote",
    "--disable-extensions",
    "--disable-default-apps",
    "--window-size=1280,720",
];
const STEALTH_INIT_SCRIPT = `
  Object.defineProperty(navigator, "webdriver", { get: function() { return false; } });
  Object.defineProperty(navigator, "plugins", { get: function() { return [1, 2, 3, 4, 5]; } });
  Object.defineProperty(navigator, "languages", { get: function() { return ["en-US", "en"]; } });
  window.chrome = { runtime: {} };
`;
/**
 * Create a Playwright-based fetcher (headless browser) with JS and bot-protection handling.
 * Use for sites that block fetch or render content via JavaScript.
 * Returns fetchPage and close(); caller must call close() when done to free resources.
 */
export async function createPlaywrightFetcher(options = {}) {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({
        headless: options.headless !== false,
        args: STEALTH_LAUNCH_ARGS,
    });
    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport: options.viewport ?? { width: 1280, height: 720 },
        locale: "en-US",
        timezoneId: "America/New_York",
        permissions: [],
        extraHTTPHeaders: {
            "Accept-Language": "en-US,en;q=0.9",
        },
        ignoreHTTPSErrors: false,
    });
    await context.addInitScript(STEALTH_INIT_SCRIPT);
    if (options.blockMedia !== false) {
        await context.route(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff2?|ttf|eot)(\?|$)/i, (route) => route.abort());
    }
    const timeoutMs = options.timeoutMs ?? 35000;
    const waitAfterLoadMs = options.waitAfterLoadMs ?? 2000;
    const waitUntil = options.waitUntil ?? "load";
    const waitForSelector = options.waitForSelector;
    const waitForSelectorTimeoutMs = options.waitForSelectorTimeoutMs ?? 12000;
    const jitterMs = options.jitterMs ?? 500;
    const fetchPage = async (url, opts) => {
        if (opts.rateLimiter && !opts.rateLimiter.allow()) {
            throw new Error("Rate limit exceeded");
        }
        const page = await context.newPage();
        try {
            const res = await page.goto(url, {
                waitUntil,
                timeout: timeoutMs,
            });
            if (!res || !res.ok()) {
                throw new Error(`HTTP ${res?.status() ?? "unknown"}: ${url}`);
            }
            if (waitForSelector) {
                const selectors = Array.isArray(waitForSelector) ? waitForSelector : [waitForSelector];
                let found = false;
                for (const sel of selectors) {
                    try {
                        await page.waitForSelector(sel, { timeout: waitForSelectorTimeoutMs, state: "attached" });
                        found = true;
                        break;
                    }
                    catch {
                        continue;
                    }
                }
                if (!found && selectors.length > 0) {
                    await new Promise((r) => setTimeout(r, Math.min(2000, waitAfterLoadMs)));
                }
            }
            if (waitAfterLoadMs > 0) {
                const delay = waitAfterLoadMs + (jitterMs > 0 ? Math.floor(Math.random() * jitterMs) : 0);
                await new Promise((r) => setTimeout(r, delay));
            }
            await page.evaluate("window.scrollTo(0, 300)");
            await new Promise((r) => setTimeout(r, 300));
            await page.evaluate("window.scrollTo(0, 0)");
            const html = await page.content();
            return html;
        }
        finally {
            await page.close();
        }
    };
    const close = async () => {
        await context.close();
        await browser.close();
    };
    return { fetchPage, close };
}
//# sourceMappingURL=fetcher.js.map