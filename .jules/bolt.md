## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.

## 2026-06-07 - Calculate grand totals in SQL rows.Next() loop
**Learning:** In Go dashboard controllers, calculating grand totals (e.g., `totalInvestments`) directly within the `rows.Next()` iteration avoids the O(N) overhead of a separate loop over maps or slices, and skips expensive interface-to-float64 type assertions.
**Action:** Always calculate cumulative aggregates directly inside the database results iteration loop instead of adding secondary iteration logic.
