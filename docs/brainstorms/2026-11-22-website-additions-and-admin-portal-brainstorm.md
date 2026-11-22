---
date: 2026-11-22
topic: website-additions-and-admin-portal
---

# Website additions and internal admin portal

## What We're Building

The first live version of Recruiture, where real jobs replace the preview data. EduBridge staff post and manage every job through an internal admin portal at `/admin` inside the existing website. Candidates create an account, apply with a CV and cover letter, and follow a dated history of each application in a simple candidate portal. They are emailed a receipt and every real stage change.

The public site also gains three marketing pages: For Employers, Contact and FAQ. Employers do not get accounts yet. They reach the EduBridge team through the For Employers and Contact forms, and those enquiries arrive in the admin portal for staff to follow up.

### Scope

**Public website (`web/`)**
- Candidate sign-up, sign-in, sign-out and password reset
- Real apply flow: signed-in candidates only, one application per job, CV (PDF or Word, max 5 MB) and cover letter
- Candidate portal: basic profile (name, phone, location, CV) and an application tracker with dated status history
- Emails: application receipt, and one email per real stage change
- `/jobs` and `/jobs/[slug]` read published jobs from the database instead of `mock-jobs.ts`
- New pages: For Employers (with enquiry form), Contact (with form and contact details), FAQ

**Admin portal (`/admin`)**
- Jobs: create, edit, publish, pause and close, including roles posted for client companies
- Applications: list per job, open CVs, move candidates through stages (Applied, Screening, Interview, Offer, Hired, Not selected), with each move recorded in the history
- Enquiries: inbox of Contact and For Employers submissions, with a simple status for follow-up

## Why This Approach

We considered three places for the admin portal: `/admin` inside the existing Next.js app, a separate admin app on a subdomain, and an off-the-shelf tool (Supabase Studio or Retool). We chose `/admin` in the same app. It shares one codebase, one sign-in system, one database and the existing components. It is also the only option that reliably ties each status change to its candidate email and history entry. A separate app doubles the upkeep for no current benefit. An off-the-shelf tool would break the approved "truthful updates" rule.

## Key Decisions

- **Staff post all jobs in v1**: employer accounts, self-serve posting, employer verification and 30-day reconfirmation are deferred. This is the smallest version that gets real jobs live.
- **Candidates are the only public accounts**: public sign-up can never create a staff account.
- **One staff role**: every staff member can do everything in `/admin`. Staff accounts are created by an existing staff member or a trusted seed step, never through public sign-up.
- **Server-side checks on every admin page and action**: non-staff visitors get a 404, and no check lives only in the browser.
- **Email and portal updates**: receipt on applying and an email per real stage change, matching the 28 October decision. A failed email never erases the history entry, and a retry never sends a duplicate.
- **"Screening" only by explicit staff action**: opening an application does not change its stage.
- **Candidate portal kept minimal**: saved jobs, the full profile, the graduate badge and graduate verification come later.
- **Design OS first**: add the Admin portal and the new marketing pages to Design OS and design their screens before building in `web/`. Build sign-in first, since applications and staff access depend on it.

## Relationship to Existing Plans

The 28 October plans in `docs/planning/product-plans/` assume employers sign up and post jobs themselves. This scope narrows that:
- **Secure platform foundation**: still needed, but limited to candidate accounts and one staff role (no employer registration).
- **Trusted job listings**: employer verification, first-job review and reconfirmation are deferred. Staff-created jobs still respect deadlines and the publish, pause and close states.
- **Candidate updates**: largely still applies, with staff acting as the hiring team.

These plans should be revised during planning rather than carried out as written.

## Open Questions

- Should a new enquiry also email the staff team, or is the admin inbox enough?
- What fields should the For Employers form collect (company, role count, hiring timeline, budget)?
- Which contact details (address, phone, email, socials) go on the Contact page?
- Who writes the FAQ content, and which questions are must-haves?
- How do client companies get the results? For now, do staff share shortlists outside the platform?
- Should the existing Design OS "Recruiter and Admin" roadmap section be renamed and narrowed to match this admin portal?

## Next Steps

1. Update Design OS: roadmap, shape the Admin portal section, and add the marketing pages
2. `/workflows:plan` for implementation details, revising the three 28 October plans
