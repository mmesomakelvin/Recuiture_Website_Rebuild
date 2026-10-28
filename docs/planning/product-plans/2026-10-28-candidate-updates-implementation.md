# Candidate Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let candidates submit one real application per live job, view a truthful dated history, and receive useful updates while employers meet visible review targets.

**Architecture:** Application mutations occur in server-only services with candidate/company ownership checks. A transaction writes the status event and an idempotent notification record together; a delivery worker sends email without making application state depend on email success. Scheduled maintenance finds overdue first reviews and post-interview updates.

**Tech Stack:** Next.js 16 App Router, TypeScript, Prisma 7/PostgreSQL, Supabase Auth and private Storage, Zod, Vitest, Resend behind an `EmailSender` interface, Tailwind CSS v4.

**Spec:** [Job trust and candidate updates](2026-10-28-job-trust-and-candidate-updates-design.md), sections 4–5 and “Acceptance examples”. **Prerequisites:** [secure platform foundation](2026-10-28-secure-platform-foundation-implementation.md) and [trusted job listings](2026-10-28-trusted-job-listings-implementation.md).

## Global Constraints

- A guest can read jobs but must sign in to apply; return them to the same job after authentication.
- An application receipt is created immediately and exactly once per candidate/job.
- Candidate-facing stages are **Applied, Screening, Interview, Offer, Hired, Not selected, Withdrawn**; a cancelled role gets an explicit truthful **Role cancelled** outcome.
- “Screening” and “Reviewed” require an explicit authorised action; viewing a profile does not count.
- First-review target is **seven calendar days** from submission, using Africa/Lagos dates.
- The next-update target defaults to **five business days after a completed interview**; the employer confirms the date before it is shown.
- A paused job does not reject applicants. Closing a filled/cancelled job resolves all active applications; another-role interest needs separate candidate opt-in.
- CV files are private PDF or Word documents, maximum **5 MB**, accessed only by the candidate and authorised hiring team.
- No email delivery failure may erase an in-app status event; no retry may duplicate a candidate message.
- Use the isolated feature branch started in the foundation plan; push each completed task commit for review.
- The MVP does not reuse candidate data for another role; a future opt-in flow would need separate design and permission.

## Review Focus

1. Same candidate submits twice or retries after a timeout: only one application and receipt; Task 1 test.
2. Candidate supplies another user's CV URL or employer B's application ID: both are forbidden; Tasks 1–2 tests.
3. Employer merely opens an application: no “Screening” transition or candidate update; Task 2 test.
4. Email provider fails or worker retries: timeline remains correct and delivery is idempotent; Task 3 test.
5. Job is cancelled with active applications: each receives a truthful final outcome; Task 5 test.

---

## File map

| File | Responsibility |
| --- | --- |
| `web/prisma/schema.prisma`, `web/prisma/migrations/*` | Cancelled-role outcome, interview completion/next-update dates, notification delivery keys. |
| `web/src/lib/applications/apply.ts`, `.test.ts` | Validate a live job, candidate, private CV, and unique submission. |
| `web/src/lib/applications/status.ts`, `.test.ts` | Explicit stage transitions, review marker, dated history, close outcomes. |
| `web/src/lib/applications/queries.ts`, `.test.ts` | Candidate-owned and company-owned application views. |
| `web/src/lib/applications/deadlines.ts`, `.test.ts` | Seven-day and five-business-day targets and overdue logic. |
| `web/src/lib/notifications/events.ts`, `delivery.ts`, `email.ts`, tests | In-app record, outbox/idempotency, Resend adapter. |
| `web/src/app/api/candidate/*`, `web/src/app/api/employer/*`, `web/src/app/api/internal/applications/maintenance/route.ts` | Validated, authorised HTTP entry points. |
| `web/src/app/(marketing)/jobs/[slug]/apply/page.tsx`, `web/src/app/(candidate)/candidate/*`, `web/src/app/(employer)/employer/jobs/[id]/applications/*` | Apply, candidate history, employer review. |

### Task 1: Candidate submission and private CV

**Files:** Create `web/src/lib/applications/apply.ts`, `.test.ts`, candidate application/CV upload routes and `/jobs/[slug]/apply/page.tsx`; modify `web/src/lib/validations/index.ts`.

**Interfaces:** `submitApplication(actor: Actor, input: { jobId: string; resumeObjectKey: string; coverLetter?: string; screeningAnswers?: Record<string, string> }): Promise<ApplicationReceipt>`; candidate ID derives from actor, CV key is checked against that candidate's private Storage path, and job must be published/current. The API never accepts an arbitrary public `resumeUrl` as proof of ownership.

- [ ] **Step 1: Write failing `accepts_one_live_application` and `rejects_untrusted_resume` tests.** Assert `expect(secondReceipt.applicationId).toBe(firstReceipt.applicationId)`, `expect(applicationCount).toBe(1)`, and `await expect(submitApplication(candidate, forgedCv)).rejects.toThrow('FORBIDDEN')`; include guest, paused/expired job, file size/type, and missing required answer cases.
- [ ] **Step 2: Run `npm run test -- src/lib/applications/apply.test.ts`.** Expected: fail until submission exists.
- [ ] **Step 3: Implement signed private CV upload and the short apply/review flow from the job-board spec.** Submit application and receipt event transactionally; keep the confirmation on the apply flow with links to Applications and Jobs.
- [ ] **Step 4: Run targeted tests, lint, and build; manually submit one test application on mobile and desktop.** Expected: one application, private CV, one receipt, no duplicate on refresh.
- [ ] **Step 5: Commit** submission flow and tests; push for candidate testing.

### Task 2: Explicit review and status timeline

**Files:** Create `web/src/lib/applications/status.ts`, `queries.ts`, tests, candidate application list/detail routes, employer applicant list/detail routes; update Prisma schema/migration as needed.

**Interfaces:** `markReviewed(actor, applicationId, at): Promise<Application>`; `changeApplicationStatus(actor, applicationId, transition): Promise<ApplicationEvent>`; `scheduleInterview(actor, applicationId, details: { scheduledAt: Date; mode: 'REMOTE' | 'ONSITE'; locationOrLink: string }): Promise<ApplicationEvent>`; `completeInterview(actor, applicationId, completedAt: Date): Promise<ApplicationEvent>`; `getCandidateApplication(actor, id): Promise<CandidateApplicationView>`; `getEmployerApplication(actor, id): Promise<EmployerApplicationView>`.

- [ ] **Step 1: Write failing `only_real_actions_advance_status` and `scopes_application_reads` tests.** Assert `expect(afterPageView.status).toBe('APPLIED')`, `expect(afterMarkReviewed.reviewedAt).toEqual(now)`, and `await expect(getEmployerApplication(employerB, applicationId)).rejects.toThrow('FORBIDDEN')`; include ordered invitation/completion events and candidate withdrawal.
- [ ] **Step 2: Run targeted status/query tests.** Expected: fail on missing services.
- [ ] **Step 3: Implement server-owned history and narrow view objects; build candidate list/detail and employer review screens.** Map `REJECTED` to candidate copy “Not selected”; do not infer status from a CV view.
- [ ] **Step 4: Run targeted tests, lint, build, and a two-account smoke check.** Expected: each user sees only their permitted applications and actual events.
- [ ] **Step 5: Commit** status and timeline slice; push for both user groups to review.

### Task 3: In-app notification and email delivery

**Files:** Modify `web/prisma/schema.prisma` with migration; create `web/src/lib/notifications/events.ts`, `delivery.ts`, `email.ts`, tests and protected delivery route/worker.

**Interfaces:** `recordApplicationEvent(tx, event): Promise<Notification>` uses a unique event key; `deliverPendingNotifications(sender: EmailSender, limit: number): Promise<DeliveryResult>` retries failures without duplicate email. `EmailSender.send(message, idempotencyKey): Promise<void>` has a fake test implementation and a production Resend adapter.

- [ ] **Step 1: Write failing `records_once_even_if_email_fails` tests.** Assert `expect(inAppEvents).toHaveLength(1)` after a provider error, `expect(sender.send).toHaveBeenCalledTimes(2)` after one failed attempt and one successful retry with the same idempotency key, and no third call on another worker run; cover receipt, stage, and closure types.
- [ ] **Step 2: Run targeted notification tests.** Expected: fail before outbox exists.
- [ ] **Step 3: Implement transactional event/outbox records and email adapter.** Use server-only `RESEND_API_KEY` and verified sender domain; local tests use a fake sender and never contact real candidates. Send emails only for the events approved in the design.
- [ ] **Step 4: Run targeted tests and build; inspect rendered email content and a local test inbox.** Expected: no duplicate messages and a working application link after sign-in. Do not enable production sending until the sender domain and key are configured.
- [ ] **Step 5: Commit** notification slice; push UI and email preview for review.

### Task 4: Review deadlines and interview follow-up

**Files:** Create `web/src/lib/applications/deadlines.ts`, `.test.ts`, `web/src/app/api/internal/applications/maintenance/route.ts`; extend employer queue and candidate timeline.

**Interfaces:** `firstReviewDueAt(submittedAt: Date): Date` returns the same Africa/Lagos local time seven calendar days later; `addBusinessDays(completedAt: Date, count: number, holidays: ReadonlySet<string>): Date`; `runApplicationMaintenance(now: Date): Promise<MaintenanceSummary>` records idempotent reminders and honest overdue notices.

- [ ] **Step 1: Write failing `uses_lagos_calendar_and_real_interview_completion` tests.** Assert `expect(firstReviewDueAt(submittedAt)).toEqual(sevenDaysLaterInLagos)`, `expect(addBusinessDays(fridayInterviewEnd, 5, holidays)).toEqual(expectedNextFridayOrLater)`, and `expect(secondMaintenance.notices).toBe(0)`; include revised date and unchanged application status.
- [ ] **Step 2: Run `npm run test -- src/lib/applications/deadlines.test.ts`.** Expected: fail until date logic exists.
- [ ] **Step 3: Implement target dates, employer reminders, candidate “Awaiting employer review”/delay notices, and protected maintenance trigger.** Require employer confirmation of the displayed interview next-update date if a complete holiday calendar is unavailable.
- [ ] **Step 4: Run targeted tests and build; execute maintenance twice at a fixed test time.** Expected: one reminder per due event, correct local dates, no stage change.
- [ ] **Step 5: Commit** deadline workflow; push for review.

### Task 5: Filled/cancelled job closure and final outcomes

**Files:** Extend `web/src/lib/applications/status.ts`, `.test.ts`, employer close route/form and candidate timeline; modify Prisma migration to include `ROLE_CANCELLED` if not already done.

**Interfaces:** `closeJobWithOutcomes(actor, jobId, input: { reason: 'FILLED' | 'CANCELLED'; outcomes: Array<{ applicationId: string; status: 'HIRED' | 'REJECTED' | 'ROLE_CANCELLED' }> }): Promise<void>` validates that every active application is resolved in one transaction. A separate opt-in flow is required before reusing a profile for another role.

- [ ] **Step 1: Write failing `closure_resolves_every_active_applicant` tests.** Assert `await expect(closeJobWithOutcomes(actor, jobId, incompleteOutcomes)).rejects.toThrow('UNRESOLVED_APPLICATIONS')`, `expect(cancelledApplication.status).toBe('ROLE_CANCELLED')`, and `expect(finalNotices).toHaveLength(activeApplicantCount)`; include existing offer/hired and cross-company cases.
- [ ] **Step 2: Run targeted closure tests.** Expected: fail until transaction rules exist.
- [ ] **Step 3: Implement close-and-resolve form/service.** Preserve application history and CV access rules after job closure; do not delete applications via Prisma cascade. Keep future-role opt-in outside the original application.
- [ ] **Step 4: Run targeted tests, `npm run lint`, and `npm run build`; smoke-test a job with several applicants.** Expected: no applicant remains indefinitely active after final closure.
- [ ] **Step 5: Commit** closure flow; push the complete B slice for user testing.

## Execution order and external configuration

Tasks 1–5 follow the two prerequisite plans. Email sending needs a verified sender domain and a server-held API key; use fake delivery locally until configured. Private CV Storage needs a configured bucket and policy. Neither secret belongs in Git. The plan chooses Resend because the existing project notes recommend it and its [official API](https://resend.com/features/email-api) supports idempotency keys; the user can change that provider during plan review without changing the outbox contract.
