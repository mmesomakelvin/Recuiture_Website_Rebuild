# Trusted Job Listings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let checked employers publish current vacancies, let candidates identify and report them, and hide stale roles without losing their history.

**Architecture:** Prisma stores verification, moderation, revision, report, and confirmation state. Server-only job services decide whether a vacancy can publish and what the public may see. A protected, idempotent maintenance endpoint sends renewal reminders and pauses overdue jobs; public pages read only approved current content.

**Tech Stack:** Next.js 16 App Router, TypeScript, Prisma 7/PostgreSQL, Supabase Auth, Zod, Vitest, Tailwind CSS v4.

**Spec:** [Job trust and candidate updates](2026-10-28-job-trust-and-candidate-updates-design.md), sections 1–3 and “Acceptance examples”. **Prerequisite:** [Secure platform foundation](2026-10-28-secure-platform-foundation-implementation.md) Tasks 1–4.

## Global Constraints

- The company and its first job require staff approval before publication; later clean jobs may publish directly.
- Organisations may submit alternative identity/hiring-authority evidence for staff review.
- Reconfirmation is required every **30 calendar days**; reminders are due **seven and two days** before expiry.
- A role past its deadline or confirmation date is absent from public search and cannot accept applications. A paused direct URL is read-only.
- Renewal preserves the original `publishedAt` value. An edit awaiting review never replaces the approved public content.
- One report does not automatically hide a job; staff can pause a credible case.
- All company, job, report, and staff operations enforce server-side role/ownership checks from the foundation plan.
- No live page may present illustrative preview jobs as genuine vacancies.
- Use the isolated feature branch started in the foundation plan; push each completed task commit for review.

## Review Focus

1. Employer submits a job for another company's ID: reject regardless of JSON or URL; Task 3 test.
2. Verified employer submits a first job: it remains private until staff approval; Task 3 test.
3. Major edit is rejected: old approved content remains public; Task 3 test.
4. Maintenance runs twice near expiry: one reminder and one pause event only; Task 6 test.
5. A guest submits repeated false reports: rate limit without hiding the job; Task 5 test. A staff safety pause shows only a generic unavailable message on the direct URL; Task 4 test.

---

## File map

| File | Responsibility |
| --- | --- |
| `web/prisma/schema.prisma`, `web/prisma/migrations/*` | Verification, moderation, revision, report, and confirmation data. |
| `web/src/lib/jobs/publication-policy.ts`, `web/src/lib/jobs/publication-policy.test.ts` | Pure publication decision. |
| `web/src/lib/companies/verification.ts`, `web/src/lib/companies/verification.test.ts` | Employer submission and staff decision. |
| `web/src/lib/jobs/moderation.ts`, `web/src/lib/jobs/moderation.test.ts` | Submit/review/revise jobs and audit decisions. |
| `web/src/lib/jobs/public-query.ts`, `web/src/lib/jobs/public-query.test.ts` | Only current approved listings and read-only paused detail. |
| `web/src/lib/jobs/reports.ts`, `web/src/lib/jobs/reports.test.ts` | Visitor reports and staff triage. |
| `web/src/lib/jobs/freshness.ts`, `web/src/lib/jobs/freshness.test.ts` | Renewal, reminders, and idempotent pausing. |
| `web/src/app/api/employer/*`, `web/src/app/api/admin/*`, `web/src/app/api/jobs/*`, `web/src/app/api/internal/jobs/maintenance/route.ts` | Thin validated HTTP entry points using the services. |
| `web/src/app/(marketing)/jobs/*`, `web/src/app/(employer)/employer/*`, `web/src/app/(staff)/admin/*` | Candidate, employer, and staff views of the same data. |

### Task 1: Schema and publication decision

**Files:** Modify `web/prisma/schema.prisma`; create migration and `web/src/lib/jobs/publication-policy.ts`, `.test.ts`.

**Interfaces:** `decidePublication(input: { verificationStatus: CompanyVerificationStatus; approvedJobCount: number; hasHold: boolean }): 'FORBIDDEN' | 'PENDING_REVIEW' | 'PUBLISHED'`. Add `CompanyVerificationStatus`, `PENDING_REVIEW`/`PAUSED` job states, `pauseReason`, `JobRevision`, `JobReport`, `lastConfirmedAt`, a unique `Notification.eventKey` for reminder cycles, and audit relations. Keep approval evidence private.

- [ ] **Step 1: Write failing `publication_requires_trust` tests.** Assert `expect(decidePublication(unverified)).toBe('FORBIDDEN')`, `expect(decidePublication(firstJob)).toBe('PENDING_REVIEW')`, `expect(decidePublication(laterCleanJob)).toBe('PUBLISHED')`, and `expect(decidePublication(laterHeldJob)).toBe('PENDING_REVIEW')`.
- [ ] **Step 2: Run `npm run test -- src/lib/jobs/publication-policy.test.ts`.** Expected: fail until the policy/schema exists.
- [ ] **Step 3: Implement the pure decision and schema migration.** Use an explicit status enum instead of treating the existing `Company.isVerified` boolean as the whole review history; backfill safely if existing company data is present.
- [ ] **Step 4: Run targeted test, `npx prisma validate`, migration against a disposable test database, and `npm run build`.** Expected: all pass.
- [ ] **Step 5: Commit** policy and schema; push this data slice for review.

### Task 2: Company verification

**Files:** Create `web/src/lib/companies/verification.ts`, `.test.ts`, employer company onboarding and verification forms/routes, and staff company queue/decision route; modify `web/src/lib/validations/index.ts`.

**Interfaces:** `createCompany(actor, input: { name: string; website?: string; description?: string }): Promise<Company>` assigns the employer actor as owner; `submitVerification(actor, companyId, input: { hiringContactEmail: string; website?: string; registrationId?: string; evidenceNote?: string }): Promise<CompanyVerification>`; `reviewVerification(staffActor, companyId, decision: { outcome: 'APPROVE' | 'CHANGES_REQUESTED' | 'SUSPEND'; reason: string }): Promise<CompanyVerification>`.

- [ ] **Step 1: Write failing `creates_owned_company`, `approves_alternate_evidence`, and `staff_only_approval` tests.** Assert the new company owner matches the employer actor, `expect(company.verificationStatus).toBe('VERIFIED')` after staff accepts alternative proof, and `await expect(reviewVerification(employer, id, decision)).rejects.toThrow('FORBIDDEN')`; cover duplicate company creation, change requests, and audit history.
- [ ] **Step 2: Run `npm run test -- src/lib/companies/verification.test.ts`.** Expected: fail before the service exists.
- [ ] **Step 3: Implement employer-owned company creation, verification submission, decision service, employer forms, and staff queue.** Keep evidence staff-only; record decision time, actor, and reason in `AuditLog`.
- [ ] **Step 4: Run targeted tests, lint, and build; manually verify the submit/approve path with test accounts.** Expected: an employer can draft while pending but cannot publish.
- [ ] **Step 5: Commit and push** verification as its own reviewable slice.

### Task 3: Vacancy publication and approved revisions

**Files:** Create `web/src/lib/jobs/moderation.ts`, `.test.ts`, employer job form/routes, and staff job queue/decision routes.

**Interfaces:** `submitJob(actor, input: Omit<CreateJobInput, 'companyId'>): Promise<Job>`; `reviewJob(staffActor, jobId, decision): Promise<Job>`; `submitJobRevision(actor, jobId, changes): Promise<JobRevision>`. Company ownership derives from the actor.

- [ ] **Step 1: Write failing `first_job_waits_for_review` and `keeps_approved_revision` tests.** Assert `expect(firstJob.status).toBe('PENDING_REVIEW')`, `expect(laterCleanJob.status).toBe('PUBLISHED')`, `expect(forgedCompanyIdResponse.status).toBe(400)`, and `expect(publicJob.title).toBe(oldTitle)` while an edited title awaits review; cover flagged later jobs and cross-company edits.
- [ ] **Step 2: Run `npm run test -- src/lib/jobs/moderation.test.ts`.** Expected: fail before publication rules exist.
- [ ] **Step 3: Implement job submission, moderation, and pending versions.** Treat changes to title, location/work mode, salary, application method, or requirements as major for the first release. Record staff decisions with time and reason.
- [ ] **Step 4: Run targeted tests, lint, and build; manually check first-job approval and a held edit.** Expected: no unapproved content is public.
- [ ] **Step 5: Commit and push** publication/revision workflow.

### Task 4: Public job visibility

**Files:** Create `web/src/lib/jobs/public-query.ts`, `.test.ts` and public API routes; modify `web/src/app/(marketing)/jobs/page.tsx`, `web/src/app/(marketing)/jobs/[slug]/page.tsx`, and detail component; create public `/companies/[slug]` page.

**Interfaces:** `listPublicJobs(filters): Promise<PublicJob[]>` returns only verified-company published jobs within deadline/confirmation; `getPublicJob(slug): Promise<PublicJob | ReadOnlyJob | null>` distinguishes expiry pause from safety pause.

- [ ] **Step 1: Write failing `lists_only_current_jobs` and `paused_links_are_safe` tests.** Assert `expect(results).not.toContain(pausedJob)`, `expect(expiryDetail.canApply).toBe(false)`, and `expect(safetyDetail.content).toBeUndefined()`; cover draft/expired roles and original posting date.
- [ ] **Step 2: Run `npm run test -- src/lib/jobs/public-query.test.ts`.** Expected: fail on current mock-only pages.
- [ ] **Step 3: Implement data-backed search/detail and public company profile.** Remove production reliance on `previewJobs`; show badge explanation, deadline, original date, and last confirmation. Keep demo fixtures clearly labelled outside live queries.
- [ ] **Step 4: Run targeted tests, lint, build, and a desktop/mobile check of live and paused roles.** Expected: public visibility matches database policy.
- [ ] **Step 5: Commit and push** public pages for candidate review.

### Task 5: Visitor reports and staff triage

**Files:** Create `web/src/lib/jobs/reports.ts`, `.test.ts`, public report route/form, and staff report queue.

**Interfaces:** `submitJobReport(input: { jobId: string; reason: 'FRAUD' | 'MISLEADING' | 'CLOSED' | 'OTHER'; details?: string }, reporterContext: { userId?: string; ipHash: string }): Promise<JobReport>` limits a guest to five reports per hour; `reviewJobReport(staffActor, reportId, decision): Promise<JobReport>` may pause a credible case.

- [ ] **Step 1: Write failing `reports_do_not_auto_pause` tests.** Assert `expect(reportJob.status).toBe('PUBLISHED')` after one report, the sixth guest report within an hour is rejected, and `expect(pausedJob.pauseReason).toBe('SAFETY')` only after a staff decision.
- [ ] **Step 2: Run `npm run test -- src/lib/jobs/reports.test.ts`.** Expected: fail before report handling exists.
- [ ] **Step 3: Implement report collection, rate limit, staff queue, and triage decision.** A visitor can report without an account; staff notes and reporter identity stay private.
- [ ] **Step 4: Run targeted tests, lint, and build; manually submit and triage a test report.** Expected: one report cannot silently remove a job.
- [ ] **Step 5: Commit and push** reporting workflow.

### Task 6: Reconfirmation and expiry maintenance

**Files:** Create `web/src/lib/jobs/freshness.ts`, `.test.ts`, `web/src/app/api/internal/jobs/maintenance/route.ts`; extend employer jobs UI with reconfirmation control and expiry notices. Job closure with applicant outcomes is implemented in the candidate updates plan.

**Interfaces:** `reconfirmJob(actor, jobId, now): Promise<Job>` preserves `publishedAt`; `runJobMaintenance(now: Date): Promise<{ reminders: number; paused: number }>` uses persisted event keys; internal route requires a server-held scheduler secret.

- [ ] **Step 1: Write failing `reminds_once_and_pauses_overdue` and `renewal_keeps_original_date` tests.** At fixed dates assert `expect(firstRun).toEqual({ reminders: 1, paused: 1 })`, `expect(secondRun).toEqual({ reminders: 0, paused: 0 })`, and `expect(renewed.publishedAt).toEqual(originalPublishedAt)`; cover employer deadline and retained applications.
- [ ] **Step 2: Run `npm run test -- src/lib/jobs/freshness.test.ts`.** Expected: fail until maintenance exists.
- [ ] **Step 3: Implement transactional freshness updates, idempotent reminder records, a protected scheduler endpoint, and employer reconfirmation.** Use Africa/Lagos dates; never derive freshness from a user-editable posted date. Keep close controls disabled for jobs with applications until the closure workflow exists.
- [ ] **Step 4: Run targeted tests and build; invoke maintenance against a disposable test database at fixed dates.** Expected: only due reminders/pauses occur, and repeated invocation changes nothing.
- [ ] **Step 5: Commit** freshness workflow; push for user testing.

## Execution order and handoff

Finish the [foundation plan](2026-10-28-secure-platform-foundation-implementation.md) first. Tasks 1–6 here each end in a reviewable commit. The [candidate updates plan](2026-10-28-candidate-updates-implementation.md) then connects real applications to these jobs. Keep the release blocked until all security issues affecting live auth and data routes are resolved.
