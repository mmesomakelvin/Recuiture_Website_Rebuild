# Employer Dashboard

## Pages
| Route | Description |
|-------|-------------|
| `/employer` | Overview (stats: active jobs, total applications, pipeline funnel) |
| `/employer/company` | Company profile (info, branding, verification status) |
| `/employer/company/team` | Team members (invite, remove, role management) |
| `/employer/jobs` | Jobs table (CRUD, status, views, applications) |
| `/employer/jobs/create` | Create job (3-step wizard) |
| `/employer/jobs/[id]` | Job detail + candidate pipeline |
| `/employer/jobs/[id]/edit` | Edit job |
| `/employer/candidates` | All candidates across jobs (unified pipeline) |
| `/employer/candidates/[id]` | Candidate profile + application history |
| `/employer/analytics` | Charts: views, applications, conversion, time-to-hire |
| `/employer/settings` | Account, notifications, billing (if applicable) |

## Job Creation Wizard
```
Step 1: Basics
  - Title, Job Type(s), Experience Level, Location/Remote
  - Salary range, Currency
  
Step 2: Details
  - Description (rich text)
  - Requirements (rich text)
  - Responsibilities (rich text)
  - Benefits (rich text)
  
Step 3: Screening & Publish
  - Custom screening questions (text, choice, yes/no)
  - Required skills (tags)
  - Save as Draft / Publish Now / Schedule
```

## Candidate Pipeline (Kanban)
- Per-job pipeline at `/employer/jobs/[id]/candidates`
- Unified pipeline at `/employer/candidates`
- Columns: Applied → Screening → Interview → Offer → Hired | Rejected
- Drag-drop (react-beautiful-dnd or @dnd-kit)
- Candidate card: Name, avatar, current role, match score, resume preview
- Click → Side panel with: Full profile, Resume viewer, Notes, Status history, Actions
- Bulk actions: Move stage, Send email, Reject with template

## Company Profile
- Logo, banner upload (Supabase Storage)
- Name, description, size, industry, location, founded year
- Social links (LinkedIn, Twitter, Website)
- Verification badge (admin approved)
- Team members with roles (Owner, Admin, Recruiter, Viewer)

## Analytics
- Job performance: Views, Applications, Conversion rate
- Pipeline: Stage conversion, Time in stage, Drop-off points
- Source tracking: Where candidates come from
- Team activity: Actions per recruiter
- Export CSV

## Permissions
| Role | Jobs | Candidates | Company | Team | Analytics |
|------|------|------------|---------|------|-----------|
| Owner | CRUD | Full | CRUD | Manage | Full |
| Admin | CRUD | Full | Edit | Manage | Full |
| Recruiter | CRUD | Full | View | View | View |
| Viewer | Read | Read | View | View | View |