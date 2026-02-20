## 2025-05-14 - [Robust Third-Party Widget Fallbacks]
**Learning:** Third-party scripts like Calendly can be blocked by ad-blockers or fail to load. Relying solely on their JavaScript API can lead to broken interactions.
**Action:** Always provide a simple `window.open` fallback for third-party widget triggers to ensure the user can still complete their task.

## 2025-05-14 - [Search Input Consistency]
**Learning:** `type="search"` provides a better mobile keyboard but introduces a non-standard, un-styleable "cancel" button in some browsers (like Safari/Chrome).
**Action:** When implementing a custom clear button for search inputs, use CSS (`::-webkit-search-cancel-button { -webkit-appearance: none; }`) to hide the default browser icon and ensure a consistent, accessible experience.
## 2025-05-15 - Navigation State & Accessibility
**Learning:** Providing explicit visual and semantic (ARIA) feedback for the current navigation route significantly improves user orientation and accessibility, especially in sites with distinct landing pages. Standardizing on a single icon library (Lucide) improves maintainability and visual consistency.
**Action:** Always use `aria-current="page"` and `useLocation` to implement active states in headers. Ensure mobile toggles have dynamic `aria-label` values.
