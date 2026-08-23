# Recruiture Documentation

## Overview
This folder contains all project documentation for the Recruiture recruitment platform.

## Files

| File | Description |
|------|-------------|
| `01-project-overview.md` | Project goals, tech stack, timeline, structure |
| `02-prisma-schema.md` | Complete Prisma schema with all models |
| `03-auth-flow.md` | Supabase Auth integration, clients, middleware |
| `04-component-library.md` | UI components (shadcn/ui + custom) |
| `05-page-structure.md` | Route map, route groups, API endpoints |
| `06-api-design.md` | REST API design, validation, rate limiting |
| `07-features/job-board.md` | Job board feature specification |
| `07-features/candidate-portal.md` | Candidate portal specification |
| `07-features/employer-dashboard.md` | Employer dashboard specification |
| `07-features/admin-panel.md` | Admin panel specification |
| `08-deployment.md` | Deployment guide (Vercel, Supabase, CI/CD) |
| `09-open-questions.md` | Decisions needed, technical choices, milestones |

## Quick Reference

### Tech Stack
- **Framework**: Next.js 14+ App Router + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **Email**: Resend
- **Deployment**: Vercel + Supabase/Neon

### Key Commands
```bash
# Development
npm run dev

# Database
npx prisma migrate dev --name migration_name
npx prisma generate
npx prisma studio

# Build
npm run build
npm run lint
npm run typecheck

# Deploy
git push origin main  # Auto-deploys via Vercel
```

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   └── features/           # Feature-specific components
├── lib/                    # Utilities & clients
│   ├── supabase/           # Supabase clients
│   ├── prisma.ts           # Prisma client
│   ├── utils.ts            # Helpers
│   └── validations/        # Zod schemas
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
└── styles/                 # Global styles
```