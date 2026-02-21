## 2025-05-22 - Persistent Scroll State on Load
**Learning:** Browsers often restore scroll position on page refresh. If UI elements (like a 'Scroll to Top' button) depend on scroll position but only listen for `scroll` events, they will remain in their default (hidden) state after a refresh until the user scrolls again.
**Action:** Always call the visibility toggle logic immediately within `useEffect` on mount to synchronize UI state with the current scroll position.

## 2025-05-22 - Toggling Visibility for A11y
**Learning:** Using `opacity-0` alone hides an element visually but leaves it in the keyboard tab order and screen reader tree.
**Action:** Use Tailwind's `invisible` class (which sets `visibility: hidden`) in conjunction with `opacity-0` to properly remove hidden elements from accessibility flows while maintaining CSS transitions.

## 2025-05-23 - Skip Link Implementation for Keyboard Navigation
**Learning:** Implementing a "Skip to Main Content" link is a high-impact, low-effort accessibility improvement for sites with complex navigation headers. It allows keyboard users and screen readers to bypass repetitive navigation links and jump directly to the primary content.
**Action:** Use a visually hidden link that becomes visible on focus, and ensure the target element (usually `<main>`) has an ID and `tabIndex={-1}` to receive programmatic focus correctly.
