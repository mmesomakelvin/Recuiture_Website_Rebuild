import { useEffect, useState } from 'react'
import { LogOut, Menu, Settings, UserRound, X } from 'lucide-react'
import { MainNav, type NavigationItem } from './MainNav'
import { GraduateMarker, UserAvatar, UserMenu, type ShellUser } from './UserMenu'

export interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  /** Signed-in user. Leave undefined to show the signed-out header. */
  user?: ShellUser
  onNavigate?: (href: string) => void
  onLogout?: () => void
  onSignIn?: () => void
  onPostJob?: () => void
}

const POPPINS = '"Poppins", ui-sans-serif, system-ui, sans-serif'

// Font variables are set too, so host stylesheets that style headings via
// var(--font-display) also pick up Poppins inside the shell.
const FONT_STACK = {
  fontFamily: POPPINS,
  '--font-display': POPPINS,
  '--font-sans': POPPINS,
  '--font-body': POPPINS,
  '--font-mono': '"IBM Plex Mono", ui-monospace, monospace',
} as React.CSSProperties

const FOOTER_GROUPS = [
  {
    title: 'Job seekers',
    links: [
      { label: 'Find Jobs', href: '/jobs' },
      { label: 'Companies', href: '/companies' },
      { label: 'Create a profile', href: '/sign-up' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { label: 'Post a job', href: '/employers/post-a-job' },
      { label: 'Hire with EduBridge', href: '/employers' },
      { label: 'Hire graduates', href: '/employers/graduates' },
    ],
  },
  {
    title: 'Recruiture',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'EduBridge Academy', href: 'https://edubridgeacademy.com' },
    ],
  },
]

function Wordmark({ onNavigate, inverted = false }: { onNavigate?: (href: string) => void; inverted?: boolean }) {
  return (
    <a
      href="/"
      onClick={(event) => {
        event.preventDefault()
        onNavigate?.('/')
      }}
      className="group flex shrink-0 items-center gap-2.5"
    >
      <span
        aria-hidden="true"
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold ${
          inverted ? 'bg-amber-400 text-teal-950' : 'bg-teal-900 text-amber-300 dark:bg-teal-700'
        }`}
      >
        R
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`text-lg font-bold tracking-tight ${
            inverted ? 'text-white' : 'text-teal-900 dark:text-white'
          }`}
        >
          Recruiture
        </span>
        <span
          className={`mt-1 text-[11px] font-medium ${
            inverted ? 'text-teal-100/80' : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          by EduBridge Academy
        </span>
      </span>
    </a>
  )
}

export function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  onLogout,
  onSignIn,
  onPostJob,
}: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileMenuOpen])

  const navigateAndClose = (href: string) => {
    setIsMobileMenuOpen(false)
    onNavigate?.(href)
  }

  const mobileLinkClass =
    'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-teal-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-teal-200'

  return (
    <div style={FONT_STACK} className="flex min-h-screen flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:border-stone-800 dark:bg-stone-950/95 dark:supports-[backdrop-filter]:bg-stone-950/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Wordmark onNavigate={onNavigate} />

          <div className="hidden flex-1 justify-center md:flex">
            <MainNav items={navigationItems} onNavigate={onNavigate} />
          </div>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            {user ? (
              <UserMenu user={user} onNavigate={onNavigate} onLogout={onLogout} />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onSignIn?.()}
                  className="px-2 py-2 text-sm font-medium text-stone-700 transition-colors hover:text-teal-800 dark:text-stone-300 dark:hover:text-teal-200"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => onPostJob?.()}
                  className="rounded-lg bg-teal-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:bg-teal-700 dark:hover:bg-teal-600"
                >
                  Post a job
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            className="ml-auto rounded-lg p-2 text-stone-700 transition-colors hover:bg-stone-100 md:hidden dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div
            className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-stone-950">
            <div className="flex h-16 items-center justify-between border-b border-stone-200 px-4 dark:border-stone-800">
              <Wordmark onNavigate={navigateAndClose} />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <MainNav items={navigationItems} onNavigate={navigateAndClose} orientation="vertical" />
            </div>

            <div className="border-t border-stone-200 px-3 py-4 dark:border-stone-800">
              {user ? (
                <>
                  <div className="mb-3 flex items-center gap-3 px-4">
                    <UserAvatar user={user} size="lg" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">{user.name}</p>
                      {user.email && (
                        <p className="truncate text-xs text-stone-500 dark:text-stone-400">{user.email}</p>
                      )}
                      {user.isVerifiedGraduate && (
                        <div className="mt-1.5">
                          <GraduateMarker />
                        </div>
                      )}
                    </div>
                  </div>
                  <button type="button" className={mobileLinkClass} onClick={() => navigateAndClose('/profile')}>
                    <UserRound className="h-5 w-5" />
                    Profile
                  </button>
                  <button type="button" className={mobileLinkClass} onClick={() => navigateAndClose('/settings')}>
                    <Settings className="h-5 w-5" />
                    Settings
                  </button>
                  <button
                    type="button"
                    className={mobileLinkClass}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onLogout?.()
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onPostJob?.()
                    }}
                    className="w-full rounded-lg bg-teal-900 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-teal-800 dark:bg-teal-700 dark:hover:bg-teal-600"
                  >
                    Post a job
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onSignIn?.()
                    }}
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 text-base font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="bg-teal-950 text-teal-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div className="max-w-xs">
              <Wordmark onNavigate={onNavigate} inverted />
              <p className="mt-4 text-sm leading-relaxed text-teal-100/80">
                Jobs across Nigeria, and a direct line to trained EduBridge Academy graduates.
              </p>
            </div>
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold text-amber-300">{group.title}</h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(event) => {
                          event.preventDefault()
                          onNavigate?.(link.href)
                        }}
                        className="text-sm text-teal-100/80 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-teal-800/60 pt-6 text-xs text-teal-100/60 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} EduBridge Academy. All rights reserved.</p>
            <p>Recruiture is a service of EduBridge Academy.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AppShell
