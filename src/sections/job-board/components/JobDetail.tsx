import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Clock,
  Laptop,
  MapPin,
  TrendingUp,
  Users,
} from 'lucide-react'
import type { Job, ShareChannel } from '@/../product/sections/job-board/types'
import {
  EXPERIENCE_LABELS,
  JOB_TYPE_LABELS,
  WORK_MODE_LABELS,
  deadlineLabel,
  formatDate,
  formatLocation,
  formatSalary,
  timeAgo,
} from './format'
import { CompanyLogo, JobBadges, NewJobBadge } from './JobBits'
import { ShareMenu } from './ShareMenu'

interface JobDetailProps {
  job: Job
  isSaved?: boolean
  hasApplied?: boolean
  /** Shows a back button, used for the full-page mobile view */
  onBack?: () => void
  onApply?: () => void
  onToggleSave?: () => void
  onShare?: (channel: ShareChannel) => void
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <section>
      <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-stone-700 dark:text-stone-300">
            <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-amber-400" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function JobDetail({ job, isSaved = false, hasApplied = false, onBack, onApply, onToggleSave, onShare }: JobDetailProps) {
  const salary = formatSalary(job)
  const closing = deadlineLabel(job.deadline)

  const facts = [
    { icon: TrendingUp, label: 'Experience', value: EXPERIENCE_LABELS[job.experienceLevel] },
    { icon: Briefcase, label: 'Job type', value: JOB_TYPE_LABELS[job.jobType] },
    { icon: Laptop, label: 'Work mode', value: WORK_MODE_LABELS[job.workMode] },
    { icon: CalendarClock, label: 'Apply by', value: formatDate(job.deadline) },
  ]

  return (
    <article className="flex flex-col">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 self-start rounded-lg py-1.5 pr-3 text-sm font-medium text-stone-600 transition-colors hover:text-teal-900 dark:text-stone-400 dark:hover:text-teal-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </button>
      )}

      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
        {/* Header */}
        <header className="relative border-b border-stone-200 px-5 pb-6 pt-6 sm:px-8 sm:pt-8 dark:border-stone-800">
          <div aria-hidden="true" className="jb-weave absolute inset-x-0 top-0 h-24 opacity-60 dark:opacity-30" />
          <div className="relative flex items-start gap-4">
            <CompanyLogo company={job.company} size="lg" />
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold leading-tight tracking-tight text-stone-900 sm:text-2xl dark:text-white">
                  {job.title}
                </h2>
                <NewJobBadge job={job} />
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-stone-700 dark:text-stone-300">
                {job.company.name}
                {job.company.isVerified && (
                  <BadgeCheck className="h-4 w-4 text-teal-700 dark:text-teal-400" aria-label="Verified company" />
                )}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500 dark:text-stone-400">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {formatLocation(job)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Posted {timeAgo(job.postedAt).toLowerCase()}
                </span>
              </p>
            </div>
          </div>

          <div className="relative mt-5">
            <JobBadges job={job} />
          </div>

          {/* Salary and applicants */}
          <div className="relative mt-5 flex flex-wrap items-end justify-between gap-4 rounded-2xl bg-stone-50 px-4 py-3.5 dark:bg-stone-950/60">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Monthly salary</p>
              <p
                className={`mt-1 font-mono text-[15px] font-semibold tabular-nums sm:text-lg ${
                  salary === 'Confidential' ? 'text-stone-500 italic dark:text-stone-400' : 'text-teal-900 dark:text-teal-200'
                }`}
              >
                {salary.endsWith(' / month') ? (
                  <>
                    {salary.replace(' / month', ' ')}
                    <span className="whitespace-nowrap text-sm font-medium opacity-70">/ month</span>
                  </>
                ) : (
                  salary
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="inline-flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-400">
                <Users className="h-4 w-4" />
                {job.applicantCount === 0 ? (
                  'Be one of the first to apply'
                ) : (
                  <>
                    <span className="font-mono font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                      {job.applicantCount}
                    </span>
                    {job.applicantCount === 1 ? 'applicant' : 'applicants'}
                  </>
                )}
              </p>
              <p
                className={`mt-0.5 text-xs font-medium ${
                  closing === 'Closed' || closing === 'Closes today'
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {closing}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="relative mt-5 flex items-center gap-2.5">
            {hasApplied ? (
              <div className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-teal-50 text-sm font-semibold text-teal-900 ring-1 ring-inset ring-teal-200 dark:bg-teal-400/10 dark:text-teal-200 dark:ring-teal-400/25">
                <CheckCircle2 className="h-5 w-5" />
                Applied
              </div>
            ) : (
              <button
                type="button"
                onClick={onApply}
                disabled={closing === 'Closed'}
                className="h-11 flex-1 rounded-xl bg-teal-900 px-6 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(19,78,74,0.7)] transition-all hover:-translate-y-px hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none sm:flex-none sm:px-10 dark:bg-teal-600 dark:hover:bg-teal-500 dark:disabled:bg-stone-700"
              >
                {closing === 'Closed' ? 'Applications closed' : 'Apply now'}
              </button>
            )}
            <button
              type="button"
              onClick={onToggleSave}
              aria-pressed={isSaved}
              className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
                isSaved
                  ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-200'
                  : 'border-stone-300 text-stone-700 hover:border-teal-800 hover:text-teal-900 dark:border-stone-700 dark:text-stone-300 dark:hover:border-teal-400 dark:hover:text-teal-200'
              }`}
            >
              {isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <ShareMenu onShare={onShare} />
          </div>
        </header>

        {/* Key facts */}
        <dl className="grid grid-cols-2 border-b border-stone-200 sm:grid-cols-4 dark:border-stone-800">
          {facts.map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              className={`px-5 py-4 sm:px-6 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${
                i === 2 ? 'sm:border-l' : ''
              } border-stone-200 dark:border-stone-800`}
            >
              <dt className="flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Body */}
        <div className="space-y-8 px-5 py-7 sm:px-8">
          <section>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50">About the role</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-stone-700 dark:text-stone-300">{job.description}</p>
          </section>

          <DetailList title="Responsibilities" items={job.responsibilities} />
          <DetailList title="Requirements" items={job.requirements} />
          <DetailList title="Benefits" items={job.benefits} />

          {job.skills.length > 0 && (
            <section>
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50">Skills</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* About the company */}
          <section className="rounded-2xl border border-stone-200 p-5 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <CompanyLogo company={job.company} size="sm" />
              <div className="min-w-0">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-stone-900 dark:text-stone-50">
                  About {job.company.name}
                  {job.company.isVerified && <BadgeCheck className="h-4 w-4 text-teal-700 dark:text-teal-400" />}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {job.company.industry} · {job.company.size} · {job.company.location}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-700 dark:text-stone-300">{job.company.about}</p>
            {!job.company.isVerified && (
              <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
                This company has not been verified by EduBridge yet.
              </p>
            )}
          </section>
        </div>
      </div>
    </article>
  )
}
