# Open Questions & Decisions Needed

## 1. Resume Parsing
**Decision**: Auto-extract from PDF/DOCX vs Manual entry only for MVP

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| **Manual only** | Free, simple, privacy-friendly | Poor UX, incomplete profiles | $0 |
| **Affinda API** | Accurate, structured data, webhook support | $0.10/page, external dependency | ~$100/mo for 1000 resumes |
| **Parseur** | Template-based, good for known formats | Setup time, less flexible | ~$50/mo |
| **Open source (pdf-parse + NLP)** | Free, self-hosted | Lower accuracy, maintenance | Dev time |

**Recommendation**: Start with manual entry + file upload. Add Affinda in Phase 2 if budget allows.

## 2. Email Provider
**Decision**: Transactional email service

| Option | Free Tier | Deliverability | DX | Cost at Scale |
|--------|-----------|----------------|-----|---------------|
| **Resend** | 3,000/mo | Excellent | Best (React Email) | $20/100k |
| **SendGrid** | 100/day | Good | Good | $15/100k |
| **Supabase SMTP** | Included | Basic | Basic | Included |
| **Postmark** | 100/mo | Best | Good | $10/10k |

**Recommendation**: Resend - best developer experience, generous free tier, React Email integration.

## 3. Search Implementation
**Decision**: Postgres full-text vs Algolia/Meilisearch

| Option | Setup | Features | Cost | Latency |
|--------|-------|----------|------|---------|
| **Postgres FTS** | Simple (tsvector) | Basic ranking, filters | Free | ~50ms |
| **Meilisearch** | Medium (Docker) | Typo tolerance, facets, geo | Self-hosted/$ | ~20ms |
| **Algolia** | Easy (API) | Best relevance, analytics | $1.50/10k req | ~10ms |
| **Typesense** | Medium | Good features, open source | Self-hosted/$ | ~30ms |

**Recommendation**: Postgres FTS for MVP. Upgrade to Meilisearch when search becomes critical.

## 4. File Storage
**Decision**: Supabase Storage vs AWS S3

| Option | Cost | Integration | CDN | Migration |
|--------|------|-------------|-----|-----------|
| **Supabase Storage** | 1GB free, $0.021/GB | Native (same auth) | Built-in | Easy to S3 |
| **AWS S3** | $0.023/GB + requests | Manual setup | CloudFront | Native |
| **Cloudflare R2** | $0.015/GB, no egress | S3-compatible | Built-in | Easy |

**Recommendation**: Supabase Storage - included, integrated auth, sufficient for MVP.

## 5. Real-time Features
**Decision**: Supabase Realtime vs Pusher/Ably

| Option | Cost | Scale | Features |
|--------|------|-------|----------|
| **Supabase Realtime** | Included (2M msgs/mo) | Good | Postgres changes, presence |
| **Pusher** | 200k msgs free | Excellent | Channels, presence, webhooks |
| **Ably** | 3M msgs free | Excellent | Pub/sub, presence, history |

**Recommendation**: Supabase Realtime - included, integrates with database changes.

## 6. Timeline & Milestones

### Week 1: Foundation
- [ ] Next.js + TypeScript + Tailwind init
- [ ] Prisma schema + migrations
- [ ] Supabase Auth + clients + middleware
- [ ] shadcn/ui components
- [ ] Layout structures (marketing, auth, dashboards)

### Week 2: Core Features
- [ ] Job board (list, search, detail, apply)
- [ ] Candidate portal (profile, resume, applications, saved)
- [ ] Employer dashboard (company, jobs CRUD, pipeline)
- [ ] API routes for all CRUD

### Week 3: Advanced
- [ ] Admin panel (users, jobs, analytics)
- [ ] Real-time notifications
- [ ] Email notifications (Resend)
- [ ] File uploads (resumes, logos)
- [ ] SEO optimization

### Week 4: Launch
- [ ] Testing (unit, E2E)
- [ ] Performance audit
- [ ] Security review
- [ ] Deploy to production
- [ ] Monitoring setup

## 7. Questions for Client

1. **Target launch date?** (Hard deadline?)
2. **Budget for third-party services?** (Affinda, Algolia, etc.)
3. **Existing Supabase/Vercel accounts?** Or create new?
4. **Custom domain ready?** (SSL, DNS access)
5. **Email domain verified?** (For Resend/SendGrid)
6. **Team size?** (How many developers working on this?)
7. **Design system?** (Figma files, brand guidelines, or design from scratch?)
8. **Data migration?** (Existing users/jobs from current site?)
9. **Compliance requirements?** (GDPR, CCPA, SOC2?)
10. **Analytics needs?** (Basic or advanced custom dashboards?)

## 8. Technical Decisions Made

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | Next.js 14 App Router | Modern, SEO-friendly, server components |
| Language | TypeScript | Type safety, better DX |
| Styling | Tailwind + shadcn/ui | Rapid dev, consistent design, accessible |
| Database | PostgreSQL + Prisma | Type-safe ORM, migrations, relations |
| Auth | Supabase Auth | Managed, OAuth, row-level security |
| Storage | Supabase Storage | Integrated, S3-compatible |
| Realtime | Supabase Realtime | Database change streams |
| Email | Resend | React Email, great DX |
| Validation | Zod | TypeScript-first, fast |
| Forms | React Hook Form + Zod | Performance, validation |
| Deployment | Vercel | Native Next.js support |
| CI/CD | GitHub Actions | Free for public, integrated |