## 2025-05-15 - Navigation State & Accessibility
**Learning:** Providing explicit visual and semantic (ARIA) feedback for the current navigation route significantly improves user orientation and accessibility, especially in sites with distinct landing pages. Standardizing on a single icon library (Lucide) improves maintainability and visual consistency.
**Action:** Always use `aria-current="page"` and `useLocation` to implement active states in headers. Ensure mobile toggles have dynamic `aria-label` values.
