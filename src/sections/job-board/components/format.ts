import type {
  ExperienceLevel,
  Job,
  JobSearchState,
  JobType,
  SalaryRangeOption,
  WorkMode,
} from '@/../product/sections/job-board/types'

const nairaNumber = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 })

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
}

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  'on-site': 'On-site',
  hybrid: 'Hybrid',
  remote: 'Remote',
}

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  entry: 'Entry level',
  mid: 'Mid level',
  senior: 'Senior',
}

export const EMPTY_SEARCH_STATE: JobSearchState = {
  keyword: '',
  location: '',
  locations: [],
  jobTypes: [],
  workModes: [],
  experienceLevels: [],
  salaryRange: null,
  graduateFriendlyOnly: false,
  sort: 'relevance',
}

export function formatNaira(amount: number) {
  return `₦${nairaNumber.format(amount)}`
}

/** "₦350,000 to ₦500,000 / month", or "Confidential" */
export function formatSalary(job: Job) {
  const { min, max, isConfidential } = job.salary
  if (isConfidential || (min === null && max === null)) return 'Confidential'
  if (min !== null && max !== null) return `${formatNaira(min)} to ${formatNaira(max)} / month`
  return `${formatNaira((min ?? max) as number)} / month`
}

export function formatLocation(job: Job) {
  if (job.workMode === 'remote' || job.location.state === 'Remote') return 'Remote, Nigeria'
  return job.location.city === job.location.state
    ? job.location.state
    : `${job.location.city}, ${job.location.state}`
}

const DAY = 24 * 60 * 60 * 1000

export function timeAgo(isoDate: string, now = new Date()) {
  const days = Math.floor((now.getTime() - new Date(isoDate).getTime()) / DAY)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  const months = Math.floor(days / 30)
  return months <= 1 ? '1 month ago' : `${months} months ago`
}

export function isNewJob(job: Job, now = new Date()) {
  return now.getTime() - new Date(job.postedAt).getTime() <= 3 * DAY
}

export function formatDate(isoDate: string) {
  return new Date(`${isoDate.slice(0, 10)}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** "Closes in 12 days", "Closes today" or "Closed" */
export function deadlineLabel(isoDate: string, now = new Date()) {
  const end = new Date(`${isoDate.slice(0, 10)}T23:59:59`)
  const days = Math.ceil((end.getTime() - now.getTime()) / DAY)
  if (days < 0) return 'Closed'
  if (days <= 1) return 'Closes today'
  return `Closes in ${days} days`
}

export function companyInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}

const LOGO_TONES = [
  'bg-teal-100 text-teal-900 dark:bg-teal-900/60 dark:text-teal-100',
  'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200',
  'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-100',
  'bg-teal-900 text-amber-200 dark:bg-teal-700 dark:text-amber-100',
]

/** A stable colour pairing per company for initials logos */
export function logoTone(companyId: string) {
  let hash = 0
  for (const char of companyId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return LOGO_TONES[hash % LOGO_TONES.length]
}

export function countActiveFilters(state: JobSearchState) {
  return (
    state.locations.length +
    state.jobTypes.length +
    state.workModes.length +
    state.experienceLevels.length +
    (state.salaryRange ? 1 : 0) +
    (state.graduateFriendlyOnly ? 1 : 0)
  )
}

function matchesText(job: Job, keyword: string) {
  const needle = keyword.trim().toLowerCase()
  if (!needle) return true
  return [job.title, job.company.name, job.company.industry, ...job.skills]
    .join(' ')
    .toLowerCase()
    .includes(needle)
}

function matchesLocationText(job: Job, location: string) {
  const needle = location.trim().toLowerCase()
  if (!needle) return true
  return `${job.location.city} ${job.location.state} ${job.workMode}`.toLowerCase().includes(needle)
}

function matchesSalary(job: Job, range: SalaryRangeOption | undefined) {
  if (!range) return true
  const { min, max, isConfidential } = job.salary
  if (isConfidential || (min === null && max === null)) return false
  const low = min ?? max ?? 0
  const high = max ?? min ?? 0
  return high >= range.min && (range.max === null || low <= range.max)
}

/** Applies the board's search, filters and sort to a list of jobs */
export function applySearch(jobs: Job[], state: JobSearchState, salaryRanges: SalaryRangeOption[]) {
  const range = salaryRanges.find((option) => option.value === state.salaryRange)

  const filtered = jobs.filter((job) => {
    const isRemote = job.workMode === 'remote' || job.location.state === 'Remote'
    return (
      matchesText(job, state.keyword) &&
      matchesLocationText(job, state.location) &&
      (state.locations.length === 0 ||
        state.locations.some((place) => (place === 'Remote' ? isRemote : job.location.state === place))) &&
      (state.jobTypes.length === 0 || state.jobTypes.includes(job.jobType)) &&
      (state.workModes.length === 0 || state.workModes.includes(job.workMode)) &&
      (state.experienceLevels.length === 0 || state.experienceLevels.includes(job.experienceLevel)) &&
      matchesSalary(job, range) &&
      (!state.graduateFriendlyOnly || job.isGraduateFriendly)
    )
  })

  if (state.sort === 'newest') {
    return [...filtered].sort((a, b) => b.postedAt.localeCompare(a.postedAt))
  }
  if (state.sort === 'salary-high') {
    const top = (job: Job) => (job.salary.isConfidential ? -1 : (job.salary.max ?? job.salary.min ?? -1))
    return [...filtered].sort((a, b) => top(b) - top(a))
  }
  if (state.keyword.trim()) {
    const needle = state.keyword.trim().toLowerCase()
    return [...filtered].sort(
      (a, b) =>
        Number(b.title.toLowerCase().includes(needle)) - Number(a.title.toLowerCase().includes(needle)),
    )
  }
  return filtered
}
