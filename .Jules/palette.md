## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.

## 2025-02-24 - Accessible Responsive Navigation
**Learning:** Responsive layouts that collapse navigation menus into icon-only states (like a collapsible sidebar) inadvertently remove context for both visual users and screen readers, turning them into "mystery meat" navigation.
**Action:** Always provide `title` attributes (for visual tooltips on hover) and `aria-label` attributes (for screen readers) when text labels are conditionally hidden in responsive or state-driven components.
