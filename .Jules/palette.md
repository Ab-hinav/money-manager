## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.
## 2026-03-01 - Adding ARIA attributes to interactive custom toggles
**Learning:** When building custom toggle groups or tabs with standard `<button>` elements, visual cues (like text color or underlines) are insufficient for screen readers. They require `aria-pressed` to understand selection state.
**Action:** Ensure custom toggle states in UI components are explicitly communicated using `aria-pressed` (or `aria-selected` for tabs) whenever the visual design implies a selected state.
