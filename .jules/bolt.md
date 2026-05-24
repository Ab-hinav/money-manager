## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.
## 2026-05-24 - Optimize grand total calculations
**Learning:** Avoiding secondary loops and interface-to-float64 type assertions (e.g., when summing values from []map[string]interface{}) yields measurable performance gains (~27% reduction in processing time per operation in dashboard controllers).
**Action:** Always calculate grand totals directly within the rows.Next() iteration to avoid the O(N) overhead of a separate loop over maps or slices.
