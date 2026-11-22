import { useEffect } from 'react'
import { Clock, GraduationCap, TriangleAlert, X } from 'lucide-react'
import type {
  ApplicationStage,
  ClosedReason,
  Company,
  EnquirySource,
  EnquiryStatus,
  JobStatus,
} from '@/../product/sections/admin-portal/types'
import {
  ENQUIRY_SOURCE_LABELS,
  ENQUIRY_STATUS_LABELS,
  JOB_STATUS_LABELS,
  STAGE_LABELS,
  dueLabel,
  dueState,
  formatDate,
  initials,
  toneFor,
} from './format'
import { MONO } from './styles'

const PILL = 'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold'

// -----------------------------------------------------------------------------
// Status badges
// -----------------------------------------------------------------------------

const STAGE_TONES: Record<ApplicationStage, string> = {
  applied: 'bg-stone-100 text-stone-700 ring-1 ring-inset ring-stone-200',
  screening: 'bg-amber-50 text-amber-900 ring-1 ring-inset ring-amber-200',
  interview: 'bg-teal-50 text-teal-900 ring-1 ring-inset ring-teal-200',
  offer: 'bg-teal-800 text-white',
  hired: 'bg-emerald-600 text-white',
  'not-selected': 'bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-200',
  withdrawn: 'bg-white text-stone-500 border border-dashed border-stone-300',
  'role-cancelled': 'bg-white text-stone-500 ring-1 ring-inset ring-stone-300 line-through decoration-stone-400',
}

const STAGE_DOTS: Partial<Record<ApplicationStage, string>> = {
  applied: 'bg-stone-400',
  screening: 'bg-amber-500',
  interview: 'bg-teal-600',
}

export function StageBadge({ stage }: { stage: ApplicationStage }) {
  const dot = STAGE_DOTS[stage]
  return (
    <span className={`${PILL} ${STAGE_TONES[stage]}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
      {STAGE_LABELS[stage]}
    </span>
  )
}

const JOB_STATUS_TONES: Record<JobStatus, string> = {
  draft: 'bg-stone-100 text-stone-600 ring-1 ring-inset ring-stone-200',
  published: 'bg-teal-50 text-teal-900 ring-1 ring-inset ring-teal-200',
  paused: 'bg-amber-50 text-amber-900 ring-1 ring-inset ring-amber-200',
  closed: 'bg-stone-800 text-stone-100',
}

const JOB_STATUS_DOTS: Record<JobStatus, string> = {
  draft: 'bg-stone-400',
  published: 'bg-teal-600',
  paused: 'bg-amber-500',
  closed: 'bg-stone-400',
}

export function JobStatusBadge({ status, closedReason }: { status: JobStatus; closedReason?: ClosedReason | null }) {
  const label =
    status === 'closed' && closedReason ? `Closed: ${closedReason === 'filled' ? 'Filled' : 'Cancelled'}` : JOB_STATUS_LABELS[status]
  return (
    <span className={`${PILL} ${JOB_STATUS_TONES[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${JOB_STATUS_DOTS[status]}`} />
      {label}
    </span>
  )
}

const ENQUIRY_TONES: Record<EnquiryStatus, string> = {
  new: 'bg-amber-400 text-amber-950',
  'in-progress': 'bg-teal-50 text-teal-900 ring-1 ring-inset ring-teal-200',
  closed: 'bg-stone-100 text-stone-600 ring-1 ring-inset ring-stone-200',
}

export function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  return <span className={`${PILL} ${ENQUIRY_TONES[status]}`}>{ENQUIRY_STATUS_LABELS[status]}</span>
}

export function SourceTag({ source }: { source: EnquirySource }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        source === 'for-employers'
          ? 'bg-teal-50 text-teal-800'
          : 'bg-sky-50 text-sky-800'
      }`}
    >
      {ENQUIRY_SOURCE_LABELS[source]}
    </span>
  )
}

export function GraduateMarker({ program }: { program?: string | null }) {
  return (
    <span
      title={program ? `Verified EduBridge graduate: ${program}` : 'Verified EduBridge graduate'}
      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900 ring-1 ring-inset ring-amber-300/70"
    >
      <GraduationCap className="h-3 w-3" strokeWidth={2.25} />
      EduBridge Graduate
    </span>
  )
}

// -----------------------------------------------------------------------------
// Avatars and logos
// -----------------------------------------------------------------------------

const AVATAR_SIZES = {
  sm: 'h-8 w-8 text-xs rounded-full',
  md: 'h-10 w-10 text-sm rounded-full',
  lg: 'h-12 w-12 text-base rounded-full',
  xl: 'h-20 w-20 text-2xl rounded-full',
}

export function Avatar({ id, name, size = 'md' }: { id: string; name: string; size?: keyof typeof AVATAR_SIZES }) {
  return (
    <span
      aria-hidden="true"
      className={`${AVATAR_SIZES[size]} ${toneFor(id)} flex shrink-0 items-center justify-center font-semibold tracking-tight`}
    >
      {initials(name)}
    </span>
  )
}

const LOGO_SIZES = {
  sm: 'h-10 w-10 rounded-xl text-xs',
  md: 'h-12 w-12 rounded-2xl text-sm',
}

export function CompanyLogo({ company, size = 'sm' }: { company: Company | undefined; size?: keyof typeof LOGO_SIZES }) {
  if (!company) {
    return <span aria-hidden="true" className={`${LOGO_SIZES[size]} shrink-0 bg-stone-100`} />
  }
  if (company.logoUrl) {
    return (
      <img
        src={company.logoUrl}
        alt={`${company.name} logo`}
        className={`${LOGO_SIZES[size]} shrink-0 border border-stone-200 bg-white object-contain p-1`}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={`${LOGO_SIZES[size]} ${toneFor(company.id)} flex shrink-0 items-center justify-center font-semibold tracking-tight`}
    >
      {initials(company.name)}
    </span>
  )
}

// -----------------------------------------------------------------------------
// Due dates
// -----------------------------------------------------------------------------

const DUE_TONES = {
  ok: 'text-stone-600',
  soon: 'text-amber-700',
  overdue: 'text-rose-700',
}

/** A due date in mono that turns amber within two days and red once overdue */
export function DueTag({ date, today, prefix }: { date: string; today: string; prefix?: string }) {
  const state = dueState(date, today)
  const Icon = state === 'overdue' ? TriangleAlert : Clock
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${DUE_TONES[state]}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
      <span>
        {prefix && <span className="font-sans">{prefix} </span>}
        <span className="tabular-nums">{formatDate(date)}</span>
        <span className="text-stone-400"> · </span>
        <span>{dueLabel(date, today)}</span>
      </span>
    </span>
  )
}

/** A slim bar showing time used against the seven-day first review target */
export function TargetBar({ progress, overdue }: { progress: number; overdue: boolean }) {
  const tone = overdue ? 'bg-rose-600' : progress >= 5 / 7 ? 'bg-amber-500' : 'bg-teal-600'
  return (
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-stone-200" aria-hidden="true">
      <div className={`absolute inset-y-0 left-0 rounded-full ${tone}`} style={{ width: `${Math.max(6, progress * 100)}%` }} />
    </div>
  )
}

// -----------------------------------------------------------------------------
// Empty states
// -----------------------------------------------------------------------------

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  body: string
  action?: React.ReactNode
  compact?: boolean
}

export function EmptyState({ icon: Icon, title, body, action, compact = false }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'px-4 py-8' : 'px-6 py-16'}`}>
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-100">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <p className="font-semibold text-stone-900">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-stone-500">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Dialog
// -----------------------------------------------------------------------------

interface DialogProps {
  title: string
  description?: React.ReactNode
  onClose: () => void
  children: React.ReactNode
  footer: React.ReactNode
  wide?: boolean
}

export function Dialog({ title, description, onClose, children, footer, wide = false }: DialogProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="ap-fade absolute inset-0 bg-stone-950/50 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={`ap-pop relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-stone-200 sm:rounded-2xl ${
          wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-stone-900">{title}</h2>
            {description && <div className="mt-1 text-sm text-stone-500">{description}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        <div className="flex flex-col-reverse gap-2 border-t border-stone-200 bg-stone-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          {footer}
        </div>
      </div>
    </div>
  )
}

/**
 * Intro row at the top of each admin area. The area name already sits in the
 * top bar, so the title is kept for screen readers and the description and
 * actions carry the visible content.
 */
export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="sr-only">{title}</h2>
        {description && <p className="max-w-2xl text-sm text-stone-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

/** A segmented filter of tabs with counts */
export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string; count?: number }[]
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <div role="tablist" aria-label={label} className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? 'bg-teal-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200/60 hover:text-stone-900'
            }`}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                style={MONO}
                className={`rounded px-1.5 text-xs ${
                  isActive ? 'bg-white/15 text-amber-200' : 'bg-stone-200/80 text-stone-600'
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
