# Supabase Auth Integration

## Architecture
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  Supabase Auth   │────▶│  PostgreSQL     │
│  (Client/Server)│     │  (GoTrue)        │     │  (Prisma)       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │                       │
        │              ┌────────▼────────┐             │
        └─────────────▶│  Auth Middleware │────────────┘
                       │  (Route Guard)  │
                       └─────────────────┘
```

## Supabase Clients

### Client-side (`lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Server-side (`lib/supabase/server.ts`)
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        }
      }
    }
  )
}
```

### Service Role (`lib/supabase/admin.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
```

## Auth Flow

### 1. Sign Up
```typescript
// POST /api/auth/signup
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { full_name: name, role: 'CANDIDATE' },
    emailRedirectTo: `${origin}/auth/callback`
  }
})
// Creates user in Supabase Auth
// Triggers webhook → creates User record in Prisma with role
```

### 2. Sign In
```typescript
// POST /api/auth/signin
const { data, error } = await supabase.auth.signInWithPassword({ email, password })
// Sets session cookies via SSR client
```

### 3. OAuth (Google, GitHub, LinkedIn)
```typescript
// GET /api/auth/oauth?provider=google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${origin}/auth/callback` }
})
```

### 4. Session Management
- SSR: `supabase.auth.getUser()` in server components
- Client: `useSession()` hook with `onAuthStateChange`
- Middleware: Refreshes session, protects routes

### 5. Route Protection (`middleware.ts`)
```typescript
export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Public routes
  if (isPublicRoute(request.nextUrl.pathname)) return response
  
  // Auth required
  if (!user) return redirectToLogin(request)
  
  // Role-based access
  const profile = await getUserProfile(user.id)
  if (!hasAccess(profile.role, request.nextUrl.pathname)) {
    return redirectToDashboard(profile.role)
  }
  
  return response
}
```

## Role Sync (Supabase → Prisma)
```typescript
// Webhook: supabase.auth.user.created/updated
// POST /api/webhooks/supabase
export async function POST(req: Request) {
  const { type, record } = await req.json()
  
  if (type === 'user.created' || type === 'user.updated') {
    await prisma.user.upsert({
      where: { supabaseId: record.id },
      create: {
        supabaseId: record.id,
        email: record.email,
        fullName: record.user_metadata.full_name,
        avatarUrl: record.user_metadata.avatar_url,
        role: record.user_metadata.role || 'CANDIDATE'
      },
      update: {
        email: record.email,
        fullName: record.user_metadata.full_name,
        avatarUrl: record.user_metadata.avatar_url
      }
    })
  }
}
```

## Protected Route Patterns
| Route Pattern | Access |
|---------------|--------|
| `/` `/jobs` `/jobs/*` | Public |
| `/auth/*` | Public (unauthenticated only) |
| `/candidate/*` | CANDIDATE, ADMIN |
| `/employer/*` | EMPLOYER, ADMIN |
| `/admin/*` | ADMIN |
| `/api/candidate/*` | CANDIDATE, ADMIN |
| `/api/employer/*` | EMPLOYER, ADMIN |
| `/api/admin/*` | ADMIN |