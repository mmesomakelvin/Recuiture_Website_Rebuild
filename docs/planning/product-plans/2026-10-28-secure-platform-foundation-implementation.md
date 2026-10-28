# Secure Platform Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide working candidate/employer sign-up and sign-in, a usable PostgreSQL client, and server-enforced role and company boundaries for later recruitment features.

**Architecture:** Supabase Auth owns identity and session cookies; Prisma owns the platform user, role, and company membership. A server-only actor layer authorises every data request and mutation. Next.js Proxy may redirect guests for convenience but is never the sole security control.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase SSR, Prisma 7 with PostgreSQL driver adapter, Zod, Vitest, Tailwind CSS v4.

**Spec:** [Job trust and candidate updates](2026-10-28-job-trust-and-candidate-updates-design.md), especially “Data and permission implications”; [Information architecture](../architecture/information-architecture.md).

## Global Constraints

- Work in `web/`. Keep the Design OS `product/` files as planning inputs, not production backend code.
- Public registration may create only `CANDIDATE` or `EMPLOYER`; `RECRUITER` and `ADMIN` require a trusted staff process.
- Use the verified Supabase identity and the database role for authorisation; never trust public user metadata for a privileged role.
- Protect all mutations and reads close to the data source; no client-only role or company checks.
- Use Tailwind v4 built-in utilities for UI; no `tailwind.config.js`.
- Upgrade vulnerable production packages before exposing account endpoints; track [#1](https://github.com/mmesomakelvin/Recuiture_Website_Rebuild/issues/1) and [#5](https://github.com/mmesomakelvin/Recuiture_Website_Rebuild/issues/5).
- Use a disposable local/test PostgreSQL database for migrations and integration checks; never reset or migrate an unknown live database without explicit approval.
- Use an isolated feature branch/worktree for execution and push each completed task commit for review; do not deploy automatically.

## Review Focus

1. Public form submits `ADMIN` or `RECRUITER`: server rejects it; Task 2 test.
2. Signed-in employer changes a submitted company ID: server still scopes to their membership; Task 3 test.
3. Unauthenticated request targets a dotted private path such as `/admin/export.csv`: it is denied; Task 4 test.
4. Missing `DATABASE_URL` or Supabase configuration: boot or request fails clearly without a default database; Task 1 test.
5. A repeated auth callback or webhook cannot duplicate a platform user or upgrade their role; Task 2 test.

---

## File map

| File | Responsibility |
| --- | --- |
| `web/package.json`, `web/package-lock.json`, `web/vitest.config.ts` | Patched packages and test command/alias. |
| `web/prisma.config.ts`, `web/prisma/schema.prisma`, `web/prisma/migrations/*`, `web/src/lib/prisma.ts` | PostgreSQL configuration, migration, Prisma 7 adapter. |
| `web/src/lib/auth/actor.ts`, `web/src/lib/auth/permissions.ts` | Server-only identity, role, and company access. |
| `web/src/lib/auth/registration.ts`, `web/src/lib/validations/index.ts` | Safe public account role and database provisioning. |
| `web/src/app/api/auth/register/route.ts`, `web/src/app/auth/callback/route.ts` | Account creation and confirmation callback. |
| `web/src/app/(auth)/sign-in/page.tsx`, `web/src/app/(auth)/create-account/page.tsx` | Minimal usable account entry. |
| `web/src/proxy.ts` | Cookie refresh and guest redirects; replaces broad `middleware.ts` exceptions. |
| `web/src/lib/auth/*.test.ts` | Behaviour tests for registration and access decisions. |

### Task 1: Patched runtime, Prisma adapter, and test harness

**Files:** Modify `web/package.json`, lockfile, `web/prisma.config.ts`, `web/src/lib/prisma.ts`; create `web/vitest.config.ts`, `web/src/lib/prisma.test.ts`.

**Interfaces:** `createPrismaClient(connectionString?: string): PrismaClient` throws when the URL is missing; exports `prisma: PrismaClient` from `@/lib/prisma`. `npm run test` runs Vitest in a Node environment.

- [ ] **Step 1: Write failing `requires_database_url` and `connects_to_test_database` tests.** Assert `expect(() => createPrismaClient()).toThrow('DATABASE_URL')` with the env unset, then `expect(await client.$connect()).toBeUndefined()` against the disposable database.
- [ ] **Step 2: Run `npm run test -- src/lib/prisma.test.ts`.** Expected: failure because the test command/adapter is not ready.
- [ ] **Step 3: Upgrade Next.js and other audited production packages to patched releases; install Vitest, `@prisma/adapter-pg`, `pg`, and types.** Configure the Prisma 7 adapter in `src/lib/prisma.ts` and a dedicated test database URL; do not print secrets.
- [ ] **Step 4: Run `npm audit --omit=dev`, `npx prisma validate`, `npx prisma generate`, the targeted test, and `npm run build`.** Expected: no high/critical audited production findings, valid schema, passing test/build. If an advisory has no fix, record the exposure and stop release work rather than claiming a clean audit.
- [ ] **Step 5: Commit and push** the dependency, configuration, and test files as one reversible baseline change.

### Task 2: Public account creation with a server-owned role

**Files:** Modify `web/prisma/schema.prisma`, `web/src/lib/validations/index.ts`; create a migration, `web/src/lib/auth/registration.ts`, `web/src/lib/auth/registration.test.ts`, `web/src/app/api/auth/register/route.ts`, `web/src/app/auth/callback/route.ts`.

**Interfaces:** `registerPublicUser(input: { email: string; password: string; fullName?: string; role: 'CANDIDATE' | 'EMPLOYER' }): Promise<{ supabaseId: string; role: 'CANDIDATE' | 'EMPLOYER' }>`; callback synchronises identity without reading a mutable metadata role. Add `RECRUITER` to database roles for staff provisioning, never to public input.

- [ ] **Step 1: Write failing `rejects_public_staff_roles` and `registration_is_idempotent` tests.** Assert `expect(signUpSchema.safeParse({ ...validInput, role: 'ADMIN' }).success).toBe(false)`, the same for `RECRUITER`, and `expect(secondUser.id).toBe(firstUser.id)` with `expect(secondUser.role).toBe('CANDIDATE')` after a replay with forged metadata.
- [ ] **Step 2: Run `npm run test -- src/lib/auth/registration.test.ts`.** Expected: tests fail on the current schema/route.
- [ ] **Step 3: Implement server-owned role assignment and idempotent `User` upsert keyed by Supabase ID.** Use a trusted process for staff role grants; never let a public request or auth metadata set staff roles. Handle email-confirmation and partial Supabase/database failure without granting extra access.
- [ ] **Step 4: Run targeted tests, `npx prisma validate`, migration against the disposable test database, and `npm run build`.** Expected: all pass; an attempted staff role remains forbidden.
- [ ] **Step 5: Commit and push** registration, migration, and tests.

### Task 3: Server-side actor and company authorisation

**Files:** Create `web/src/lib/auth/actor.ts`, `web/src/lib/auth/permissions.ts`, `web/src/lib/auth/permissions.test.ts`; modify `web/src/lib/supabase/admin.ts` to mark it server-only.

**Interfaces:** `getCurrentActor(): Promise<Actor | null>` returns `{ id, supabaseId, role, isActive }` from verified identity and Prisma; `requireRole(actor: Actor | null, allowed: UserRole[]): Actor`; `requireCompanyAccess(actor: Actor | null, companyId: string): Promise<Actor>` checks ownership/management in the database.

- [ ] **Step 1: Write failing `denies_wrong_role` and `denies_cross_company` tests.** Assert `expect(() => requireRole(null, ['EMPLOYER'])).toThrow('UNAUTHORIZED')`, `expect(() => requireRole(candidate, ['EMPLOYER'])).toThrow('FORBIDDEN')`, and `await expect(requireCompanyAccess(employerA, companyB.id)).rejects.toThrow('FORBIDDEN')`; include an inactive actor and staff role case.
- [ ] **Step 2: Run `npm run test -- src/lib/auth/permissions.test.ts`.** Expected: failure until the access layer exists.
- [ ] **Step 3: Implement server-only actor and permission helpers.** Read the role from Prisma, verify the Supabase session with the supported SSR method, and return narrow actor data. Apply these helpers in every later route rather than duplicating role logic.
- [ ] **Step 4: Run targeted tests, TypeScript check, and build.** Expected: all forbidden cases reject even if a caller forges route parameters or JSON fields.
- [ ] **Step 5: Commit and push** access helpers and tests.

### Task 4: Route policy and account entry

**Files:** Replace `web/src/middleware.ts` with `web/src/proxy.ts`; create `web/src/lib/auth/route-policy.ts`, `web/src/lib/auth/route-policy.test.ts`, `web/src/app/(auth)/sign-in/page.tsx`, `web/src/app/(auth)/create-account/page.tsx`; update `web/src/components/layout/Header.tsx` with working links only after routes exist.

**Interfaces:** `isPublicPath(pathname: string): boolean` recognises exact public prefixes and static assets; `proxy(request: NextRequest): Promise<NextResponse>` handles cookie refresh and redirects guests without replacing Task 3 authorisation.

- [ ] **Step 1: Write failing `private_dotted_paths_stay_private` and `safe_return_path` tests.** Assert `expect(isPublicPath('/admin/export.csv')).toBe(false)`, the same for `/api/upload` and `/api/webhooks`, `expect(isPublicPath('/jobs/example')).toBe(true)`, and an external `redirectTo` is reduced to a safe local path; include a real static asset case.
- [ ] **Step 2: Run `npm run test -- src/lib/auth/route-policy.test.ts`.** Expected: dotted/private and blanket API bypass cases fail.
- [ ] **Step 3: Implement explicit path rules, Supabase cookie refresh, sign-in and create-account pages.** Each future API handler still enforces its own auth; webhook handlers verify signatures. Avoid a role lookup in Proxy.
- [ ] **Step 4: Run targeted tests, `npm run lint`, and `npm run build`; manually check candidate/employer sign-up and redirect in a local test environment.** Expected: no route bypass and a usable account entry.
- [ ] **Step 5: Commit** route policy and account screens. Push this foundation slice for user testing before either feature plan starts.

## Execution order and release gate

Complete Tasks 1–4 in order, with a fresh review at each commit. Do not expose verification or application endpoints until role and tenant tests pass. The next plan is [trusted job listings](2026-10-28-trusted-job-listings-implementation.md); candidate updates follow that. Official reference points: [Prisma 7 PostgreSQL adapter](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql), [Next.js authorisation guidance](https://nextjs.org/docs/app/guides/authentication), and [Supabase SSR guidance](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs&queryGroups=framework).
