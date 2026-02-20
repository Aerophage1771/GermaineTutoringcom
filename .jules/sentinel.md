## 2026-02-19 - [Insecure Password Fallback]
**Vulnerability:** The `validatePassword` method in `server/storage.ts` contained a fallback that allowed plain-text password comparison if the stored password did not start with a bcrypt identifier (`$2`).
**Learning:** This pattern allowed insecure password storage to coexist with hashed passwords, creating a significant security gap where legacy or improperly created accounts were vulnerable to direct password exposure if the database was compromised.
**Prevention:** Always enforce strong hashing (e.g., bcrypt, argon2) for all passwords and remove any conditional logic that allows plain-text comparisons in authentication flows.
# Sentinel's Journal

## 2025-05-15 - Hardening Express Sessions and Headers
**Vulnerability:** Missing security headers and insecure session cookie configuration.
**Learning:** In modern Express apps, it's critical to set `trust proxy` when using `secure: true` cookies if the app is deployed behind a proxy (like Replit or Netlify), otherwise the session will fail as the cookie won't be sent over what Express perceives as an insecure connection.
**Prevention:** Always implement a security hardening middleware that sets standard headers (HSTS, CSP, X-Frame-Options) and ensure session secrets are enforced in production via environment variable checks.

## 2025-02-20 - [Sensitive Data Exposure in Logs and Errors]
**Vulnerability:** The Express logging middleware was capturing and logging the entire JSON response body for API requests. Additionally, the global error handler was leaking specific error messages (including potentially sensitive internal details) to the client in production.
**Learning:** Custom logging middleware that overrides `res.json` can easily lead to unintended data exposure if not strictly limited to metadata. Error handlers must be environment-aware to provide helpful messages in development while masking internals in production.
**Prevention:** Restrict API logging to request metadata (method, path, status, duration). Ensure error handlers return generic messages for 5xx errors in production and use server-side logging for internal error tracking.
