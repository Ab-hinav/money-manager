## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.

## 2024-05-22 - Redundant getServerSession calls
**Learning:** Next.js Server Components tend to fetch data sequentially or use `Promise.all` with helper functions that redundantly call `await getServerSession(authOptions)`, resulting in multiple CPU-intensive JWT decryptions per request.
**Action:** Always refactor parallelized helper functions to accept an `accessToken` string as a parameter and consolidate the `getServerSession` call to the top-level parent function to eliminate redundant overhead.
