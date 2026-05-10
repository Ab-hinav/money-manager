## 2024-05-22 - Server Component Waterfalls
**Learning:** Next.js Server Components in this codebase tend to fetch data sequentially using `await` without `Promise.all`, creating waterfall requests even when data is independent.
**Action:** Always check `page.tsx` files for sequential `await` calls on `fetch` and refactor to `Promise.all` where dependencies allow.

## 2024-05-22 - Server Component Session Fetching
**Learning:** In Next.js Server Components and Actions, fetching the session (`getServerSession`) multiple times in parallelized helper functions causes redundant, CPU-intensive JWT decryptions and slows down the request.
**Action:** Always fetch the session once at the top level of the Server Component or Server Action and pass the `accessToken` down as an argument to parallelized helper functions.
