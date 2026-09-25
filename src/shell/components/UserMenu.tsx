import { useEffect, useRef, useState } from 'react'
import { ChevronDown, GraduationCap, LogOut, Settings, UserRound } from 'lucide-react'

export interface ShellUser {
  name: string
  email?: string
  avatarUrl?: string
  isVerifiedGraduate?: boolean
}

interface UserMenuProps {
  user: ShellUser
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function UserAvatar({ user, size = 'md' }: { user: ShellUser; size?: 'md' | 'lg' }) {
  const dimensions = size === 'lg' ? 'h-11 w-11 text-base' : 'h-9 w-9 text-sm'

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className={`${dimensions} shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-stone-900`}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`${dimensions} flex shrink-0 items-center justify-center rounded-full bg-teal-900 font-semibold text-white ring-2 ring-white dark:bg-teal-700 dark:ring-stone-900`}
    >
      {getInitials(user.name)}
    </span>
  )
}

export function GraduateMarker() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-400/15 dark:text-amber-300">
      <GraduationCap className="h-3.5 w-3.5" strokeWidth={2.25} />
      EduBridge Graduate
    </span>
  )
}

export function UserMenu({ user, onNavigate, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const select = (action: () => void) => {
    setIsOpen(false)
    action()
  }

  const itemClass =
    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-stone-700 transition-colors hover:bg-stone-100 hover:text-teal-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-teal-200'

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
      >
        <UserAvatar user={user} />
        <span className="hidden max-w-[10rem] truncate text-sm font-medium text-stone-800 lg:inline dark:text-stone-200">
          {user.name}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-stone-200 bg-white p-2 shadow-lg shadow-stone-900/10 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/40"
        >
          <div className="px-3 pb-3 pt-2">
            <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">{user.name}</p>
            {user.email && (
              <p className="truncate text-xs text-stone-500 dark:text-stone-400">{user.email}</p>
            )}
            {user.isVerifiedGraduate && (
              <div className="mt-2">
                <GraduateMarker />
              </div>
            )}
          </div>
          <div className="my-1 h-px bg-stone-200 dark:bg-stone-800" />
          <button type="button" role="menuitem" className={itemClass} onClick={() => select(() => onNavigate?.('/profile'))}>
            <UserRound className="h-4 w-4" />
            Profile
          </button>
          <button type="button" role="menuitem" className={itemClass} onClick={() => select(() => onNavigate?.('/settings'))}>
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <div className="my-1 h-px bg-stone-200 dark:bg-stone-800" />
          <button type="button" role="menuitem" className={itemClass} onClick={() => select(() => onLogout?.())}>
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
