import { useState } from 'react'
import { ArrowRight, BriefcaseBusiness, CalendarCheck, Clock, MapPin, Search, Sparkles } from 'lucide-react'
import type { Application, ApplicationFilter } from '@/../product/sections/candidate-portal/types'
import { CompanyTile, NextStep, StagePill, StageProgress } from './Bits'
import { formatDate, isActive, relativeDay } from './format'
import { BTN_PRIMARY, CARD } from './styles'

interface ApplicationsTrackerProps {
  applications: Application[]
  today: string
  onOpen: (applicationId: string) => void
  onBrowseJobs?: () => void
}

function StatTile({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  detail: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  tone: 'teal' | 'amber' | 'emerald'
}) {
  const tones = {
    teal: 'bg-teal-800 text-white dark:bg-teal-700',
    amber: 'bg-amber-400 text-teal-950',
    emerald: 'bg-emerald-700 text-white',
  }
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 shadow-sm sm:p-5 ${tones[tone]}`}>
      <span className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" aria-hidden="true" />
      <div className="relative flex items-center gap-3 sm:gap-4">
        <span
          className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:flex sm:h-14 sm:w-14 sm:rounded-2xl ${
            tone === 'amber' ? 'bg-teal-950/10' : 'bg-white/15'
          }`}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1 sm:text-right">
          <p className="truncate text-xs font-medium opacity-90 sm:text-sm">{label}</p>
          <p className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">{value}</p>
        </div>
      </div>
      <p className="relative mt-3 hidden truncate text-xs opacity-90 sm:block">{detail}</p>
    </div>
  )
}

function ApplicationCard({ application, today, onOpen, index }: { application: Application; today: string; onOpen: () => void; index: number }) {
  const { job } = application
  return (
    <li style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }} className="cp-rise">
      <button
        type="button"
        onClick={onOpen}
        className={`${CARD} group block w-full p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg sm:p-5`}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <CompanyTile name={job.companyName} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
              <div className="min-w-0">
                <h3 className="text-base font-semibold leading-snug text-stone-900 dark:text-white">{job.title}</h3>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-stone-500 dark:text-stone-400">
                  <span>{job.companyName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.workMode === 'remote' ? 'Remote' : `${job.city}, ${job.state}`}
                  </span>
                </p>
              </div>
              <StagePill stage={application.stage} />
            </div>

            <div className="mt-4">
              <StageProgress application={application} />
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-stone-100 pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
              <NextStep application={application} today={today} />
              <span className="flex shrink-0 items-center gap-3 text-xs text-stone-400 dark:text-stone-500">
                <span className="tabular-nums">Updated {relativeDay(application.updatedAt, today).toLowerCase()}</span>
                <ArrowRight className="h-4 w-4 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-teal-700 dark:text-stone-600 dark:group-hover:text-teal-300" />
              </span>
            </div>
          </div>
        </div>
      </button>
    </li>
  )
}

export function ApplicationsTracker({ applications, today, onOpen, onBrowseJobs }: ApplicationsTrackerProps) {
  const [filter, setFilter] = useState<ApplicationFilter>('active')

  const sorted = [...applications].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const active = sorted.filter((app) => isActive(app.stage))
  const closed = sorted.filter((app) => !isActive(app.stage))
  const shown = filter === 'active' ? active : filter === 'closed' ? closed : sorted

  const interviews = applications.filter((app) => app.stage === 'interview').length
  const offers = applications.filter((app) => app.stage === 'offer' || app.stage === 'hired').length
  const latest = sorted[0]

  if (applications.length === 0) {
    return (
      <div className={`${CARD} flex flex-col items-center px-6 py-16 text-center`}>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-teal-950">
          <BriefcaseBusiness className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-lg font-semibold text-stone-900 dark:text-white">No applications yet</h2>
        <p className="mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">
          When you apply for a job, it shows up here with every update from the hiring team.
        </p>
        <button type="button" onClick={onBrowseJobs} className={`${BTN_PRIMARY} mt-6`}>
          <Search className="h-4 w-4" />
          Browse jobs
        </button>
      </div>
    )
  }

  const tabs: { value: ApplicationFilter; label: string; count: number }[] = [
    { value: 'active', label: 'Active', count: active.length },
    { value: 'closed', label: 'Closed', count: closed.length },
    { value: 'all', label: 'All', count: sorted.length },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <StatTile
          tone="teal"
          icon={Clock}
          label="In progress"
          value={active.length}
          detail={latest ? `Last update ${formatDate(latest.updatedAt)}` : 'No updates yet'}
        />
        <StatTile tone="amber" icon={CalendarCheck} label="Interview" value={interviews} detail="Check your email for details" />
        <StatTile tone="emerald" icon={Sparkles} label="Offers" value={offers} detail={offers > 0 ? 'Well done' : 'Keep going'} />
      </div>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white">Your applications</h2>
          <div role="tablist" aria-label="Filter applications" className="flex gap-1 rounded-xl bg-white p-1 ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
            {tabs.map((tab) => {
              const isCurrent = tab.value === filter
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  onClick={() => setFilter(tab.value)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    isCurrent ? 'bg-teal-800 text-white dark:bg-teal-600' : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-1.5 text-xs font-semibold tabular-nums ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className={`${CARD} px-6 py-12 text-center text-sm text-stone-500 dark:text-stone-400`}>
            {filter === 'active' ? 'You have no active applications right now.' : 'No closed applications yet.'}
          </div>
        ) : (
          <ul className="space-y-4">
            {shown.map((application, index) => (
              <ApplicationCard key={application.id} application={application} today={today} index={index} onOpen={() => onOpen(application.id)} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
