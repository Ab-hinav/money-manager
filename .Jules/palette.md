## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.

## 2026-02-15 - Standardizing Toggle Button Accessibility
**Learning:** The application uses custom button-based toggles for selection (Scope, Transaction Type, Groups). Inconsistent use of ARIA attributes (some used `aria-pressed`, others none) confuses screen readers. Standardizing on `aria-pressed` for these "stateful buttons" provides immediate, consistent feedback without complex refactoring to Radio Groups.
**Action:** When implementing or modifying custom toggle/selection buttons, always ensure `aria-pressed` (or `aria-checked` if role is radio) is applied to communicate state.
