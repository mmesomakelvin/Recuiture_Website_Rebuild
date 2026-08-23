# Recruiture - Recruitment Platform

## Project Goals
Build a modern recruitment platform replacing recruiture.edubridgeacademy.com with:
- Job board with search/filter
- Candidate portal (profiles, applications, saved jobs)
- Employer dashboard (company profile, job management, candidate pipeline)
- Admin panel (user management, moderation, analytics)

## Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ App Router + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| Auth | Supabase Auth (email/password + OAuth) |
| Storage | Supabase Storage (resumes, logos) |
| Realtime | Supabase Realtime (notifications, status updates) |
| Deployment | Vercel (web) + Supabase/Neon (DB) |
| Email | Resend (transactional) |
| Validation | Zod |
| Testing | Vitest (unit) + Playwright (E2E) |

## Timeline (4 weeks)
- **Week 1**: Foundation (init, schema, auth, components, layouts)
- **Week 2**: Core features (job board, candidate portal, employer dashboard)
- **Week 3**: Admin panel, APIs, realtime, polish
- **Week 4**: Testing, deployment, launch

## Project Structure
```
src/
├── app/
│   ├── (marketing)/          # Public pages
│   ├── (auth)/               # Login, register, callback
│   ├── (candidate)/          # Candidate dashboard
│   ├── (employer)/           # Employer dashboard
│   ├── (admin)/              # Admin panel
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── forms/                # Form components
│   ├── layout/               # Layout components
│   └── features/             # Feature-specific components
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── prisma.ts             # Prisma client
│   ├── utils.ts              # Utilities
│   └── validations/          # Zod schemas
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript types
└── styles/                   # Global styles
```