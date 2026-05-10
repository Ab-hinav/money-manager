## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.

## 2026-05-10 - Conditional ARIA Labels and Tooltips on Collapsed Sidebars
**Learning:** When hiding text labels in responsive components (e.g., collapsed sidebars), dynamically applying both `title` and `aria-label` attributes to icon-only elements maintains accessibility while providing critical visual tooltips for sighted users.
**Action:** Conditionally apply `title` and `aria-label` based on the component's collapsed state to ensure elements without visible text always have an accessible name and tooltip.
