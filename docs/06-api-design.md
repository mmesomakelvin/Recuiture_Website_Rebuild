# API Design

## Conventions
- RESTful endpoints with proper HTTP verbs
- Zod validation on all inputs
- Consistent response format
- Rate limiting (100 req/min per IP)
- Error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_ERROR`

## Response Format
```typescript
// Success
{ success: true, data: T, meta?: { pagination, total } }

// Error
{ success: false, error: { code: string, message: string, details?: Record<string, string[]> } }
```

## Auth Headers
```
Authorization: Bearer <supabase_access_token>
```

## Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Email/password login |
| POST | `/api/auth/signout` | Sign out |
| POST | `/api/auth/callback` | OAuth callback |
| GET | `/api/auth/me` | Get current user + profile |

### Jobs (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs (query: q, location, type, experience, salaryMin, salaryMax, page, limit, sort) |
| GET | `/api/jobs/search` | Advanced search |
| GET | `/api/jobs/[id]` | Get job detail |
| GET | `/api/jobs/[id]/related` | Related jobs |

### Jobs (Employer)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs` | Create job (draft) |
| PUT | `/api/jobs/[id]` | Update job |
| PATCH | `/api/jobs/[id]/publish` | Publish job |
| PATCH | `/api/jobs/[id]/close` | Close job |
| DELETE | `/api/jobs/[id]` | Delete job (draft only) |
| GET | `/api/jobs/[id]/candidates` | List candidates with pipeline |
| PATCH | `/api/jobs/[id]/candidates/[candidateId]` | Update candidate status |

### Candidate
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/candidate/profile` | Get profile |
| PUT | `/api/candidate/profile` | Update profile |
| POST | `/api/candidate/resume` | Get signed upload URL |
| DELETE | `/api/candidate/resume` | Delete resume |
| GET | `/api/candidate/applications` | List applications |
| GET | `/api/candidate/applications/[id]` | Get application detail |
| POST | `/api/candidate/applications` | Apply to job |
| PATCH | `/api/candidate/applications/[id]/withdraw` | Withdraw application |
| GET | `/api/candidate/saved-jobs` | List saved jobs |
| POST | `/api/candidate/saved-jobs` | Save job |
| DELETE | `/api/candidate/saved-jobs/[jobId]` | Unsave job |

### Employer
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employer/company` | Get company |
| PUT | `/api/employer/company` | Update company |
| POST | `/api/employer/company/logo` | Get logo upload URL |
| GET | `/api/employer/jobs` | List company jobs |
| GET | `/api/employer/candidates` | List all candidates (pipeline) |
| GET | `/api/employer/analytics` | Dashboard analytics |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List users (filter: role, status, search) |
| PATCH | `/api/admin/users/[id]` | Update user (role, status) |
| DELETE | `/api/admin/users/[id]` | Delete user |
| GET | `/api/admin/jobs` | List all jobs (filter: status, flagged) |
| PATCH | `/api/admin/jobs/[id]` | Moderate job |
| GET | `/api/admin/analytics` | Platform metrics |
| GET | `/api/admin/audit-logs` | Audit trail |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/supabase` | Supabase auth events |

## Zod Validation Examples
```typescript
// Job creation
const createJobSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(50).max(10000),
  requirements: z.string().max(5000).optional(),
  location: z.string().min(2),
  isRemote: z.boolean().default(false),
  jobType: z.array(z.nativeEnum(JobType)).min(1),
  experienceLevel: z.enum(['JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']).optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  currency: z.string().length(3).default('USD'),
  skills: z.array(z.object({ skill: z.string(), isRequired: z.boolean() })).optional(),
  expiresAt: z.string().datetime().optional()
})

// Application
const applySchema = z.object({
  jobId: z.string().cuid(),
  coverLetter: z.string().max(5000).optional(),
  resumeUrl: z.string().url().optional(),
  screeningAnswers: z.record(z.string()).optional()
})
```

## Rate Limiting
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true
})
```