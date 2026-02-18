# Sentinel's Journal

## 2025-05-15 - Hardening Express Sessions and Headers
**Vulnerability:** Missing security headers and insecure session cookie configuration.
**Learning:** In modern Express apps, it's critical to set `trust proxy` when using `secure: true` cookies if the app is deployed behind a proxy (like Replit or Netlify), otherwise the session will fail as the cookie won't be sent over what Express perceives as an insecure connection.
**Prevention:** Always implement a security hardening middleware that sets standard headers (HSTS, CSP, X-Frame-Options) and ensure session secrets are enforced in production via environment variable checks.
