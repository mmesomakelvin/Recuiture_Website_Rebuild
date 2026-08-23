# Deployment Guide

## Infrastructure

### Vercel (Frontend)
- Connect GitHub repo
- Framework preset: Next.js
- Environment variables (see below)
- Auto-deploy on push to main

### Supabase (Backend)
- Project: Create at supabase.com
- Database: PostgreSQL (managed)
- Auth: Configure providers, email templates
- Storage: Buckets for resumes, logos, banners
- Realtime: Enable for notifications table
- Edge Functions: For webhooks if needed

### Database (PostgreSQL)
- **Option A**: Supabase (included, easiest)
- **Option B**: Neon (serverless, branching)
- **Option C**: Railway/Render/AWS RDS

## Environment Variables

### Required
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIs..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIs..."

# App
NEXT_PUBLIC_APP_URL="https://recruiture.edubridgeacademy.com"
NODE_ENV="production"
```

### Optional (Email, Analytics, etc.)
```env
# Resend (transactional emails)
RESEND_API_KEY="re_xxx"
EMAIL_FROM="noreply@recruiture.com"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Rate limiting (Upstash)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Resume parsing (Affinda)
AFFINDA_API_KEY="xxx"
```

## Vercel Deployment Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create recruiture --public --source=. --push
   ```

2. **Import in Vercel**
   - Go to vercel.com/new
   - Import GitHub repo
   - Add environment variables
   - Deploy

3. **Configure Custom Domain**
   - Settings → Domains → Add `recruiture.edubridgeacademy.com`
   - Add DNS records (CNAME to cname.vercel-dns.com)

## Supabase Setup

1. **Create Project**
   - supabase.com → New Project
   - Note: Project URL and anon/service keys

2. **Run Migrations**
   ```bash
   # Local
   npx prisma migrate deploy
   
   # Or use Supabase CLI
   supabase db push
   ```

3. **Configure Auth**
   - Authentication → Providers → Enable Email, Google, GitHub, LinkedIn
   - Email templates: Confirm signup, Reset password, Magic link
   - Site URL: `https://recruiture.edubridgeacademy.com`
   - Redirect URLs: Add callback URL

4. **Create Storage Buckets**
   - Storage → New bucket: `resumes` (private)
   - Storage → New bucket: `logos` (public)
   - Storage → New bucket: `banners` (public)
   - Set policies for authenticated users

5. **Enable Realtime**
   - Database → Replication → Enable for `notifications` table

6. **Configure Webhooks**
   - Database → Webhooks → New webhook
   - Table: `auth.users`
   - Events: INSERT, UPDATE
   - URL: `https://recruiture.edubridgeacademy.com/api/webhooks/supabase`

## Prisma Commands

```bash
# Development
npx prisma migrate dev --name migration_name
npx prisma generate
npx prisma studio

# Production
npx prisma migrate deploy
npx prisma generate

# Seed (optional)
npx prisma db seed
```

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - run: npx prisma migrate deploy
        env: { DATABASE_URL: ${{ secrets.DATABASE_URL }} }
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Post-Deployment Checklist

- [ ] SSL certificate active
- [ ] Custom domain working
- [ ] Supabase Auth callbacks working
- [ ] Email delivery tested (signup, reset, notifications)
- [ ] File uploads working (resumes, logos)
- [ ] Realtime notifications working
- [ ] Database backups enabled (Supabase: daily auto)
- [ ] Monitoring: Vercel Analytics, Supabase Logs
- [ ] Error tracking: Sentry (optional)
- [ ] SEO: Sitemap generated, robots.txt correct