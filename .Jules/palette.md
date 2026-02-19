## 2025-05-15 - [Accessible Responsive Buttons]
**Learning:** Buttons that use responsive classes to hide text labels on smaller screens (e.g., \`hidden sm:inline\`) become icon-only on mobile. Without a dynamic \`aria-label\`, screen readers may not provide enough context when the button state changes (e.g., from "Open" to "Close").
**Action:** Always provide a state-aware \`aria-label\` to buttons that become icon-only on mobile to maintain accessibility.
