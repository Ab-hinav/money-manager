## 2025-02-23 - Mobile Input UX & A11y Verification
**Learning:** `inputMode="decimal"` provides a superior numeric entry experience on mobile compared to `type="number"` (which can have validation quirks) or text. Verifying these "invisible" UX enhancements requires direct DOM attribute inspection rather than just visual screenshots.
**Action:** Always include attribute assertions in Playwright verification scripts for accessibility features (ARIA, input modes) to prove implementation when visual evidence is insufficient.
## 2024-07-05 - Enhance accessibility of sidebar navigation and toggles
**Learning:** When using responsive utility classes (like `md:hidden`) on interactive elements wrapped in components (like a `SheetTrigger` wrapping an icon), applying the class to the inner element makes it visually hidden but still focusable by keyboard and readable by screen readers.
**Action:** Always apply responsive hiding utility classes to the outermost focusable wrapper/element (e.g. `SheetTrigger`, `Button`) rather than the inner content.
