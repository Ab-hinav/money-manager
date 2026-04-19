## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.

## 2026-04-19 - Inline Aggregation via SQL Group By
**Learning:** In Go database controllers for dashboards, calculating grand totals inline within the `rows.Next()` iteration avoids O(N) overhead in Go. Furthermore, pushing aggregation workload to the database using SQL `GROUP BY` and `COALESCE(SUM(t.amount), 0)` is more efficient than redundant Go maps and slices loops, while avoiding runtime panics on empty datasets.
**Action:** Always favor SQL `GROUP BY` for map data and compute total sums directly in the `rows.Next()` pass to eliminate secondary loops.
