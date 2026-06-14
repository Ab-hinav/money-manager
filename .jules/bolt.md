## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.
## 2024-05-23 - Repeated JWT Decryption Overhead
**Learning:** Calling `getServerSession()` repeatedly across multiple helper functions within the same server action incurs significant CPU overhead from redundant JWT decryptions and network requests for session validation.
**Action:** Always hoist `getServerSession()` to the top-level server action and pass the raw `session.accessToken` down as an argument to parallelized helper functions to avoid duplicated work.
