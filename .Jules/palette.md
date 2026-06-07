## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.

## 2025-02-23 - Radix UI Primitive Accessibility
**Learning:** When using Shadcn/UI trigger components (like `<SheetTrigger>`) that contain only icons, adding an `aria-label` directly to the trigger component correctly sets the accessible name. However, Radix UI dynamically manages `aria-expanded` attributes on these primitives automatically; attempting to hardcode `aria-expanded` on them can cause conflicts or be ignored.
**Action:** Always provide `aria-label` or `title` on Radix UI triggers that lack text content, but avoid manually setting state attributes like `aria-expanded` unless working with raw HTML elements (like standard `<button>`).
