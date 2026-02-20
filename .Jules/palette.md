## 2025-05-15 - Navigation State & Accessibility
**Learning:** Providing explicit visual and semantic (ARIA) feedback for the current navigation route significantly improves user orientation and accessibility. However, the visual weight of the indicator should be "reserved" (e.g., 1px border with transparency) rather than "firm" (2px solid) to maintain a professional and clean aesthetic in this project.
**Action:** Always use `aria-current="page"` and `useLocation` to implement active states. Prefer subtle indicators (1px, lower opacity) for active navigation links.
