# Recruiture website information architecture

**Status:** Working draft for product review  
**Product:** Recruiture by EduBridge Academy  
**Scope:** Public website, candidate workspace, employer workspace, and EduBridge staff workspace

This plan follows the existing [product overview](../../../product/product-overview.md), [roadmap](../../../product/product-roadmap.md), [data shape](../../../product/data-shape/data-shape.md), and job board and candidate portal specifications. It describes the intended product, not routes that already exist in the Next.js preview. Today the preview implements only `/`, `/jobs`, and `/jobs/[slug]`.

## 1. Organising rules

- Visitors choose a journey through **Find jobs** or **For employers** within the first screen. Staff navigation appears only after staff sign-in.
- A job is the primary discovery object. Search, category, company, and related-role links lead to the same canonical job detail URL.
- Candidate and employer workspaces use separate URL prefixes and navigation. Shared account settings have one URL.
- An application belongs to one candidate and one job; a vacancy belongs to one company. Server-side permission checks must enforce those relationships on every data request and action.
- The MVP supports the complete search → apply → review → status loop. Later services fit inside the same role workspaces.
- Status and confirmation screens are states of a task, not new navigation destinations unless a durable shareable URL is useful.

**Legend:** `[M]` = essential MVP; `[F]` = future option. Route parameters such as `[slug]` and `[id]` are examples, not final database keys.

## 2. Tree sitemap

```text
PUBLIC WEBSITE
/ [M] Home: two clear paths, job search and employer hiring
├── /jobs [M] Search and filter published roles
│   ├── /jobs/[slug] [M] Canonical job detail, company summary, related roles
│   │   └── /jobs/[slug]/apply [M, candidate sign-in required] Apply and review
│   └── /jobs?category=... [M] Category-filtered results; no duplicate page
├── /companies/[slug] [M] Public employer profile, published roles
├── /employers [M] Employer value, process, and Post a job entry
├── /contact [M] Help, employer enquiry, and support route
├── /privacy [M] Privacy notice
├── /terms [M] Terms of use
├── /resources [F] Career resource index
│   └── /resources/[slug] [F] Useful guide and related roles
└── /about [F] Dedicated company story if homepage cannot carry it

SHARED ACCOUNT ENTRY
/sign-in [M] Sign in with return-to-task destination
/create-account [M] Choose candidate or employer; no public staff sign-up
/forgot-password [M] Request account recovery
/reset-password [M] Complete recovery from secure link
/account [M, authenticated] Personal settings and sign out
/notifications [F, authenticated] Full notification history

CANDIDATE WORKSPACE: /candidate/* [M, candidate only]
/candidate [M] Overview and next actions
├── /candidate/applications [M] Application list and status filters
│   └── /candidate/applications/[id] [M] Status history and submitted material
├── /candidate/saved [M] Saved roles, deadlines, and apply links
└── /candidate/profile [M] Profile, CV, preferences, graduate badge
    └── /candidate/assessments [F] Assessment invitations and results

EMPLOYER WORKSPACE: /employer/* [M, employer and authorised company team]
/employer [M] Hiring overview and actions
├── /employer/company [M] Company details and public profile preview
├── /employer/jobs [M] Draft, live, and closed vacancies
│   ├── /employer/jobs/new [M] Create vacancy
│   ├── /employer/jobs/[id]/edit [M] Edit, publish, close vacancy
│   └── /employer/jobs/[id]/applications [M] Applicant list and stage filters
│       └── /employer/applications/[id] [M] Candidate review and stage update
├── /employer/team [F] Invite and manage company users
├── /employer/plan [F] Subscription and billing
└── /employer/analytics [F] Recruitment performance

EDUBRIDGE STAFF WORKSPACE: /admin/* [M, scoped recruiter/admin permissions]
/admin [M] Operational overview and priority queue
├── /admin/jobs [M] Job review, publishing, moderation
│   └── /admin/jobs/[id] [M] Review and action on one job
├── /admin/companies [M] Company verification and client records
│   └── /admin/companies/[id] [M] Company decision and history
├── /admin/applications [M] Cross-role application coordination
│   └── /admin/applications/[id] [M] Application record and permitted actions
├── /admin/candidates [M] Candidate support and graduate verification
│   └── /admin/candidates/[id] [M] Candidate record and verification
├── /admin/client-roles [M] EduBridge-managed vacancies
│   └── /admin/client-roles/[id] [M] Recruitment activity for a client role
├── /admin/shortlists [M] Shortlists prepared for client companies
│   └── /admin/shortlists/[id] [M] Review and share one shortlist
└── /admin/users [M, admin only] User access and moderation

FUTURE TASK FLOWS (inside existing workspaces)
/candidate/interviews [F] Interview invitations and preparation
/employer/interviews [F] Scheduling and feedback
/employer/talent [F] Consented candidate discovery and matching
/admin/assessments [F] Assessment administration
```

## 3. Page inventory

The **parent → children** column defines navigation relationships. A dash means that the page has no dedicated child route; a detail drawer or task state may still exist.

### Public discovery and trust

| Page and URL | Audience | Purpose and unique content | Primary CTA | Parent → children | Phase |
| --- | --- | --- | --- | --- | --- |
| Home `/` | All visitors | Explain Recruiture, show job and employer paths, sample/real featured roles, and trust cues. | Find jobs; secondary Post a job | Root → Jobs, Employers | M |
| Find jobs `/jobs` | Job seekers | Keyword/location search, category/type/mode/experience/pay filters, result count, sorting, empty state. | View role | Home → Job detail; filtered URLs | M |
| Job detail `/jobs/[slug]` | Job seekers | One canonical role: duties, requirements, salary, deadline, company, sharing, related roles. | Apply | Jobs → Apply; Company profile | M |
| Apply `/jobs/[slug]/apply` | Signed-in candidates | Reuse saved CV/profile, answer job-specific questions, review and submit once; show confirmation in flow. | Submit application | Job detail → confirmation state | M |
| Company profile `/companies/[slug]` | Candidates, employers | Verified company information, work location, description, current published jobs. | View open jobs | Job detail → Job detail | M |
| For employers `/employers` | Hiring teams | Explain self-serve and EduBridge-managed hiring, process, and what happens after posting. | Post a job | Home → Create account or Employer jobs/new | M |
| Contact `/contact` | All visitors | Support and employer enquiry paths, contact details/form, response expectation. | Send enquiry | Footer → — | M |
| Privacy `/privacy` | All visitors | Data collection, retention, visibility, candidate consent, and contact route. | Contact us | Footer → Contact | M |
| Terms `/terms` | All visitors | Platform use, postings, applications, and account responsibilities. | Contact us | Footer → Contact | M |
| Resources `/resources` | Job seekers | Curated career guides tied to a real candidate need. | Read guide | Footer/Jobs → Resource detail | F |
| Resource detail `/resources/[slug]` | Job seekers | One actionable guide with contextual role and category links. | Explore related jobs | Resources → Jobs | F |
| About `/about` | All visitors | Dedicated Recruiture/EduBridge story and proof once there is enough distinct content. | Explore jobs | Footer → Jobs | F |

### Account entry and shared settings

| Page and URL | Audience | Purpose and unique content | Primary CTA | Parent → children | Phase |
| --- | --- | --- | --- | --- | --- |
| Sign in `/sign-in` | Returning users | Authenticate and preserve destination, especially a job being applied to. | Sign in | Header/task gate → source task | M |
| Create account `/create-account?role=candidate\|employer` | New users | Short role-specific registration; public choice limited to candidate or employer. | Create account | Header/task gate → role dashboard or source task | M |
| Forgot password `/forgot-password` | Account holders | Request recovery without revealing whether an address exists. | Send recovery link | Sign in → Reset password | M |
| Reset password `/reset-password` | Account holders | Complete recovery from a time-limited link. | Save new password | Recovery link → Sign in | M |
| Account `/account` | Signed-in users | Name, email, password/security settings, notification preferences, sign out. | Save changes | User menu → — | M |
| Notifications `/notifications` | Signed-in users | Searchable full history if dashboard activity becomes too large. | Open related item | User menu → linked task | F |

### Candidate workspace

| Page and URL | Audience | Purpose and unique content | Primary CTA | Parent → children | Phase |
| --- | --- | --- | --- | --- | --- |
| Candidate overview `/candidate` | Candidate | Recent applications, status changes, profile completion, saved deadlines, relevant jobs. | Continue application or Find jobs | Candidate root → Applications, Saved, Profile | M |
| Applications `/candidate/applications` | Candidate | All own applications with status, date, and filters. | View application | Overview → Application detail | M |
| Application detail `/candidate/applications/[id]` | Candidate | Stage timeline, submitted CV/answers, employer updates, permitted withdrawal. | View job or Withdraw | Applications → Job detail | M |
| Saved jobs `/candidate/saved` | Candidate | Bookmarked roles, deadline and closed state. | Apply | Overview → Job detail/Apply | M |
| Profile `/candidate/profile` | Candidate | CV, experience, education, skills, preferences, open-to-work control; staff-issued graduate badge. | Complete profile | Overview → — | M |
| Assessments `/candidate/assessments` | Candidate | Invited assessments and results with clear consent and deadlines. | Start assessment | Candidate nav → assessment task | F |
| Interviews `/candidate/interviews` | Candidate | Confirmed times, preparation, attendance details. | Confirm time | Candidate nav → interview task | F |

### Employer workspace

| Page and URL | Audience | Purpose and unique content | Primary CTA | Parent → children | Phase |
| --- | --- | --- | --- | --- | --- |
| Employer overview `/employer` | Employer | Open roles, new applicants, pending reviews, recent hiring activity. | Post a job | Employer root → Jobs, Company | M |
| Company `/employer/company` | Employer | Edit organisation details, branding, verification status, public preview. | Save company profile | Overview → Public company profile | M |
| Jobs `/employer/jobs` | Employer | Own company drafts, live, closed roles, stage counts and actions. | Post a job | Overview → New, Edit, Applications | M |
| New job `/employer/jobs/new` | Employer | Guided vacancy form, preview, save draft, publish. Company identity comes from authenticated membership. | Publish job | Jobs → Edit or Jobs | M |
| Edit job `/employer/jobs/[id]/edit` | Employer | Update own vacancy, publish/close with clear state and confirmation. | Save changes | Jobs → Public detail | M |
| Applicants `/employer/jobs/[id]/applications` | Employer | Applicants for one owned job; stage filters and shortlist actions. | Review applicant | Jobs → Applicant detail | M |
| Applicant detail `/employer/applications/[id]` | Employer | Candidate-submitted materials, stage history and notes for an owned vacancy. | Advance or decline | Applicants → Applicants | M |
| Team `/employer/team` | Company owner | Invite colleagues and assign scoped hiring access. | Invite teammate | Employer nav → — | F |
| Plan `/employer/plan` | Company owner | Subscription, invoice, and usage information if paid plans launch. | Manage plan | Employer nav → — | F |
| Analytics `/employer/analytics` | Employer | Funnel and time-to-hire summaries once data volume warrants it. | Review jobs | Employer nav → Jobs | F |
| Interviews `/employer/interviews` | Employer | Schedule and record interview outcomes linked to applicants. | Schedule interview | Employer nav/Applicant → Applicant | F |
| Talent `/employer/talent` | Employer | Consented candidate discovery or automated matches; access rules explicit. | Invite candidate | Employer nav → Candidate preview | F |

### EduBridge staff workspace

| Page and URL | Audience | Purpose and unique content | Primary CTA | Parent → children | Phase |
| --- | --- | --- | --- | --- | --- |
| Operations overview `/admin` | Recruiter, admin | Queues for jobs, company checks, applications, client work and overdue tasks. | Open priority queue | Staff root → staff sections | M |
| Jobs `/admin/jobs` | Staff | All vacancies with review, publishing and moderation filters. | Review job | Overview → Job review | M |
| Job review `/admin/jobs/[id]` | Staff | Full vacancy, source, history, approve/return/close controls. | Approve or request changes | Jobs → Jobs | M |
| Companies `/admin/companies` | Staff | Verification queue and managed-client list. | Review company | Overview → Company review | M |
| Company review `/admin/companies/[id]` | Staff | Verification evidence and decision history with access controls. | Verify or request changes | Companies → Companies | M |
| Applications `/admin/applications` | Staff | Cross-job status/coordination queue for permitted roles. | Open application | Overview → Application record | M |
| Application record `/admin/applications/[id]` | Staff | Submitted material, timeline, recruiter notes and authorised stage changes. | Update stage | Applications → Applications | M |
| Candidates `/admin/candidates` | Staff | Support search and graduate verification queue. | Review candidate | Overview → Candidate record | M |
| Candidate record `/admin/candidates/[id]` | Staff | Candidate data permitted to staff; verify EduBridge programme completion. | Verify graduate | Candidates → Candidates | M |
| Client roles `/admin/client-roles` | Recruiter, admin | EduBridge-managed vacancies, ownership and activity. | Open client role | Overview → Client role | M |
| Client role `/admin/client-roles/[id]` | Recruiter, admin | Pipeline, recruiter tasks and linked shortlist for one client vacancy. | Build shortlist | Client roles → Shortlist detail | M |
| Shortlists `/admin/shortlists` | Recruiter, admin | Draft and shared shortlists with client and role context. | Open shortlist | Overview → Shortlist detail | M |
| Shortlist detail `/admin/shortlists/[id]` | Recruiter, admin | Selected candidates, review state and secure client sharing. | Share shortlist | Shortlists → Client role | M |
| Users `/admin/users` | Admin only | Account moderation and role grants; no public route to staff role creation. | Review account | Overview → — | M |
| Assessments `/admin/assessments` | Staff | Assessment templates, invitations and results if service launches. | Create assessment | Staff nav → candidate assessment | F |

## 4. Navigation hierarchy

### Desktop public header

Keep the existing floating, translucent header. Use three primary links: **Find jobs** (`/jobs`), **How it works** (`/#how-it-works`), and **For employers** (`/employers`). This is below the six-item ceiling. The Recruiture logo returns home. On the right, show **Sign in** and a prominent **Post a job** button; **Create account** is visible on the sign-in page, apply gate, and employer landing page. If width permits, add a quieter Create account link beside Sign in, without displacing Post a job.

The Find jobs dropdown, if needed after launch, contains **All jobs**, **Internships**, **Graduate roles**, and **Remote jobs** as prefiltered `/jobs` links. Do not add empty dropdowns at MVP. The employer link can reveal **How hiring works** and **Post a job** only if research shows a need; the landing page already covers both.

For signed-in users, replace Sign in with an account menu containing the name, **My dashboard**, **Account settings**, and **Sign out**. Keep **Post a job** for employers and staff with posting rights. Candidates keep **Find jobs** as their prominent action. Staff see **Operations** instead of public Post a job.

### Footer

Group links by user task: **Explore** (Find jobs, Graduate roles, Remote jobs), **Employers** (For employers, Post a job, Contact), and **Recruiture** (About when substantive, Contact, EduBridge Academy). Put Privacy and Terms in a quiet legal row. Do not show private dashboard or staff links in the public footer.

### Contextual navigation

- Job detail: Back to results (preserve filters), company profile, related roles, Apply.
- Apply flow: job title, progress indicator, Back/Continue, review edits; return to job after cancellation.
- Candidate and employer workspaces: role-specific section navigation plus breadcrumb or Back link on deep detail views.
- Staff workspace: sidebar with queue counts; detail pages show source queue, entity status, and audit history.
- Account menu keeps one consistent location across public and authenticated pages.

## 5. Dashboard architecture

| Workspace | Primary navigation | Overview priority | Deep-page pattern |
| --- | --- | --- | --- |
| Candidate | Overview, Applications, Saved jobs, Profile | Current applications and changes, next action, profile gaps, saved deadlines | List → detail; status timeline and submitted content together |
| Employer | Overview, Jobs, Applicants (via each job), Company | New applicants, open jobs, drafts needing completion, decisions due | Jobs → one job → applicants → one application |
| Staff | Overview, Jobs, Companies, Applications, Candidates, Client roles, Shortlists; Users for admin | Pending verification, moderation, client deadlines, recent status changes | Queue → record → decision; keep audit trail visible |

The dashboard landing page is a summary, not a second full list. Each card links to the relevant filtered list. In-app alerts can live on the overview in MVP; a dedicated notification archive is optional.

## 6. Conversion journeys

### Primary journeys

1. **First-time candidate:** Home or shared job link → Find jobs → filter/search → Job detail → Apply → sign in/create candidate account (return to same job) → reuse profile CV or upload → answer only required questions → review → submit → confirmation → Applications.
2. **Returning candidate:** Sign in → Candidate overview → Applications → Application detail → read dated status and next step. An email update links directly to that application after authentication.
3. **New employer:** Home/For employers → Post a job → create employer account → complete minimum company identity → New job form → save draft or publish → Jobs. Preserve a started draft through sign-up where technically feasible.
4. **Employer reviewing candidates:** Sign in → Employer overview new-applicant card → one job's Applicants → applicant detail → stage update → list reflects new state; candidate receives an update.
5. **Administrator/recruiter:** Staff sign in → Operations overview → priority queue → review record → verify/approve/update with reason → queue reflects action and affected user is notified.

### Secondary journeys

- Candidate saves a role from search → Saved jobs → Apply before deadline.
- Candidate opens a company profile from a role → sees other live roles → returns to a relevant job.
- Employer edits or closes a role from Jobs → public listing updates, with applicants still able to view their submitted record.
- Recruiter opens a client role → screens applications → prepares shortlist → securely shares it with the client.
- Visitor with a support or trust question → Contact or Privacy from footer without creating an account.

### Friction controls

- Do not require an account to search or read a job. Require sign-in only when saving or applying.
- Return users to their original job after authentication. Do not ask for the same details twice in one application.
- Use a CV on file by default; allow replacement for the current application. Show optional questions only when the employer provided them.
- Keep form progress, validation beside the relevant field, and a review step before submission.
- Keep one source of truth for application status and show dated history to both authorised sides.
- Derive employer company identity from authenticated membership and verify ownership server-side.

## 7. Internal linking and discovery

| From | Link to | User need |
| --- | --- | --- |
| Home featured roles | Canonical job detail | Move from inspiration to a concrete opportunity |
| Category, graduate, remote, or internship links | `/jobs` with encoded filters | Browse a focused set without duplicate listing pages |
| Job card | Job detail | Compare the full role before applying |
| Job detail company summary | Public company profile | Check employer credibility and other open roles |
| Job detail related roles | Other live, relevant jobs | Continue search if the role is unsuitable |
| Company profile | Its published jobs | Find more opportunities with the same employer |
| Candidate dashboard/activity/email | Own application detail | Understand a status change quickly |
| Saved job | Job detail or Apply | Resume a decision without a second search |
| Resource guide (future) | Relevant job filters and one or two roles | Act on useful advice |
| Employer dashboard | Own job/applicant queue | Move from summary to decision |

Only published, live jobs appear in public discovery. Closed roles retain the candidate's application record but leave search results. Each job has one canonical URL; filters use query parameters and preserve state on Back. Company pages exist for trust and live role discovery, not as a generic directory without useful data.

## 8. Mobile navigation and responsive behaviour

- Keep the logo and one menu control in the floating header. The menu opens a labelled, keyboard-operable panel with Find jobs, How it works, For employers, Sign in/Create account, and Post a job. Keep the primary task visible as a button when space permits.
- Search fields stack vertically. The search button spans the width. Filters live in a sheet with a visible result count, Apply filters, Clear all, and an explicit close action. Active filters appear as removable chips above results.
- Show one job card per row. Keep the title, company, location, work mode, salary, and action readable without hover. Do not truncate crucial titles or hide salary in tooltips.
- Open job detail as a full page with Back to results. Preserve query, filters, and scroll position when possible. Keep the Apply action reachable near the top and after the role details.
- Apply flow uses one step per screen, large controls, file upload feedback, a persistent job title, and saved progress during ordinary navigation. Avoid modal-only application flows on narrow screens.
- Dashboard navigation becomes a labelled tab row or menu. Prefer horizontal tabs only for the four candidate sections; staff's longer list uses a drawer. Lists become cards or simple stacked rows, not squeezed tables.
- Meet keyboard focus, screen-reader labels/status announcements, readable contrast, and at least 44 px touch targets. Never rely on colour alone for status.

## 9. MVP priorities and future growth

| Priority | Deliverable | Why it is needed |
| --- | --- | --- |
| P0 foundation | Public home, job search/detail, company profile, employer landing, contact/legal, role-safe auth and account recovery | Visitors can orient, assess trust, and enter the right journey. |
| P0 candidate loop | Apply flow, candidate profile/CV, applications/status detail, saved jobs | A person can discover, submit, and track an application. |
| P0 employer loop | Company profile, post/edit/close job, review applicants, update stages | An organisation can run a complete hiring cycle. |
| P0 staff operations | Job/company moderation, candidate verification, applications, managed client roles, shortlists, user access | EduBridge can oversee quality and deliver its managed recruitment service. |
| P1 after launch | Career resources, notification archive, team accounts, interview scheduling | Add where usage shows a clear need; attach to existing journeys. |
| P2 when validated | Candidate assessments, employer subscriptions, analytics, consented talent discovery, automated matching | These need policy, data, and operational evidence before implementation. |

Future navigation can add an **Interviews** section inside candidate/employer workspaces, **Talent** and **Analytics** inside employer navigation, and **Assessments** inside staff navigation. The public header can stay at three primary links; new services belong on the relevant landing page or dashboard first.

## 10. Overlap and pages to avoid

- **No separate category landing pages in MVP.** Use filterable `/jobs` URLs. Add editorial category pages only if they serve a distinct audience task.
- **No standalone application success page.** Show a confirmation state in Apply with links to Applications and Find jobs.
- **No second company directory in MVP.** Public company profiles are reached from real jobs; a directory can wait for enough verified employers.
- **No separate candidate and employer sign-in pages.** One account entry preserves the destination and routes by role.
- **No duplicate job detail in dashboards.** Employer edit and applicant management are private tasks; the public job detail remains the canonical candidate view.
- **No generic Services page.** Explain self-serve and managed recruitment on For employers, then add a dedicated service page only if the offer becomes complex enough.
- **No empty Resources or About page.** Publish them when distinct, useful content exists.
- **No client-side-only access controls.** Private routes and data must be authorised on the server; see security issues [#2](https://github.com/mmesomakelvin/Recuiture_Website_Rebuild/issues/2), [#3](https://github.com/mmesomakelvin/Recuiture_Website_Rebuild/issues/3), and [#4](https://github.com/mmesomakelvin/Recuiture_Website_Rebuild/issues/4).

## 11. Decisions to validate together

1. **Managed recruitment in MVP:** This draft treats EduBridge-managed client roles and shortlists as essential because the product overview names them as a core service. Confirm the first release truly needs client-facing shortlist sharing.
2. **Company verification:** This draft gives all public company profiles a verification workflow. Define the evidence, reviewer role, and what candidates see while verification is pending.
3. **Application status vocabulary:** Agree on exact candidate-facing stages and which changes trigger email before wireframing dashboards.
4. **Job content:** Preview listings must be clearly labelled until genuine, authorised vacancies are available. Replace illustrative employers, dates, and salary ranges before launch.
5. **Visual shell update:** After this IA is approved, align `product/shell/spec.md` and the Next.js header/footer with these labels while retaining the floating translucent treatment.
