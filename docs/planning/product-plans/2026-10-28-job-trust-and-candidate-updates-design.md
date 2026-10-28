# Job trust and candidate updates

**Status:** Draft for approval

**Product:** Recruiture by EduBridge Academy

**Decision date:** 28 October 2026

**Scope:** Employer checks, job moderation and freshness, candidate application updates, and response targets

## Intent

Recruiture should give candidates two reasons to trust the hiring process: a public vacancy has been checked and recently confirmed, and an application has a visible, truthful history. Employers should be able to hire without waiting for EduBridge staff to approve every routine post. EduBridge staff need a manageable queue for verification, reports, and overdue recruitment work.

These rules build on the existing [information architecture](../architecture/information-architecture.md), [product overview](../../../product/product-overview.md), and job board and candidate portal specifications. They do not claim that the current website preview has live accounts, jobs, or applications.

## Agreed choices

The product owner accepted these recommendations in conversation:

1. EduBridge checks an employer before its first vacancy is public. The employer may register and save drafts while verification is pending.
2. Staff review the first vacancy. Later vacancies publish after automated completeness checks unless a rule or report flags them for review.
3. A public vacancy needs employer reconfirmation every 30 days. An unconfirmed vacancy leaves public search automatically; renewal keeps the original posting date.
4. Candidates receive an immediate application receipt and truthful updates for actual stage changes, withdrawal, or job closure. The dashboard shows the same dated history.
5. First review has a seven-calendar-day target. After an interview, the employer should give a next step or revised timeline within five business days. These are measured service standards, not automatic rejections or guaranteed decisions.

## Goals and limits

### Goals

- Prevent an unverified employer or unreviewed first vacancy from appearing publicly.
- Keep public vacancies current and give visitors a way to report a concern.
- Tell candidates what has happened to their application, when, and what is still pending.
- Prompt employers to review applicants and follow up after interviews.
- Give staff enough evidence and history to make and audit decisions.

### Out of scope for this slice

- Automated candidate scoring, AI interviews, or automated rejection decisions.
- A private chat or full interview scheduling product.
- A public employer response-time ranking before Recruiture has enough reliable data.
- A guarantee that every candidate receives a final hiring decision within seven days.
- A separate public company directory or duplicate job detail page.

### Failure conditions to avoid

- A “Verified” badge with no completed staff check or no clear explanation of what was checked.
- A job that remains searchable after its deadline or without recent employer confirmation.
- A “reviewed” or “screening” status generated merely because someone opened an application.
- A candidate receiving “not selected” solely because a listing expired.
- Employers being able to change another company's verification, jobs, or applications.

## Approaches considered

### Vacancy approval

| Approach | Advantage | Cost or risk |
| --- | --- | --- |
| Staff review every vacancy | Maximum direct oversight | Slow publishing and a large permanent staff queue |
| Verify the company once, then allow every vacancy | Fastest publishing | A verified company could publish an unsuitable or stale role |
| **Chosen: verify company and first vacancy, then review flagged later vacancies** | Checks the first public appearance and keeps routine publishing fast | Needs explicit flagging rules, reports, and periodic audits |

### Candidate communication

| Approach | Advantage | Cost or risk |
| --- | --- | --- |
| Employers write every message manually | Personal wording | Many applicants receive no update; high employer effort |
| Send a message for every page view or timer | Easy automation | Creates misleading “progress” with no real action |
| **Chosen: event-based messages plus honest overdue notices** | Scales while reflecting actual decisions | Needs reliable status history, delivery, and reminder handling |

## Experience and rules

### 1. Employer verification

An employer can create an account, set up a company profile, and draft a vacancy before verification. The public cannot see that company's jobs until EduBridge has approved the employer and its first vacancy. A staff reviewer checks the company identity, a reachable hiring contact, and evidence that the contact can represent the organisation. The exact acceptable evidence is an EduBridge operations policy; the product must support an alternative evidence path for legitimate organisations without a corporate email domain.

Organisations without formal registration evidence may use alternative proof of identity and hiring authority. Staff can approve them after documenting the evidence and decision; lack of one document does not automatically exclude an otherwise legitimate employer. The exact acceptable evidence belongs in EduBridge's operating policy.

Verification states: **Not submitted → Pending review → Verified**, with **Changes requested** and **Suspended** paths. The employer sees what is needed and a clear reason when changes are requested. Public pages show **Verified employer** only for a current approved state; the badge explains that Recruiture checked the employer's identity and hiring contact, not that it guarantees a job offer, formal registration, or workplace conditions. Verification evidence and internal notes remain staff-only.

If ownership or key company identity changes, staff can require re-verification and pause new publishing. Every decision records the staff member, time, and reason.

### 2. First vacancy and later vacancies

The employer can save an incomplete draft. Before submission, the form checks title, real work location or remote eligibility, job type, responsibilities, requirements, salary or a clear “not disclosed” choice, application method, and closing date. The first submitted vacancy enters **Pending review**. Staff see the public preview, company check, and any flags; they approve, request edits, or reject it with a reason.

Once the company and first vacancy are approved, later complete vacancies may publish directly. A new post is held for staff review if an automated rule flags suspicious content, unresolved reports on the company's other live jobs require closer review, the employer is suspended, or a staff member has set the company to manual review. A major edit to a live vacancy is stored as a pending version; the current approved version remains visible until the edit is approved, unless staff pause it for safety. The precise flag rules are operational settings, not candidate-facing promises.

Public job detail shows the employer badge, original publication date, last employer-confirmed date, application deadline, and a **Report this job** action. A visitor can report a role without creating an account; the form asks for a category and optional explanation. Reports are rate-limited, routed to a staff queue, and never automatically hide a job from one unverified report. Staff may pause a credible or severe case while investigating.

### 3. Vacancy freshness

The employer chooses an application deadline. A role cannot accept new applications after that deadline. Independently, a published role must be reconfirmed every **30 calendar days**. Recruiture reminds the employer seven days and two days before confirmation expires. The employer can confirm it is still open, update the deadline if appropriate, or close it as filled/cancelled.

If the employer does nothing, the job becomes **Paused: confirmation overdue** and leaves public search and related-job suggestions. Its direct URL remains a read-only explanation with Apply disabled, rather than a broken link. It can be restored after explicit reconfirmation, subject to any outstanding review flags. Renewal does not reset the original publication date or make the vacancy appear newly posted. Existing applications and their timelines remain accessible to authorised users.

Pausing a public listing does **not** automatically reject applicants. Candidates with existing applications see that the job is no longer accepting new applications; their own application stage remains unchanged until an authorised person makes a decision. When an employer closes a role as filled or cancelled, every remaining active applicant receives a final, truthful outcome rather than remaining indefinitely pending. Considering someone for a different role is a separate opt-in request to that candidate; it does not leave the original application open. Staff can follow up on any closure with unresolved applications.

### 4. Application receipt and status history

Submitting an application immediately creates one receipt with the job title, company, application date, and link to the candidate's application record. The candidate sees a dated timeline based on actual events. Supported candidate-facing states follow the current model: **Applied, Screening, Interview, Offer, Hired, Not selected, Withdrawn**. “Screening” requires an explicit employer or staff action; opening a profile alone does not create it.

Send an in-app notification and email for meaningful changes: interview invitation or change, offer, hired, declined, and role closed or cancelled. The receipt is also emailed. Routine stage movement can use an in-app update and email where it materially affects the candidate; notification preferences can control optional messages. Delivery retries must not create duplicate timeline events. A failed email does not erase the in-app record. Every message links to the candidate's own application after authentication.

The candidate can withdraw where the current candidate portal specification allows it. A withdrawal records its time, stops further hiring actions for that application, and informs the employer. A candidate cannot access another person's application.

### 5. Response targets and honest delays

The employer dashboard shows a **First review due** queue. The seven-day clock starts when the application is submitted, using Africa/Lagos calendar dates. “Reviewed” counts only when an authorised employer or recruiter explicitly marks the application reviewed or moves it to a real stage. A reminder goes to the hiring owner before the target and again when overdue. At seven days without action, the candidate sees an honest **Awaiting employer review** note with the last update date; no screening decision is implied. The platform measures missed targets for staff follow-up and employer improvement.

When an interview is completed, the employer provides a next-update date, defaulting to five business days after completion. They can revise it before it passes, with a reason and candidate notification. The candidate sees the date as an **expected update**, not a guaranteed outcome. If it passes, the employer receives a reminder and the candidate sees a delay notice. Business-day calculation should use a documented Nigeria-focused calendar rule; if holiday handling is not ready at MVP, the employer must explicitly confirm the displayed date before it is shown to the candidate.

## Surfaces and handoff implications

| Surface | Addition |
| --- | --- |
| Employer onboarding and company page | Verification state, evidence submission, change requests, staff contact |
| Employer job form and jobs list | Completeness checks, first-job review state, expiry countdown, reconfirm/close actions |
| Public job detail | Verified employer explanation, original posted date, last confirmed date, deadline, report action |
| Candidate application detail | Receipt, dated real-event timeline, next expected update or honest delay state |
| Employer applicant list | First-review due/overdue cues, explicit review and stage actions |
| Staff dashboard | Company and first-job queues, flagged reports, overdue applications, decision history |

These additions belong in the existing role workspaces. They do not require a new primary public navigation item. On mobile, verification and expiry information must remain visible near the apply action; report and status controls need clear labels and touch targets.

## Data and permission implications for later planning

The current Prisma model already has `Company.isVerified`, `Job.expiresAt`, `Application.statusHistory`, `Application.reviewedAt`, `Notification`, and `AuditLog`. It does **not** yet represent the full verification decision, proof, review state, pending job edit version, last confirmation time, job reports, or notification delivery state. The implementation plan must settle these data changes and the scheduled reminder/expiry mechanism. The current Prisma schema also cascades deletion from jobs to applications; archival must preserve applications and their timelines. The product data shape includes an EduBridge recruiter role, while the current Prisma user-role enum does not, so role modelling needs reconciliation before staff workflows are built.

All publication, verification, reporting, status changes, and application reads need server-side role and ownership checks. Staff approval cannot be granted through public sign-up. This work depends on resolving [public role selection](https://github.com/mmesomakelvin/Recuiture_Website_Rebuild/issues/2), [server-side permissions](https://github.com/mmesomakelvin/Recuiture_Website_Rebuild/issues/3), and [route bypasses](https://github.com/mmesomakelvin/Recuiture_Website_Rebuild/issues/4) before private workflows go live.

## Acceptance examples

- An unverified company may save a draft but cannot make it public. A verified company still needs first-job approval.
- A later complete job publishes without staff action if no rule holds it; a flagged job stays private until reviewed.
- A reported job reaches the staff queue; one report alone does not silently remove it.
- A job with a passed deadline or overdue 30-day confirmation cannot accept new applications or appear in public search.
- Reconfirming a paused job restores visibility without changing its original posted date.
- An application receipt appears once. A candidate sees only real status transitions and their own application.
- A listing expiry does not change an applicant to “Not selected.” Closing a role gives every active applicant a truthful final outcome; another-role consideration requires separate candidate opt-in.
- An unreviewed application becomes overdue after seven days, triggers an employer reminder, and shows the candidate an accurate delay note.
- An interview's next-update date is visible; revising or missing it produces an honest update, not a fabricated decision.

## What to measure after launch

- Share of public jobs with a current employer confirmation; number of expired jobs still visible should be zero.
- Time from employer submission to company and first-job decision.
- Share of applications explicitly reviewed within seven days; median time to first review.
- Share of interviewed candidates receiving a next step or revised date within five business days.
- Candidate notification delivery success and duplicate-event rate.
- Number of job reports, time to staff triage, and confirmed report outcomes.

## Decisions left to EduBridge operations

These are policy details to settle before implementation without changing the agreed product direction: acceptable verification evidence, high-risk content rules, which edits require renewed review, staff ownership of overdue queues, and the holiday calendar used for business-day calculations. The builder can propose defaults, but EduBridge should approve the operating policy before launch.
