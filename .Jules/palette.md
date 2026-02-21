## 2025-05-22 - Persistent Scroll State on Load
**Learning:** Browsers often restore scroll position on page refresh. If UI elements (like a 'Scroll to Top' button) depend on scroll position but only listen for `scroll` events, they will remain in their default (hidden) state after a refresh until the user scrolls again.
**Action:** Always call the visibility toggle logic immediately within `useEffect` on mount to synchronize UI state with the current scroll position.

## 2025-05-22 - Toggling Visibility for A11y
**Learning:** Using `opacity-0` alone hides an element visually but leaves it in the keyboard tab order and screen reader tree.
**Action:** Use Tailwind's `invisible` class (which sets `visibility: hidden`) in conjunction with `opacity-0` to properly remove hidden elements from accessibility flows while maintaining CSS transitions.
