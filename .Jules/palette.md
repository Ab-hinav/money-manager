## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.

## 2025-02-23 - Responsive UI Elements & Accessible Names
**Learning:** Collapsed sidebars often visually remove text labels to save space, but failing to dynamically provide an `aria-label` or `title` leaves icon-only controls inaccessible to screen readers and confusing to sighted users via hover. Similarly, placing responsive hiding classes (e.g., `md:hidden`) on the inner icon rather than the outer trigger element can accidentally leave an invisible but focusable empty button in the tab order.
**Action:** Always verify that state changes (like collapsing a sidebar) dynamically inject necessary accessible names (via `title` and `aria-label`). Always apply responsive hiding utility classes to the outermost interactive element (the trigger/button), not its inner contents, to prevent phantom focusable elements.
