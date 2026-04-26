## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.

## 2026-04-26 - Redundant getServerSession Calls in Server Actions
**Learning:** Calling `getServerSession(authOptions)` multiple times within parallelized helper functions causes redundant CPU-intensive JWT decryption. This is a common bottleneck in Next.js Server Actions/Components when fetching disparate data pieces.
**Action:** Always fetch the session once at the top level of a Server Action/Component and pass the `accessToken` down to any parallelized helper functions to avoid duplicated overhead.
