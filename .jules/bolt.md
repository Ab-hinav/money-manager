## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.

## 2024-05-23 - Redundant Authentication Overhead
**Learning:** Next.js Server Components and Actions using `Promise.all` can create a bottleneck if `getServerSession` is called inside each parallel function instead of being consolidated at the top level, as it duplicates authentication overhead.
**Action:** Always fetch `getServerSession` once at the top level of a server action/component and pass the resulting `accessToken` down to helper functions to minimize authentication latency.
