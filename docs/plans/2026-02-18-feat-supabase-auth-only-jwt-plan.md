---
title: Switch to Supabase Auth Only (JWT on Server)
type: feat
status: active
date: 2026-02-18
---

# Switch to Supabase Auth Only (JWT on Server)

## Overview

Migrate from the current **dual auth** setup (Supabase Auth on client + Express session + `profiles` table on server) to **single auth**: Supabase Auth only. Students and admin use the same login form; the server verifies the Supabase JWT (Bearer token) and uses the verified user + role for authorization. Express session and password-based login against `profiles` are removed.

## Problem Statement / Motivation

- **Current state:** Client logs in via Supabase Auth; server uses Express session + `profiles` (email/password, bcrypt). The client never calls `POST /api/auth/login`, so the server never has a session. Dashboard and admin API calls that depend on `req.session` would 401.
- **Goal:** One source of truth for identity (Supabase Auth). Same login for students and admin; role (student vs admin) determines access. Server protects routes by verifying the Supabase JWT and resolving user/role.

## Proposed Solution

**Approach A (chosen):** Supabase Auth + JWT on the server.

1. **Client:** Continue using Supabase Auth for login/logout. Send **`Authorization: Bearer <access_token>`** on every API request (from `supabase.auth.getSession()`). No session cookie for auth.
2. **Server:** Add middleware that extracts the Bearer token, verifies it via Supabase (e.g. `supabase.auth.getUser(token)` or `jose` + JWKS), and sets `req.user` (id = JWT `sub`, role from profile or app_metadata). Replace all `req.session.userId` / `req.session.user` with `req.user`. Remove Express session and login/logout routes.
3. **Role:** Keep `profiles` for app data (sessions_held, time_remaining, bonus_test_review_time, username, role). Use **Supabase user id (JWT `sub`)** as canonical id; `profiles.id` = `sub`. Resolve role from profile (or optionally mirror to Supabase `app_metadata` for JWT claims).
4. **Current user:** Replace or repurpose `GET /api/auth/me` to require Bearer token, verify JWT, load profile by `sub`, return user + profile fields. Client calls it after auth and merges into auth context (replacing hardcoded stats in `formatUser()`).
5. **401 handling:** On 401 (missing/invalid/expired token), client optionally tries one refresh via `supabase.auth.refreshSession()`; on failure, clear session and redirect to `/login`.

## Technical Considerations

### Architecture

- **JWT verification:** Use Supabase server-side client with anon key and `getUser(token)` (validates with Auth server), or `jose` + JWKS for local verification. Docs: [Supabase JWTs](https://supabase.com/docs/guides/auth/jwts), [auth.getUser](https://supabase.com/docs/reference/javascript/auth-getuser).
- **Env vars (server):** `SUPABASE_URL` (project URL), `SUPABASE_ANON_KEY` (or publishable key). No `SESSION_SECRET` for auth (can remove after session removal).
- **Profiles table:** Keep; drop or stop using `password` column. Ensure `profiles.id` = Supabase Auth user id. New users: create profile on first authenticated request (id = sub, role = "student", balances = 0) or require admin to create (invite-only). Recommendation: **auto-create profile** on first use for student to avoid broken first login.
- **Admin password reset:** Implement via [Supabase Admin API](https://supabase.com/docs/reference/javascript/auth-admin-updateuserbyid) (`auth.admin.updateUserById(id, { password })`) or remove route and document that admins reset passwords in Supabase Dashboard. Fix client/server method mismatch (client uses POST; server expects PUT).

### Security

- Validate JWT: signature (via JWKS or Auth server), `exp`, and optionally `iss`/`aud` (e.g. `aud === "authenticated"`, `iss` = project auth URL).
- Token in header only: `Authorization: Bearer <token>`. Supabase client default (localStorage for session) is acceptable unless policy requires otherwise; document choice and 401 + refresh + redirect behavior.
- Do not trust `user_metadata` for role (user-editable); use `app_metadata` or profile table.

### Files to Change (summary)

| Area | Files |
|------|--------|
| Server auth | `server/index.ts` (remove session middleware), `server/routes.ts` (add JWT middleware, replace session checks, remove/login/logout routes, update `/api/auth/me`) |
| Server storage | `server/storage.ts` (optional: get user/role by id = sub; `seedAdminUser` may create Supabase user or be removed) |
| Client auth | `client/src/lib/auth.tsx` (get real user from GET /api/auth/me; remove hardcoded stats) |
| Client API | `client/src/lib/queryClient.ts` (attach Bearer token to all requests; 401 handler: refresh then redirect) |
| Schema | `shared/schema.ts` (profiles: consider dropping `password` or marking unused) |
| Env | `.env.example` (document SUPABASE_URL, SUPABASE_ANON_KEY for server; SESSION_SECRET can be removed after migration) |

## Acceptance Criteria

### Auth middleware

- [ ] Extract `Authorization: Bearer <token>`; if missing on protected route → 401 with body e.g. `{ message: "Not authenticated" }`.
- [ ] Verify JWT (signature, expiry; optionally `iss`/`aud`) via Supabase `getUser(token)` or jose + JWKS.
- [ ] Set `req.user` with `id` = JWT `sub` and `role` from profile (or app_metadata). If profile required and missing, 403 or auto-create profile per decision.
- [ ] `requireAdmin`: require `req.user` and `req.user.role === "admin"`; return 403 otherwise.

### Protected routes

- [ ] Dashboard and time-addons: require `req.user`; use `req.user.id` (JWT `sub`) for all storage calls.
- [ ] All current admin routes: use `requireAdmin` backed by `req.user.role`.

### Current user endpoint

- [ ] `GET /api/auth/me` (or `/api/user/me`) accepts Bearer only; returns 401 if invalid/missing; returns `{ user: { id, email, username?, role, sessions_held, time_remaining, bonus_test_review_time } }` from profile keyed by `sub`.

### Client

- [ ] All API requests to protected endpoints send `Authorization: Bearer <access_token>` (from `supabase.auth.getSession()`). No reliance on session cookie for auth.
- [ ] On 401: optional single refresh via `supabase.auth.refreshSession()`; on failure or no refresh, clear Supabase session and redirect to `/login`.
- [ ] After login or on app load with valid session, fetch current user (GET /api/auth/me) and merge into auth context so dashboard/header show real stats (no hardcoded values in `formatUser()` for app data).

### Data and profiles

- [ ] `profiles.id` = Supabase user id (JWT `sub`). Remove or stop using `profiles.password`.
- [ ] New users: auto-create profile on first authenticated request (id = sub, role = "student", balances = 0) or document invite-only flow.
- [ ] Admin password reset: implemented via Supabase Admin API or removed and documented.

### Removal

- [ ] Express session middleware, session store (MemoryStore), and all `req.session` usage removed.
- [ ] `POST /api/auth/login` and `POST /api/auth/logout` removed (or logout as no-op returning 200).
- [ ] Session type declaration (`declare module 'express-session'`) removed.

### Edge cases

- [ ] Missing token → 401; invalid/expired token → 401; wrong audience/issuer → 401.
- [ ] Student accessing admin route → 403 with consistent message (e.g. "Admin access required").
- [ ] First load with valid token but no profile → create profile or 403 per decision.

## Success Metrics

- Single login (Supabase) works for both students and admin; dashboard and admin features load without 401.
- No Express session or `profiles`-based password auth in use.
- All 18 previously session-protected routes are protected by JWT middleware and behave correctly for student vs admin.

## Dependencies & Risks

- **Supabase project:** JWT signing (asymmetric keys or legacy secret) and Auth settings must allow server-side verification. Ensure project URL and anon key are in server env.
- **Existing users:** If there are existing `profiles` rows with different ids than Supabase Auth user ids, a migration or backfill is needed so `profiles.id` = auth user id (or a mapping is used). New deployments can start with id = sub from first login.
- **Admin seed:** Current `seedAdminUser` inserts into `profiles` with bcrypt password; replace with creating an admin user in Supabase (Dashboard or Admin API) and optionally a profile row with role = "admin", or document manual setup.

## Implementation Phases

### Phase 1: Server JWT middleware and profile resolution

- Add server-side Supabase client (SUPABASE_URL, SUPABASE_ANON_KEY).
- Implement `requireAuth` middleware: extract Bearer token, call `supabase.auth.getUser(token)` (or verify with jose + JWKS), set `req.user = { id: sub, email?, role }`. Resolve role from profile by `sub` (or from app_metadata if present). Auto-create profile on first use if missing (id = sub, role = "student").
- Implement `requireAdmin`: require `req.user` and `req.user.role === "admin"`.
- Replace every `req.session.userId` / `req.session.user` with `req.user` in routes.
- Update `GET /api/auth/me` to use JWT + profile; return full user + profile fields.

### Phase 2: Remove Express session and legacy auth

- Remove Express session middleware and MemoryStore from `server/index.ts`.
- Remove `POST /api/auth/login` and `POST /api/auth/logout` (or make logout a no-op).
- Remove `declare module 'express-session'` and any session type extensions.
- Remove or repurpose `seedAdminUser` (e.g. ensure admin exists in Supabase + profile with role admin).

### Phase 3: Client token attachment and 401 handling

- In `apiRequest` and `getQueryFn` (or a shared fetch wrapper), get access token from `supabase.auth.getSession()` and set `Authorization: Bearer <token>` on every request. Keep `credentials: "include"` only if needed for non-auth cookies.
- Add global 401 handling: on 401, optionally call `supabase.auth.refreshSession()` and retry once; on failure, clear session and redirect to `/login`.
- After login (and on app load when session exists), call `GET /api/auth/me` and merge result into auth context; remove hardcoded `sessions_held`, `time_remaining`, `bonus_test_review_time` from `formatUser()`.

### Phase 4: Profile and admin adjustments

- Schema: drop or ignore `profiles.password`; ensure profile creation uses `id = sub`.
- Admin password reset: implement with Supabase Admin API or remove route and document. Fix client method (POST vs PUT) if route is kept.
- Manual test: student login, admin login, dashboard data, admin routes, 401/403 behavior, first-load and refresh.

## References & Research

### Internal

- Current auth: `client/src/lib/auth.tsx` (Supabase Auth), `server/routes.ts` (session, requireAdmin), `server/storage.ts` (getUserByEmail, profiles), `shared/schema.ts` (profiles table).
- API usage: `client/src/lib/queryClient.ts` (credentials: "include"), `client/src/pages/Dashboard.tsx`, `client/src/pages/AdminDashboard.tsx`, `client/src/pages/AdminBlog.tsx`.

### External

- [Supabase JWTs (verify, JWKS)](https://supabase.com/docs/guides/auth/jwts)
- [Supabase auth.getUser (custom JWT)](https://supabase.com/docs/reference/javascript/auth-getuser)
- [JWT Signing Keys](https://supabase.com/docs/guides/auth/signing-keys)
- [JWT claims (aud, exp, iss)](https://supabase.com/docs/guides/auth/jwt-fields)
- [Custom claims / RBAC](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)

### Related

- Brainstorm: Approach A (Supabase Auth + JWT on server); same login for students and admin; role from profile or app_metadata.
- SpecFlow analysis: gaps (e.g. /api/auth/me replacement, profile creation, admin password reset, 401 handling) incorporated into this plan.
