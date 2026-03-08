# ToS metadata (checked-in)

Per-source terms of service and scrape guardrails. **Any scrape connector must read from here and respect `allowedUse` and `killSwitch`.**

- `allowedUse: "none"` — do not scrape this source.
- `allowedUse: "with-rate-limit"` — only with `maxRequestsPerMinute` and rate limiter.
- `killSwitch: true` — do not run this source regardless of allowedUse.

Add a JSON file per source, e.g. `retailer-example.com.json`, and load in the scrape connector.
