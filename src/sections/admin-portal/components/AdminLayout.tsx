import { useEffect, useRef, useState } from 'react'
import { Bell, BriefcaseBusiness, CalendarDays, ChevronDown, Inbox, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react'
import type { AdminView, StaffUser } from '@/../product/sections/admin-portal/types'
import { Avatar } from './Bits'
import { formatLongDate } from './format'

const NAV_ITEMS: { view: AdminView; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; hint: string }[] = [
  { view: 'overview', label: 'Dashboard', icon: LayoutDashboard, hint: 'Items needing attention' },
  { view: 'jobs', label: 'Jobs', icon: BriefcaseBusiness, hint: 'Closing within 7 days' },
  { view: 'applications', label: 'Applications', icon: Users, hint: 'Waiting for first review' },
  { view: 'enquiries', label: 'Enquiries', icon: Inbox, hint: 'New enquiries' },
]

const VIEW_TITLES: Record<AdminView, string> = {
  overview: 'Dashboard',
  jobs: 'Jobs',
  applications: 'Applications',
  enquiries: 'Enquiries',
}

interface AdminLayoutProps {
  currentStaff: StaffUser
  /** Today's date (YYYY-MM-DD), shown in the top bar */
  today: string
  activeView: AdminView
  /** Attention counts shown as badges next to each nav item */
  counts: Record<AdminView, number>
  onNavigate: (view: AdminView) => void
  onSignOut?: () => void
  children: React.ReactNode
}

function Wordmark() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-lg font-bold text-teal-950 shadow-sm">R</span>
      <span className="leading-tight">
        <span className="block text-lg font-semibold tracking-tight text-white">Recruiture</span>
        <span className="block text-xs text-teal-200/80">Staff portal</span>
      </span>
    </div>
  )
}

function AccountMenu({ staff, onSignOut }: { staff: StaffUser; onSignOut?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [isOpen])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-2 text-left transition hover:bg-stone-100"
      >
        <Avatar id={staff.id} name={staff.name} size="md" />
        <span className="hidden leading-tight sm:block">
          <span className="block text-sm font-semibold text-stone-900">{staff.name}</span>
          <span className="block text-xs text-stone-500">EduBridge staff</span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-stone-400 sm:block" />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="ap-pop absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-stone-200"
        >
          <div className="border-b border-stone-200 px-4 py-3">
            <p className="text-sm font-semibold text-stone-900">{staff.name}</p>
            <p className="truncate text-xs text-stone-500">{staff.email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false)
              onSignOut?.()
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Sidebar links. The active link joins the page background with a rounded
 * tab that runs into the content area.
 */
function NavList({
  activeView,
  counts,
  onNavigate,
}: {
  activeView: AdminView
  counts: Record<AdminView, number>
  onNavigate: (view: AdminView) => void
}) {
  return (
    <ul className="space-y-1.5 pl-4">
      {NAV_ITEMS.map(({ view, label, icon: Icon, hint }) => {
        const isActive = view === activeView
        const count = counts[view]
        return (
          <li key={view}>
            <button
              type="button"
              onClick={() => onNavigate(view)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex w-full items-center gap-4 rounded-l-full py-3 pl-5 pr-6 text-[15px] font-medium transition ${
                isActive
                  ? 'bg-white text-teal-900'
                  : 'text-teal-100/75 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-teal-700' : ''}`} strokeWidth={2} />
              <span className="flex-1 text-left">{label}</span>
              {count > 0 && (
                <span
                  title={`${count} ${hint.toLowerCase()}`}
                  className="min-w-6 rounded-full bg-amber-400 px-2 py-0.5 text-center text-xs font-semibold text-teal-950"
                >
                  {count}
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function SidebarFooter() {
  return (
    <div className="px-8 pb-8 text-xs leading-relaxed text-teal-200/60">
      <p className="font-semibold text-teal-100/80">EduBridge Academy</p>
      <p>Recruiture staff portal</p>
    </div>
  )
}

export function AdminLayout({ currentStaff, today, activeView, counts, onNavigate, onSignOut, children }: AdminLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const attention = counts.jobs + counts.applications + counts.enquiries

  const navigate = (view: AdminView) => {
    setIsMenuOpen(false)
    onNavigate(view)
  }

  return (
    <div className="min-h-screen bg-white text-stone-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-teal-900 lg:flex">
        <div className="px-6 py-7">
          <Wordmark />
        </div>
        <nav aria-label="Admin" className="flex-1 pt-4">
          <NavList activeView={activeView} counts={counts} onNavigate={navigate} />
        </nav>
        <SidebarFooter />
      </aside>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="ap-fade absolute inset-0 bg-stone-950/50" onClick={() => setIsMenuOpen(false)} />
          <nav aria-label="Admin" className="ap-panel absolute inset-y-0 left-0 flex w-72 flex-col bg-teal-900 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-6">
              <Wordmark />
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close navigation"
                className="rounded-lg p-1.5 text-teal-100 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 pt-2">
              <NavList activeView={activeView} counts={counts} onNavigate={navigate} />
            </div>
            <SidebarFooter />
          </nav>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open navigation"
              className="-ml-1.5 rounded-lg p-1.5 text-stone-600 hover:bg-stone-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="flex-1 text-xl font-semibold tracking-tight text-stone-900 lg:text-2xl">
              {VIEW_TITLES[activeView]}
            </h1>
            <span className="hidden items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 text-sm text-stone-600 md:inline-flex">
              <CalendarDays className="h-4 w-4 text-teal-700" />
              {formatLongDate(today)}
            </span>
            <button
              type="button"
              onClick={() => navigate('overview')}
              aria-label={`${attention} items need attention`}
              className="relative rounded-xl bg-teal-50 p-2.5 text-teal-800 transition hover:bg-teal-100"
            >
              <Bell className="h-5 w-5" />
              {attention > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white ring-2 ring-white">
                  {attention}
                </span>
              )}
            </button>
            <span className="hidden h-8 w-px bg-stone-200 sm:block" />
            <AccountMenu staff={currentStaff} onSignOut={onSignOut} />
          </div>
        </header>

        <main className="min-w-0">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
