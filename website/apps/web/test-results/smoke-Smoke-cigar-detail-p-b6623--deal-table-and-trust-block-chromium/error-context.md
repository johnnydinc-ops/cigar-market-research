# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation "Main" [ref=e2]:
    - link "Home" [ref=e3] [cursor=pointer]:
      - /url: /
    - link "Wishlist" [ref=e4] [cursor=pointer]:
      - /url: /wishlist
    - link "Profile" [ref=e5] [cursor=pointer]:
      - /url: /profile
    - link "Compliance" [ref=e6] [cursor=pointer]:
      - /url: /compliance
  - main [ref=e7]:
    - link "← Back to search" [ref=e8] [cursor=pointer]:
      - /url: /
    - heading "Similar to Padron" [level=1] [ref=e9]
    - paragraph [ref=e10]: Recommendations from our engine. Click through for best price.
    - alert [ref=e11]: No matching cigar found. Try a brand or line name (e.g. Padron, Oliva).
    - complementary "Trust and transparency" [ref=e13]:
      - paragraph [ref=e14]: We don't sell cigars; we refer you to retailers.
      - paragraph [ref=e15]: We compare prices from 17 US retailers.
      - paragraph [ref=e16]: Prices updated daily.
  - alert [ref=e17]
```