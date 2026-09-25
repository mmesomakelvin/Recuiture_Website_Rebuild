import { useState } from 'react'
import { AppShell } from './components/AppShell'
import type { ShellUser } from './components/UserMenu'

type PreviewRole = 'visitor' | 'candidate' | 'employer' | 'recruiter'

const PREVIEW_USERS: Record<Exclude<PreviewRole, 'visitor'>, { user: ShellUser; dashboardLabel: string }> = {
  candidate: {
    user: { name: 'Chiamaka Obi', email: 'chiamaka.obi@example.com', isVerifiedGraduate: true },
    dashboardLabel: 'My Dashboard',
  },
  employer: {
    user: { name: 'Tunde Bakare', email: 'tunde@paystream.ng' },
    dashboardLabel: 'Employer Dashboard',
  },
  recruiter: {
    user: { name: 'Ifeoma Nwosu', email: 'ifeoma@edubridgeacademy.com' },
    dashboardLabel: 'Recruiter Hub',
  },
}

const ROLE_LABELS: Record<PreviewRole, string> = {
  visitor: 'Visitor',
  candidate: 'Candidate (graduate)',
  employer: 'Employer',
  recruiter: 'Recruiter',
}

export default function ShellPreview() {
  const [role, setRole] = useState<PreviewRole>('candidate')
  const signedIn = role === 'visitor' ? undefined : PREVIEW_USERS[role]

  const navigationItems = [
    { label: 'Find Jobs', href: '/jobs', isActive: true },
    { label: 'Companies', href: '/companies' },
    { label: 'For Employers', href: '/employers' },
    ...(signedIn ? [{ label: signedIn.dashboardLabel, href: '/dashboard' }] : []),
  ]

  return (
    <AppShell
      navigationItems={navigationItems}
      user={signedIn?.user}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
      onSignIn={() => console.log('Sign in')}
      onPostJob={() => console.log('Post a job')}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 inline-flex flex-wrap gap-1 rounded-xl border border-stone-200 bg-white p-1 dark:border-stone-800 dark:bg-stone-900">
          {(Object.keys(ROLE_LABELS) as PreviewRole[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRole(option)}
              className={
                option === role
                  ? 'rounded-lg bg-teal-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-teal-700'
                  : 'rounded-lg px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
              }
            >
              {ROLE_LABELS[option]}
            </button>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Content area</h1>
        <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-400">
          Section screens such as the job board render here. Use the switcher above to see the header as a visitor or as each signed-in role.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((placeholder) => (
            <div
              key={placeholder}
              className="h-40 rounded-xl border border-dashed border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-900"
            />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
