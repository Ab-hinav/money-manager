## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.

## 2024-05-23 - Redundant Authentication Overhead in Server Actions
**Learning:** Next.js Server Components and Actions in this codebase tend to call `getServerSession` repeatedly in helper functions, causing unnecessary overhead. Consolidating this to a single call at the top level and passing the `accessToken` down avoids redundant authentication overhead.
**Action:** When creating or modifying Server Components/Actions that fetch multiple pieces of authenticated data, always consolidate `getServerSession` calls to the top-level function and pass the `accessToken` to helper functions.
