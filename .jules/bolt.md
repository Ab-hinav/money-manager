## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.

## 2024-05-23 - Grand Total Calculation in Go Dashboard Controllers
**Learning:** Calculating grand totals using a secondary loop over maps/slices (especially involving interface-to-float64 assertions) adds significant O(N) overhead in Go.
**Action:** Always calculate grand totals directly within the initial `rows.Next()` loop iteration when retrieving data from the database.
