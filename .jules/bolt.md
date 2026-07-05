## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.

## 2024-05-23 - Grand Total Calculation Optimization
**Learning:** Calculating grand totals in Go controllers via secondary loops over maps/slices creates unnecessary O(N) overhead and type assertions that impact performance.
**Action:** Accumulate grand totals directly within the primary `rows.Next()` database iteration loop to avoid secondary iterations.
