import { Bookmark, BookmarkCheck, CheckCircle2, MapPin } from 'lucide-react'
import type { Job } from '@/../product/sections/job-board/types'
import { JOB_TYPE_LABELS, WORK_MODE_LABELS, formatLocation, formatSalary, timeAgo } from './format'
import { CompanyLogo, JobBadges, NewJobBadge } from './JobBits'

interface JobCardProps {
  job: Job
  isSelected?: boolean
  isSaved?: boolean
  hasApplied?: boolean
  /** Position in the list, used to stagger the entrance animation */
  index?: number
  onSelect?: () => void
  onToggleSave?: () => void
}

export function JobCard({
  job,
  isSelected = false,
  isSaved = false,
  hasApplied = false,
  index = 0,
  onSelect,
  onToggleSave,
}: JobCardProps) {
  const salary = formatSalary(job)

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className={`jb-rise group relative rounded-2xl border bg-white transition-all duration-200 dark:bg-stone-900 ${
        isSelected
          ? 'border-teal-800 shadow-[0_10px_30px_-12px_rgba(19,78,74,0.45)] ring-1 ring-teal-800 dark:border-teal-500 dark:ring-teal-500'
          : 'border-stone-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-[0_12px_28px_-16px_rgba(28,25,23,0.35)] dark:border-stone-800 dark:hover:border-stone-700'
      }`}
    >
      {isSelected && (
        <span aria-hidden="true" className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-amber-400" />
      )}

      <button
        type="button"
        onClick={onSelect}
        aria-current={isSelected ? 'true' : undefined}
        className="block w-full rounded-2xl p-4 pr-14 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:p-5 sm:pr-16"
      >
        <div className="flex gap-3.5">
          <CompanyLogo company={job.company} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-semibold leading-snug text-stone-900 group-hover:text-teal-900 dark:text-stone-50 dark:group-hover:text-teal-200">
                {job.title}
              </h3>
              <NewJobBadge job={job} />
            </div>
            <p className="mt-0.5 truncate text-sm text-stone-600 dark:text-stone-400">{job.company.name}</p>
          </div>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-stone-600 dark:text-stone-400">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
            {formatLocation(job)}
          </span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-600" />
          <span>{WORK_MODE_LABELS[job.workMode]}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-600" />
          <span>{JOB_TYPE_LABELS[job.jobType]}</span>
        </div>

        <p
          className={`mt-2.5 font-mono text-[13px] font-medium tabular-nums ${
            salary === 'Confidential'
              ? 'text-stone-500 italic dark:text-stone-400'
              : 'text-teal-900 dark:text-teal-200'
          }`}
        >
          {salary}
        </p>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
          <JobBadges job={job} />
          <span className="ml-auto flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            {hasApplied && (
              <span className="inline-flex items-center gap-1 font-semibold text-teal-800 dark:text-teal-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Applied
              </span>
            )}
            {timeAgo(job.postedAt)}
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={onToggleSave}
        aria-label={isSaved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
        aria-pressed={isSaved}
        className={`absolute right-3 top-3 rounded-full p-2 transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 sm:right-4 sm:top-4 ${
          isSaved
            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-400/15 dark:text-amber-300'
            : 'text-stone-400 hover:bg-stone-100 hover:text-teal-900 dark:text-stone-500 dark:hover:bg-stone-800 dark:hover:text-teal-200'
        }`}
      >
        {isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
      </button>
    </article>
  )
}
