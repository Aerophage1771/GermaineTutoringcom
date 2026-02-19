## 2026-02-19 - [Insecure Password Fallback]
**Vulnerability:** The `validatePassword` method in `server/storage.ts` contained a fallback that allowed plain-text password comparison if the stored password did not start with a bcrypt identifier (`$2`).
**Learning:** This pattern allowed insecure password storage to coexist with hashed passwords, creating a significant security gap where legacy or improperly created accounts were vulnerable to direct password exposure if the database was compromised.
**Prevention:** Always enforce strong hashing (e.g., bcrypt, argon2) for all passwords and remove any conditional logic that allows plain-text comparisons in authentication flows.
