## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.

## $(date +%Y-%m-%d) - Optimize Dashboard Aggregation Queries
**Learning:** The dashboard aggregate controllers (`GetTotalLoans`, `GetTotalInvestments`, `GetTotalSavings`) previously fetched individual transactions into Go memory (returning potentially thousands of rows) and used `for rows.Next()` loops to calculate totals (`totalLoans += amount`). This caused a massive N+1-style bottleneck where memory usage and latency scaled linearly with user transactions. Furthermore, simple sums (`GetTotalIncome`) lacked null-safety and would panic if no rows were returned.
**Action:** Shifted aggregation strictly to PostgreSQL using `SUM(t.amount)` and `GROUP BY c.name`, and wrapped all `SUM` calls in `COALESCE(..., 0)` to guarantee safe float scanning. In future features, always prefer database-level aggregation over application-level loops for metric calculations.
