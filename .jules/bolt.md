## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.

## 2026-04-12 - Parallelized getServerSession Overhead
**Learning:** Next.js Server Components and Actions that parallelize internal helper functions with `Promise.all` will cause redundant JWT decryption overhead if each helper function independently calls `getServerSession(authOptions)`.
**Action:** Consolidate `getServerSession` calls to the top-level parent function and pass the resulting `accessToken` down to the parallelized helper functions to avoid unnecessary CPU-intensive decryption operations.
