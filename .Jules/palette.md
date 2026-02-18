## 2025-05-14 - [Robust Third-Party Widget Fallbacks]
**Learning:** Third-party scripts like Calendly can be blocked by ad-blockers or fail to load. Relying solely on their JavaScript API can lead to broken interactions.
**Action:** Always provide a simple `window.open` fallback for third-party widget triggers to ensure the user can still complete their task.

## 2025-05-14 - [Search Input Consistency]
**Learning:** `type="search"` provides a better mobile keyboard but introduces a non-standard, un-styleable "cancel" button in some browsers (like Safari/Chrome).
**Action:** When implementing a custom clear button for search inputs, use CSS (`::-webkit-search-cancel-button { -webkit-appearance: none; }`) to hide the default browser icon and ensure a consistent, accessible experience.
