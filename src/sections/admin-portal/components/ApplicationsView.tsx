import { useState } from 'react'
import { FileText, Search, SearchX, Users } from 'lucide-react'
import type { AdminJob, Application, ApplicationStage, Company } from '@/../product/sections/admin-portal/types'
import { Avatar, DueTag, EmptyState, FilterTabs, GraduateMarker, PageHeader, StageBadge } from './Bits'
import { ACTIVE_STAGES, awaitsFirstReview, needsInterviewUpdate, relativeDay } from './format'
import { BTN_SECONDARY, CARD, INPUT, MONO } from './styles'

type StageFilter = 'active' | 'all' | ApplicationStage

const STAGE_FILTERS: { value: StageFilter; label: string }[] = [
  { value: 'active', label: 'In progress' },
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'not-selected', label: 'Not selected' },
  { value: 'all', label: 'All' },
]

function matchesStage(app: Application, filter: StageFilter) {
  if (filter === 'all') return true
  if (filter === 'active') return ACTIVE_STAGES.includes(app.stage)
  return app.stage === filter
}

interface ApplicationsViewProps {
  applications: Application[]
  jobs: AdminJob[]
  companiesById: Map<string, Company>
  today: string
  /** 'all' or a job id */
  jobFilter: string
  onJobFilterChange: (jobId: string) => void
  selectedId: string | null
  onSelect: (applicationId: string) => void
}

/** What still needs doing for an application, shown in the "Next step" column */
function NextStep({ app, today }: { app: Application; today: string }) {
  if (awaitsFirstReview(app)) return <DueTag date={app.firstReviewDueDate} today={today} prefix="Review" />
  if (app.stage === 'interview') {
    if (app.interviewCompletedAt === null) return <span className="text-xs text-stone-500">Interview scheduled</span>
    if (app.nextUpdateDueDate) return <DueTag date={app.nextUpdateDueDate} today={today} prefix="Update" />
    return <span className="text-xs font-medium text-amber-700">Set next update date</span>
  }
  if (app.stage === 'screening') return <span className="text-xs text-stone-500">Decide on interview</span>
  if (app.stage === 'offer') return <span className="text-xs text-stone-500">Awaiting acceptance</span>
  return <span className="text-xs text-stone-400">None</span>
}

export function ApplicationsView({
  applications,
  jobs,
  companiesById,
  today,
  jobFilter,
  onJobFilterChange,
  selectedId,
  onSelect,
}: ApplicationsViewProps) {
  const [stage, setStage] = useState<StageFilter>('active')
  const [query, setQuery] = useState('')
  const jobsById = new Map(jobs.map((job) => [job.id, job]))
  const filteredJob = jobFilter === 'all' ? undefined : jobsById.get(jobFilter)

  const byJob = applications.filter((app) => jobFilter === 'all' || app.jobId === jobFilter)
  const visible = byJob
    .filter((app) => matchesStage(app, stage))
    .filter((app) => app.candidate.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => {
      // Items past target float to the top, then newest first
      const urgency = (app: Application) =>
        (awaitsFirstReview(app) && app.firstReviewDueDate < today) || needsInterviewUpdate(app, today) ? 0 : 1
      return urgency(a) - urgency(b) || b.submittedAt.localeCompare(a.submittedAt)
    })

  const jobsWithApplicants = jobs.filter((job) => job.status !== 'draft')
  const resetFilters = () => {
    setStage('all')
    setQuery('')
  }

  return (
    <div>
      <PageHeader
        title={filteredJob ? `Applicants for ${filteredJob.title}` : 'Applications'}
        description={
          filteredJob
            ? `${companiesById.get(filteredJob.companyId)?.name ?? ''}. Opening an application never changes its stage.`
            : 'Every application across all jobs. Opening an application never changes its stage.'
        }
      />

      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            aria-label="Filter by job"
            value={jobFilter}
            onChange={(event) => onJobFilterChange(event.target.value)}
            className={`${INPUT} sm:w-72`}
          >
            <option value="all">All jobs</option>
            {jobsWithApplicants.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({companiesById.get(job.companyId)?.name})
              </option>
            ))}
          </select>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by candidate name"
              aria-label="Search applications"
              className={`${INPUT} pl-9`}
            />
          </div>
        </div>
        <FilterTabs<StageFilter>
          label="Filter by stage"
          value={stage}
          onChange={setStage}
          options={STAGE_FILTERS.map((option) => ({ ...option, count: byJob.filter((app) => matchesStage(app, option.value)).length }))}
        />
      </div>

      <div className={`${CARD} overflow-hidden`}>
        {byJob.length === 0 ? (
          <EmptyState
            icon={Users}
            title={filteredJob ? 'No applicants yet' : 'No applications yet'}
            body={
              filteredJob
                ? 'Applications for this job will appear here as soon as candidates apply.'
                : 'Applications appear here once candidates start applying to published jobs.'
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No applications match"
            body="Try another stage or search term."
            action={
              <button type="button" onClick={resetFilters} className={BTN_SECONDARY}>
                Show all applications
              </button>
            }
          />
        ) : (
          <>
            <table className="hidden w-full text-left md:table">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold text-stone-500">
                  <th className="px-5 py-3 font-semibold">Candidate</th>
                  {!filteredJob && <th className="px-3 py-3 font-semibold">Job</th>}
                  <th className="px-3 py-3 font-semibold">Stage</th>
                  <th className="hidden px-3 py-3 font-semibold lg:table-cell">Applied</th>
                  <th className="px-3 py-3 font-semibold">Next step</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {visible.map((app, index) => {
                  const job = jobsById.get(app.jobId)
                  const isSelected = app.id === selectedId
                  return (
                    <tr
                      key={app.id}
                      onClick={() => onSelect(app.id)}
                      style={{ animationDelay: `${index * 25}ms` }}
                      className={`ap-rise group cursor-pointer transition ${
                        isSelected
                          ? 'bg-teal-50/80 shadow-[inset_3px_0_0_0] shadow-teal-700'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar id={app.candidate.id} name={app.candidate.name} size="sm" />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span className="truncate font-medium text-stone-900 group-hover:text-teal-800">
                                {app.candidate.name}
                              </span>
                              {app.candidate.isVerifiedGraduate && <GraduateMarker program={app.candidate.graduateProgram} />}
                            </div>
                            <p style={MONO} className="text-[11px] text-stone-400">
                              {app.reference}
                            </p>
                          </div>
                        </div>
                      </td>
                      {!filteredJob && (
                        <td className="max-w-56 px-3 py-3">
                          <p className="truncate text-sm text-stone-800">{job?.title}</p>
                          <p className="truncate text-xs text-stone-500">
                            {job ? companiesById.get(job.companyId)?.name : ''}
                          </p>
                        </td>
                      )}
                      <td className="px-3 py-3">
                        <StageBadge stage={app.stage} />
                      </td>
                      <td className="hidden px-3 py-3 text-sm text-stone-500 lg:table-cell">
                        {relativeDay(app.submittedAt, today)}
                      </td>
                      <td className="px-3 py-3">
                        <NextStep app={app} today={today} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <ul className="divide-y divide-stone-100 md:hidden">
              {visible.map((app) => {
                const job = jobsById.get(app.jobId)
                return (
                  <li key={app.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(app.id)}
                      className="flex w-full gap-3 p-4 text-left hover:bg-stone-50"
                    >
                      <Avatar id={app.candidate.id} name={app.candidate.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-stone-900">{app.candidate.name}</p>
                          <StageBadge stage={app.stage} />
                        </div>
                        <p className="truncate text-xs text-stone-500">
                          {job?.title} · {relativeDay(app.submittedAt, today)}
                        </p>
                        {app.candidate.isVerifiedGraduate && (
                          <div className="mt-1.5">
                            <GraduateMarker program={app.candidate.graduateProgram} />
                          </div>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <NextStep app={app} today={today} />
                          <FileText className="h-4 w-4 text-stone-300" aria-hidden="true" />
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
