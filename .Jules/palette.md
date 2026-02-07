## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.

## 2025-02-23 - Date Initialization Hydration Mismatch
**Learning:** Initializing `useState` with a dynamic value like `new Date()` causes hydration mismatches because the server render (SSR) and client initial render might differ.
**Action:** Initialize with a static value (e.g., empty string) and use `useEffect` to set the dynamic default value on the client side to ensure consistency.
