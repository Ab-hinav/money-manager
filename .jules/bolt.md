## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.
## 2025-05-03 - Avoid Secondary Loops for Aggregation in Go
**Learning:** Calculating grand totals directly in the rows.Next() iteration avoids secondary loops (O(N)) and costly type assertions (interface{} to float64) in Go, yielding measurable performance improvements.
**Action:** Always compute totals directly from database row scans rather than iterating over intermediate slices/maps.
