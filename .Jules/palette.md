## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.

## 2024-05-18 - Visual Tooltips and ARIA Labels for Icon-only Elements
**Learning:** For responsive or dynamic layouts like collapsed sidebars where text labels are hidden, relying solely on `aria-label` provides a name for assistive technologies but leaves sighted users without context. Conversely, just adding a `title` provides a visual tooltip but isn't a robust accessible name.
**Action:** When hiding text labels on interactive icon-only elements (e.g., in a collapsed sidebar), always add both `aria-label` and `title` attributes. This ensures that the element is fully accessible to screen reader users while also providing a helpful visual tooltip on hover for sighted users.
