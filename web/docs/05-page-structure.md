# Page Structure & Routes

## Route Groups (App Router)

```
app/
├── (marketing)/                    # Public marketing pages
│   ├── layout.tsx                  # Marketing layout (header, footer)
│   ├── page.tsx                    # Landing page
│   ├── jobs/
│   │   ├── page.tsx                # Job board listing
│   │   └── [slug]/
│   │       └── page.tsx            # Job detail (SEO optimized)
│   ├── companies/
│   │   ├── page.tsx                # Company directory
│   │   └── [slug]/
│   │       └── page.tsx            # Company profile
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── pricing/page.tsx            # If applicable
│
├── (auth)/                         # Authentication pages
│   ├── layout.tsx                  # Auth layout (centered card)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── callback/page.tsx           # OAuth callback
│   └── verify-email/page.tsx
│
├── (candidate)/                    # Candidate dashboard
│   ├── layout.tsx                  # Dashboard layout with sidebar
│   ├── page.tsx                    # Overview / dashboard home
│   ├── profile/
│   │   ├── page.tsx                # Profile view/edit
│   │   └── resume/page.tsx         # Resume builder/upload
│   ├── applications/
│   │   ├── page.tsx                # Applications list (kanban)
│   │   └── [id]/page.tsx           # Application detail
│   ├── saved-jobs/page.tsx
│   ├── settings/
│   │   ├── page.tsx                # Account settings
│   │   ├── notifications/page.tsx
│   │   └── privacy/page.tsx
│   └── messages/                   # If messaging feature
│       └── page.tsx
│
├── (employer)/                     # Employer dashboard
│   ├── layout.tsx
│   ├── page.tsx                    # Employer overview
│   ├── company/
│   │   ├── page.tsx                # Company profile view/edit
│   │   └── team/page.tsx           # Team management
│   ├── jobs/
│   │   ├── page.tsx                # Jobs list (CRUD)
│   │   ├── create/page.tsx         # Create job (multi-step)
│   │   └── [id]/
│   │       ├── page.tsx            # Job detail
│   │       ├── edit/page.tsx
│   │       └── candidates/page.tsx # Candidate pipeline for this job
│   ├── candidates/
│   │   ├── page.tsx                # All candidates (pipeline view)
│   │   └── [id]/page.tsx           # Candidate profile
│   ├── analytics/page.tsx
│   └── settings/page.tsx
│
├── (admin)/                        # Admin panel
│   ├── layout.tsx
│   ├── page.tsx                    # Admin dashboard
│   ├── users/page.tsx              # User management
│   ├── jobs/page.tsx               # Job moderation
│   ├── companies/page.tsx          # Company verification
│   ├── analytics/page.tsx          # Platform analytics
│   └── settings/page.tsx           # Platform settings
│
└── api/                            # API Routes
    ├── auth/
    │   ├── signup/route.ts
    │   ├── signin/route.ts
    │   ├── signout/route.ts
    │   ├── callback/route.ts
    │   └── me/route.ts
    ├── jobs/
    │   ├── route.ts                # GET (list), POST (create)
    │   ├── [id]/
    │   │   ├── route.ts            # GET, PUT, DELETE
    │   │   ├── apply/route.ts      # POST application
    │   │   └── candidates/route.ts # GET candidates for job
    │   └── search/route.ts         # GET with filters
    ├── candidate/
    │   ├── profile/route.ts        # GET, PUT profile
    │   ├── resume/route.ts         # POST upload, DELETE
    │   ├── applications/route.ts   # GET list
    │   ├── applications/[id]/route.ts
    │   └── saved-jobs/route.ts
    ├── employer/
    │   ├── company/route.ts
    │   ├── jobs/route.ts
    │   ├── jobs/[id]/route.ts
    │   ├── candidates/route.ts
    │   └── analytics/route.ts
    ├── admin/
    │   ├── users/route.ts
    │   ├── users/[id]/route.ts
    │   ├── jobs/route.ts
    │   └── analytics/route.ts
    ├── webhooks/
    │   └── supabase/route.ts       # Auth webhooks
    └── upload/
        └── resume/route.ts         # Signed upload URL
```

## SEO & Metadata
- Each job detail page: dynamic `generateMetadata` with JSON-LD JobPosting schema
- Sitemap: `next-sitemap` config for jobs, companies
- Robots.txt: Allow all, disallow auth/admin