# Job Board Feature

## User Stories
- As a visitor, I can browse jobs with filters
- As a visitor, I can search jobs by keyword, location
- As a candidate, I can view job details and apply
- As a candidate, I can save jobs for later
- As an employer, I can create/edit/delete my jobs
- As an admin, I can moderate jobs

## Job Listing Page (`/jobs`)
**Server Component** - SSR for SEO

### Features
- Search bar (keyword, location)
- Filters sidebar: Job Type, Experience Level, Salary Range, Remote, Date Posted
- Sort: Relevance, Date, Salary
- Pagination (infinite scroll or numbered)
- Job cards with: Title, Company, Location, Type badges, Salary, Posted date

### URL State
```
/jobs?q=react&location=remote&type=FULL_TIME&experience=SENIOR&salaryMin=100000&page=2&sort=date
```

### Data Fetching
```typescript
// Server action or API route
async function getJobs(params: JobSearchParams) {
  const where = buildWhereClause(params)
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { company: { select: { name, slug, logoUrl } } },
      orderBy: getOrderBy(params.sort),
      skip: (params.page - 1) * params.limit,
      take: params.limit
    }),
    prisma.job.count({ where })
  ])
  return { jobs, total, page: params.page, totalPages: Math.ceil(total / params.limit) }
}
```

## Job Detail Page (`/jobs/[slug]`)
**Server Component** - Static params for SEO

### Features
- Full job description (rich text)
- Requirements, responsibilities, benefits sections
- Company info card (logo, name, size, location, link)
- Salary range, job type badges
- **Apply Button** → Opens Apply Modal
- **Save Button** → Toggle save (auth required)
- Share buttons (LinkedIn, Twitter, Email)
- JSON-LD structured data for Google Jobs

### Apply Modal Flow
1. Click Apply → Check auth
2. If not authenticated → Redirect to login with `redirectTo=/jobs/[slug]?apply=true`
3. If authenticated candidate → Open modal with:
   - Resume selector (uploaded resumes + upload new)
   - Cover letter textarea (optional)
   - Screening questions (if job has them)
   - Submit → Create Application record
4. Success toast → Redirect to `/candidate/applications`

## Job Search API
```typescript
// GET /api/jobs?q=&location=&type=&experience=&salaryMin=&salaryMax=&remote=&page=&limit=&sort=
interface JobSearchParams {
  q?: string              // Full-text search on title, description, company name
  location?: string       // ILIKE on location
  type?: JobType[]        // IN clause
  experience?: string[]   // IN clause
  salaryMin?: number      // salaryMax >= salaryMin
  salaryMax?: number      // salaryMin <= salaryMax
  remote?: boolean        // isRemote = true
  datePosted?: '24h' | 'week' | 'month'
  page?: number
  limit?: number          // Default 20, max 50
  sort?: 'relevance' | 'date' | 'salary'
}
```

## Performance
- Database indexes on: `(status, publishedAt)`, `(companyId, status)`, `skills` GIN index
- Redis cache for popular searches (5 min TTL)
- Static generation for job detail pages (revalidate 1 hour)
- Image optimization for company logos (next/image)