## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.

## 2025-02-23 - Responsive Icon-Only A11y & Tooltips
**Learning:** When text labels are hidden in responsive components (like a collapsed sidebar), icon-only interactive elements lose both visual tooltips and screen reader accessible names.
**Action:** Dynamically apply both `title` (for visual hover tooltips) and `aria-label` (for screen readers) when a component enters a state where its text label is hidden. Hardcode these attributes on permanently icon-only controls (like collapse/expand toggles) and explicitly manage `aria-expanded`.
