## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.
## 2026-04-19 - Adding Tooltips and ARIA Labels to Icon-Only Buttons
**Learning:** Icon-only navigation links (such as in a collapsed sidebar) require dynamic `title` and `aria-label` attributes to ensure accessibility and provide visual tooltips, otherwise their meaning is opaque.
**Action:** Always ensure dynamic assignment of `aria-label` and `title` to icon-only buttons that change state between text and icon forms, and update memory instructions.
