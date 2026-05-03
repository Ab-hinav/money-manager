## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.

## 2025-05-03 - Responsive Icon-Only States & Toggles
**Learning:** When responsive components (like sidebars) collapse to show only icons, relying solely on visual icons degrades accessibility. Adding `title` provides a visual tooltip for mouse users, and `aria-label` provides an accessible name for screen readers. Furthermore, toggle buttons (like collapse/expand controls) must use `aria-expanded` to communicate their state to assistive technologies.
**Action:** Always dynamically apply `title` and `aria-label` when components transition into icon-only states, and use `aria-expanded` on any button that controls the visibility of a collapsable section.
