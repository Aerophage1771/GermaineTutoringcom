## 2025-02-27 - Standardizing Deletion UX
**Learning:** Replaced custom inline deletion confirmation with Radix UI `AlertDialog`. Standardizing destructive action confirmations in a modal provides better focus and follows accessibility best practices (focus trapping, keyboard interaction).
**Action:** Favor Radix UI `AlertDialog` for destructive actions in Admin UIs to ensure accessible and consistent interactions.

## 2025-02-27 - Icon-only Button Accessibility
**Learning:** Many buttons in the admin panel used icons with text labels hidden on mobile via Tailwind classes (`hidden sm:inline`). This leaves the button with no accessible name on mobile.
**Action:** Always provide `aria-label` to buttons that become icon-only on smaller screens, even if they have a hidden text span.
