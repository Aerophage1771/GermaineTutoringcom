## 2026-02-19 - [Insecure Password Fallback]
**Vulnerability:** The `validatePassword` method in `server/storage.ts` contained a fallback that allowed plain-text password comparison if the stored password did not start with a bcrypt identifier (`$2`).
**Learning:** This pattern allowed insecure password storage to coexist with hashed passwords, creating a significant security gap where legacy or improperly created accounts were vulnerable to direct password exposure if the database was compromised.
**Prevention:** Always enforce strong hashing (e.g., bcrypt, argon2) for all passwords and remove any conditional logic that allows plain-text comparisons in authentication flows.
# Sentinel's Journal

## 2025-05-15 - Hardening Express Sessions and Headers
**Vulnerability:** Missing security headers and insecure session cookie configuration.
**Learning:** In modern Express apps, it's critical to set `trust proxy` when using `secure: true` cookies if the app is deployed behind a proxy (like Replit or Netlify), otherwise the session will fail as the cookie won't be sent over what Express perceives as an insecure connection.
**Prevention:** Always implement a security hardening middleware that sets standard headers (HSTS, CSP, X-Frame-Options) and ensure session secrets are enforced in production via environment variable checks.
