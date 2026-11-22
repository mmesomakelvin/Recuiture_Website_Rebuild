import { useEffect } from 'react'
import { Check, Clock, BadgeCheck, TriangleAlert, X } from 'lucide-react'
import type { Application, ApplicationStage } from '@/../product/sections/candidate-portal/types'
import { PROGRESS_STEPS, STAGE_LABELS, furthestStep, initials, isEnded, nextStepText, toneFor } from './format'

// -----------------------------------------------------------------------------
// Stage pill
// -----------------------------------------------------------------------------

const STAGE_TONES: Record<ApplicationStage, string> = {
  applied: 'bg-stone-100 text-stone-700 ring-1 ring-inset ring-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:ring-stone-700',
  screening: 'bg-amber-50 text-amber-900 ring-1 ring-inset ring-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-400/25',
  interview: 'bg-teal-50 text-teal-900 ring-1 ring-inset ring-teal-200 dark:bg-teal-400/10 dark:text-teal-200 dark:ring-teal-400/25',
  offer: 'bg-teal-800 text-white dark:bg-teal-600',
  hired: 'bg-emerald-700 text-white dark:bg-emerald-600',
  'not-selected': 'bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/25',
  withdrawn: 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400',
  'role-cancelled': 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400',
}

export function StagePill({ stage }: { stage: ApplicationStage }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${STAGE_TONES[stage]}`}>
      {STAGE_LABELS[stage]}
    </span>
  )
}

// -----------------------------------------------------------------------------
// Company initials tile
// -----------------------------------------------------------------------------

export function CompanyTile({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  const sizes = { md: 'h-11 w-11 rounded-xl text-sm', lg: 'h-14 w-14 rounded-2xl text-base' }
  return (
    <span aria-hidden="true" className={`${sizes[size]} ${toneFor(name)} flex shrink-0 items-center justify-center font-semibold`}>
      {initials(name)}
    </span>
  )
}

// -----------------------------------------------------------------------------
// Five-step progress line
// -----------------------------------------------------------------------------

export function StageProgress({ application }: { application: Application }) {
  const reached = furthestStep(application)
  const ended = isEnded(application.stage)
  const done = ended ? 'bg-stone-400 dark:bg-stone-500' : 'bg-teal-600 dark:bg-teal-400'
  return (
    <div>
      <ol className="flex items-center" aria-label={`Progress: reached ${STAGE_LABELS[PROGRESS_STEPS[reached]]}`}>
        {PROGRESS_STEPS.map((step, index) => {
          const isReached = index <= reached
          const isCurrent = index === reached && !ended
          return (
            <li key={step} className={`flex items-center ${index === PROGRESS_STEPS.length - 1 ? '' : 'flex-1'}`}>
              <span
                className={`relative flex h-3 w-3 shrink-0 items-center justify-center rounded-full ${
                  isReached ? done : 'bg-stone-200 dark:bg-stone-700'
                } ${isCurrent ? 'ring-4 ring-teal-600/20 dark:ring-teal-400/20' : ''}`}
              />
              {index < PROGRESS_STEPS.length - 1 && (
                <span className={`mx-1 h-0.5 flex-1 rounded-full ${index < reached ? done : 'bg-stone-200 dark:bg-stone-700'}`} />
              )}
            </li>
          )
        })}
      </ol>
      <div className="mt-1.5 hidden justify-between text-[11px] text-stone-400 sm:flex dark:text-stone-500" aria-hidden="true">
        {PROGRESS_STEPS.map((step, index) => (
          <span key={step} className={index === reached && !ended ? 'font-semibold text-teal-800 dark:text-teal-200' : ''}>
            {STAGE_LABELS[step]}
          </span>
        ))}
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Next step sentence
// -----------------------------------------------------------------------------

export function NextStep({ application, today }: { application: Application; today: string }) {
  const { text, tone } = nextStepText(application, today)
  const styles = {
    neutral: { icon: Check, className: 'text-stone-500 dark:text-stone-400' },
    good: { icon: BadgeCheck, className: 'text-teal-800 dark:text-teal-200' },
    waiting: { icon: Clock, className: 'text-stone-700 dark:text-stone-200' },
    late: { icon: TriangleAlert, className: 'text-amber-800 dark:text-amber-300' },
  }[tone]
  const Icon = styles.icon
  return (
    <p className={`flex items-start gap-2 text-sm ${styles.className}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
      <span>{text}</span>
    </p>
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
}

export function Dialog({ title, description, onClose, children, footer }: DialogProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="cp-fade absolute inset-0 bg-stone-950/50" onClick={onClose} />
      <div className="cp-pop relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-stone-200 sm:max-w-md sm:rounded-2xl dark:bg-stone-900 dark:ring-stone-800">
        <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-5 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white">{title}</h2>
            {description && <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 sm:px-6">{children}</div>
        <div className="flex flex-col-reverse gap-2 border-t border-stone-200 bg-stone-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 dark:border-stone-800 dark:bg-stone-950/40">
          {footer}
        </div>
      </div>
    </div>
  )
}
