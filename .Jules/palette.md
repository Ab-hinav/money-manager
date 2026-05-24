## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.

## 2025-05-24 - Responsive Icon-Only Accessible Names
**Learning:** When text labels are hidden in responsive states (like a collapsed sidebar), simply hiding the text creates an icon-only button without an accessible name.
**Action:** Dynamically apply both `title` and `aria-label` to icon-only elements or elements that become icon-only in responsive states to maintain accessibility and provide visual tooltips.
