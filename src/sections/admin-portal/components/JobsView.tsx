import { useEffect, useMemo, useRef, useState } from 'react'
import { BriefcaseBusiness, Ellipsis, Pause, Pencil, Play, Plus, Search, SearchX, Send, Users, CircleSlash } from 'lucide-react'
import type { AdminJob, Application, ClosedReason, Company, JobStatus } from '@/../product/sections/admin-portal/types'
import { CompanyLogo, Dialog, EmptyState, FilterTabs, JobStatusBadge, PageHeader } from './Bits'
import { daysUntil, formatDate, formatLocation, isActiveStage, isClosingSoon, pluralise, relativeDay } from './format'
import { BTN_DANGER, BTN_PRIMARY, BTN_SECONDARY, CARD, INPUT, MONO } from './styles'

type StatusFilter = 'all' | JobStatus

interface JobsViewProps {
  jobs: AdminJob[]
  applications: Application[]
  companiesById: Map<string, Company>
  today: string
  onNewJob: () => void
  onEditJob: (jobId: string) => void
  onViewApplicants: (jobId: string) => void
  onPublishJob: (jobId: string) => void
  onPauseJob: (jobId: string) => void
  onResumeJob: (jobId: string) => void
  onCloseJob: (jobId: string, reason: ClosedReason) => void
}

interface MenuAction {
  label: string
  icon: React.ComponentType<{ className?: string }>
  onSelect: () => void
  danger?: boolean
}

function RowMenu({ actions, label }: { actions: MenuAction[]; label: string }) {
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
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={(event) => {
          event.stopPropagation()
          setIsOpen((open) => !open)
        }}
        className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
      >
        <Ellipsis className="h-5 w-5" />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="ap-pop absolute right-0 top-full z-30 mt-1 w-52 overflow-hidden rounded-xl bg-white py-1 shadow-xl ring-1 ring-stone-200"
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              onClick={(event) => {
                event.stopPropagation()
                setIsOpen(false)
                action.onSelect()
              }}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm ${
                action.danger
                  ? 'text-rose-700 hover:bg-rose-50'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CloseJobDialog({
  job,
  activeCount,
  onCancel,
  onConfirm,
}: {
  job: AdminJob
  activeCount: number
  onCancel: () => void
  onConfirm: (reason: ClosedReason) => void
}) {
  const [reason, setReason] = useState<ClosedReason | null>(null)
  const options: { value: ClosedReason; title: string; body: string; outcome: string }[] = [
    {
      value: 'filled',
      title: 'Filled',
      body: 'The client has hired for this role.',
      outcome: 'Not selected',
    },
    {
      value: 'cancelled',
      title: 'Cancelled',
      body: 'The client is no longer hiring for this role.',
      outcome: 'Role cancelled',
    },
  ]
  const chosen = options.find((option) => option.value === reason)

  return (
    <Dialog
      title={`Close ${job.title}?`}
      description="Closed jobs leave the job board and stop taking applications. This cannot be undone."
      onClose={onCancel}
      footer={
        <>
          <button type="button" onClick={onCancel} className={BTN_SECONDARY}>
            Keep job open
          </button>
          <button type="button" disabled={!reason} onClick={() => reason && onConfirm(reason)} className={BTN_DANGER}>
            Close job
          </button>
        </>
      }
    >
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-stone-800">Why is this job closing?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isChosen = option.value === reason
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  isChosen
                    ? 'border-teal-700 bg-teal-50 ring-2 ring-teal-700/20'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="close-reason"
                  value={option.value}
                  checked={isChosen}
                  onChange={() => setReason(option.value)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold text-stone-900">{option.title}</span>
                <span className="mt-1 block text-xs text-stone-500">{option.body}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
      <div className="mt-4 rounded-xl bg-stone-100 p-4 text-sm text-stone-700">
        {activeCount === 0 ? (
          <p>This job has no active applicants, so no candidate emails will be sent.</p>
        ) : chosen ? (
          <p>
            <span style={MONO} className="font-semibold">
              {activeCount}
            </span>{' '}
            active {activeCount === 1 ? 'applicant' : 'applicants'} will be moved to <strong>{chosen.outcome}</strong> and emailed.
          </p>
        ) : (
          <p>
            <span style={MONO} className="font-semibold">
              {activeCount}
            </span>{' '}
            active {activeCount === 1 ? 'applicant is' : 'applicants are'} still in progress. Choose a reason to see what happens to them.
          </p>
        )}
      </div>
    </Dialog>
  )
}

export function JobsView({
  jobs,
  applications,
  companiesById,
  today,
  onNewJob,
  onEditJob,
  onViewApplicants,
  onPublishJob,
  onPauseJob,
  onResumeJob,
  onCloseJob,
}: JobsViewProps) {
  const [status, setStatus] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')
  const [closingJobId, setClosingJobId] = useState<string | null>(null)

  const countsByJob = useMemo(() => {
    const counts = new Map<string, { total: number; active: number }>()
    for (const app of applications) {
      const entry = counts.get(app.jobId) ?? { total: 0, active: 0 }
      entry.total += 1
      if (isActiveStage(app.stage)) entry.active += 1
      counts.set(app.jobId, entry)
    }
    return counts
  }, [applications])

  const statusCount = (value: StatusFilter) => (value === 'all' ? jobs.length : jobs.filter((job) => job.status === value).length)

  const visible = jobs
    .filter((job) => status === 'all' || job.status === status)
    .filter((job) => {
      const needle = query.trim().toLowerCase()
      if (!needle) return true
      const company = companiesById.get(job.companyId)?.name ?? ''
      return `${job.title} ${company}`.toLowerCase().includes(needle)
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  const closingJob = jobs.find((job) => job.id === closingJobId)

  const actionsFor = (job: AdminJob): MenuAction[] => {
    const actions: MenuAction[] = []
    if (job.status !== 'closed') actions.push({ label: 'Edit job', icon: Pencil, onSelect: () => onEditJob(job.id) })
    if (job.status !== 'draft') actions.push({ label: 'View applicants', icon: Users, onSelect: () => onViewApplicants(job.id) })
    if (job.status === 'draft') actions.push({ label: 'Publish', icon: Send, onSelect: () => onPublishJob(job.id) })
    if (job.status === 'published') actions.push({ label: 'Pause', icon: Pause, onSelect: () => onPauseJob(job.id) })
    if (job.status === 'paused') actions.push({ label: 'Resume', icon: Play, onSelect: () => onResumeJob(job.id) })
    if (job.status === 'published' || job.status === 'paused') {
      actions.push({ label: 'Close job', icon: CircleSlash, onSelect: () => setClosingJobId(job.id), danger: true })
    }
    return actions
  }

  const deadlineCell = (job: AdminJob) => {
    const soon = isClosingSoon(job, today)
    const past = job.status !== 'closed' && daysUntil(job.deadline, today) < 0
    return (
      <span
        style={MONO}
        className={`text-sm ${
          soon ? 'font-medium text-amber-700' : past ? 'text-rose-700' : 'text-stone-600'
        }`}
      >
        {formatDate(job.deadline, true)}
      </span>
    )
  }

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Every role EduBridge is recruiting for. Published jobs appear on the public job board."
        actions={
          <button type="button" onClick={onNewJob} className={BTN_PRIMARY}>
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New job
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs<StatusFilter>
          label="Filter jobs by status"
          value={status}
          onChange={setStatus}
          options={(['all', 'draft', 'published', 'paused', 'closed'] as StatusFilter[]).map((value) => ({
            value,
            label: value === 'all' ? 'All' : value[0].toUpperCase() + value.slice(1),
            count: statusCount(value),
          }))}
        />
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or company"
            aria-label="Search jobs"
            className={`${INPUT} pl-9`}
          />
        </div>
      </div>

      <div className={`${CARD} overflow-visible`}>
        {jobs.length === 0 ? (
          <EmptyState
            icon={BriefcaseBusiness}
            title="No jobs yet"
            body="Create the first job for a client company. It stays private as a draft until you publish it."
            action={
              <button type="button" onClick={onNewJob} className={BTN_PRIMARY}>
                <Plus className="h-4 w-4" /> New job
              </button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No jobs match"
            body="Try another status or search term."
            action={
              <button
                type="button"
                onClick={() => {
                  setStatus('all')
                  setQuery('')
                }}
                className={BTN_SECONDARY}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left md:table">
              <thead>
                <tr className="border-b border-stone-200 text-xs font-semibold text-stone-500">
                  <th className="px-5 py-3 font-semibold">Job</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Applicants</th>
                  <th className="px-3 py-3 font-semibold">Deadline</th>
                  <th className="hidden px-3 py-3 font-semibold xl:table-cell">Updated</th>
                  <th className="w-12 px-3 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {visible.map((job, index) => {
                  const company = companiesById.get(job.companyId)
                  const counts = countsByJob.get(job.id) ?? { total: 0, active: 0 }
                  return (
                    <tr
                      key={job.id}
                      style={{ animationDelay: `${index * 30}ms` }}
                      className="ap-rise group cursor-pointer transition hover:bg-stone-50"
                      onClick={() => (job.status === 'draft' ? onEditJob(job.id) : onViewApplicants(job.id))}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <CompanyLogo company={company} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-stone-900 group-hover:text-teal-800">
                              {job.title}
                            </p>
                            <p className="truncate text-xs text-stone-500">
                              {company?.name} · {formatLocation(job)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <JobStatusBadge status={job.status} closedReason={job.closedReason} />
                      </td>
                      <td className="px-3 py-3.5">
                        {job.status === 'draft' ? (
                          <span className="text-sm text-stone-400">Not live</span>
                        ) : (
                          <span className="text-sm text-stone-700">
                            <span style={MONO} className="font-medium">
                              {counts.total}
                            </span>
                            {counts.active > 0 && (
                              <span className="text-stone-500">
                                {' '}
                                · <span style={MONO}>{counts.active}</span> active
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3.5">{deadlineCell(job)}</td>
                      <td className="hidden px-3 py-3.5 text-sm text-stone-500 xl:table-cell">
                        {relativeDay(job.updatedAt, today)}
                      </td>
                      <td className="px-3 py-3.5 text-right" onClick={(event) => event.stopPropagation()}>
                        <RowMenu label={`Actions for ${job.title}`} actions={actionsFor(job)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Mobile cards */}
            <ul className="divide-y divide-stone-100 md:hidden">
              {visible.map((job) => {
                const company = companiesById.get(job.companyId)
                const counts = countsByJob.get(job.id) ?? { total: 0, active: 0 }
                return (
                  <li key={job.id} className="flex gap-3 p-4">
                    <CompanyLogo company={company} />
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => (job.status === 'draft' ? onEditJob(job.id) : onViewApplicants(job.id))}
                    >
                      <p className="font-medium text-stone-900">{job.title}</p>
                      <p className="text-xs text-stone-500">{company?.name}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <JobStatusBadge status={job.status} closedReason={job.closedReason} />
                        {job.status !== 'draft' && (
                          <span className="text-xs text-stone-500">{pluralise(counts.total, 'applicant')}</span>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-stone-500">Deadline {deadlineCell(job)}</p>
                    </button>
                    <RowMenu label={`Actions for ${job.title}`} actions={actionsFor(job)} />
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>

      {closingJob && (
        <CloseJobDialog
          job={closingJob}
          activeCount={countsByJob.get(closingJob.id)?.active ?? 0}
          onCancel={() => setClosingJobId(null)}
          onConfirm={(reason) => {
            onCloseJob(closingJob.id, reason)
            setClosingJobId(null)
          }}
        />
      )}
    </div>
  )
}
