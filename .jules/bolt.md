## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.

## 2024-05-22 - Redundant Auth Sessions
**Learning:** `getServerSession` is often called multiple times within a single Server Component (or its helper functions), adding unnecessary overhead.
**Action:** Fetch session once at the top level of the Page/Component and pass the session object to helper functions.
