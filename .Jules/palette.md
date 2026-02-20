## 2025-05-15 - [Accessible Responsive Buttons]
**Learning:** Buttons that use responsive classes to hide text labels on smaller screens (e.g., \`hidden sm:inline\`) become icon-only on mobile. Without a dynamic \`aria-label\`, screen readers may not provide enough context when the button state changes (e.g., from "Open" to "Close").
**Action:** Always provide a state-aware \`aria-label\` to buttons that become icon-only on mobile to maintain accessibility.
## 2025-05-15 - Navigation State & Accessibility
**Learning:** Providing explicit visual and semantic (ARIA) feedback for the current navigation route significantly improves user orientation and accessibility, especially in sites with distinct landing pages. Standardizing on a single icon library (Lucide) improves maintainability and visual consistency.
**Action:** Always use `aria-current="page"` and `useLocation` to implement active states in headers. Ensure mobile toggles have dynamic `aria-label` values.
