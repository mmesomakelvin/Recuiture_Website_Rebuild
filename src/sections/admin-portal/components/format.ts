import type {
  AdminJob,
  Application,
  ApplicationStage,
  EnquirySource,
  EnquiryStatus,
  ExperienceLevel,
  JobStatus,
  JobType,
  Salary,
  StaffSettableStage,
  WorkMode,
} from '@/../product/sections/admin-portal/types'

// -----------------------------------------------------------------------------
// Labels
// -----------------------------------------------------------------------------

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  'not-selected': 'Not selected',
  withdrawn: 'Withdrawn',
  'role-cancelled': 'Role cancelled',
}

/** Stages staff can move an applicant to, in pipeline order */
export const STAFF_STAGES: StaffSettableStage[] = ['screening', 'interview', 'offer', 'hired', 'not-selected']

/** The usual next step for each open stage */
export const NEXT_STAGE: Partial<Record<ApplicationStage, StaffSettableStage>> = {
  applied: 'screening',
  screening: 'interview',
  interview: 'offer',
  offer: 'hired',
}

export const ACTIVE_STAGES: ApplicationStage[] = ['applied', 'screening', 'interview', 'offer']

export function isActiveStage(stage: ApplicationStage) {
  return ACTIVE_STAGES.includes(stage)
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  paused: 'Paused',
  closed: 'Closed',
}

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: 'New',
  'in-progress': 'In progress',
  closed: 'Closed',
}

export const ENQUIRY_SOURCE_LABELS: Record<EnquirySource, string> = {
  contact: 'Contact',
  'for-employers': 'For Employers',
}

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

// -----------------------------------------------------------------------------
// Dates (all calendar maths uses whole days at local noon to avoid DST edges)
// -----------------------------------------------------------------------------

const DAY = 24 * 60 * 60 * 1000

function atNoon(iso: string) {
  return new Date(`${iso.slice(0, 10)}T12:00:00`)
}

/** Whole calendar days from one date to another; negative when `to` is earlier */
export function daysBetween(fromIso: string, toIso: string) {
  return Math.round((atNoon(toIso).getTime() - atNoon(fromIso).getTime()) / DAY)
}

/** Days from today until a date; negative once the date has passed */
export function daysUntil(dateIso: string, today: string) {
  return daysBetween(today, dateIso)
}

/** "22 Nov" or "22 Nov 2026" */
export function formatDate(iso: string, withYear = false) {
  return atNoon(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
  })
}

/** "Saturday 22 November 2026" */
export function formatLongDate(iso: string) {
  return atNoon(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** "21 Nov, 4:05 pm" */
export function formatDateTime(iso: string) {
  const date = new Date(iso)
  const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const time = date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${day}, ${time.toLowerCase()}`
}

/** "Today", "Yesterday", "3 days ago" or a short date */
export function relativeDay(iso: string, today: string) {
  const days = daysBetween(iso, today)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return formatDate(iso)
}

/** Adds working days (Monday to Friday) to a date and returns YYYY-MM-DD */
export function addBusinessDays(iso: string, count: number) {
  const date = atNoon(iso)
  let added = 0
  while (added < count) {
    date.setDate(date.getDate() + 1)
    const weekday = date.getDay()
    if (weekday !== 0 && weekday !== 6) added += 1
  }
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export type DueState = 'ok' | 'soon' | 'overdue'

/** Amber within two days of the target, red once it has passed */
export function dueState(dueIso: string, today: string): DueState {
  const days = daysUntil(dueIso, today)
  if (days < 0) return 'overdue'
  if (days <= 2) return 'soon'
  return 'ok'
}

/** "Due in 5 days", "Due today", "Due tomorrow" or "3 days overdue" */
export function dueLabel(dueIso: string, today: string) {
  const days = daysUntil(dueIso, today)
  if (days < 0) return days === -1 ? '1 day overdue' : `${-days} days overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days} days`
}

// -----------------------------------------------------------------------------
// Recruitment rules
// -----------------------------------------------------------------------------

export function awaitsFirstReview(application: Application) {
  return application.stage === 'applied'
}

export function isFirstReviewOverdue(application: Application, today: string) {
  return awaitsFirstReview(application) && daysUntil(application.firstReviewDueDate, today) < 0
}

/** An interview is done and the confirmed next-update date is today, past, or not yet set */
export function needsInterviewUpdate(application: Application, today: string) {
  if (application.stage !== 'interview' || application.interviewCompletedAt === null) return false
  if (application.nextUpdateDueDate === null) return true
  return daysUntil(application.nextUpdateDueDate, today) <= 0
}

export function isClosingSoon(job: AdminJob, today: string) {
  if (job.status !== 'published') return false
  const days = daysUntil(job.deadline, today)
  return days >= 0 && days <= 7
}

/** Days elapsed against the seven-day first review target, clamped to 0..1 for a progress bar */
export function firstReviewProgress(application: Application, today: string) {
  const elapsed = daysBetween(application.submittedAt, today)
  return Math.min(1, Math.max(0, elapsed / 7))
}

// -----------------------------------------------------------------------------
// Money, places and names
// -----------------------------------------------------------------------------

const nairaNumber = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 })

export function formatNaira(amount: number) {
  return `₦${nairaNumber.format(amount)}`
}

export function formatSalary(salary: Salary) {
  const { min, max, isConfidential } = salary
  if (isConfidential || (min === null && max === null)) return 'Confidential'
  if (min !== null && max !== null) return `${formatNaira(min)} to ${formatNaira(max)}`
  return formatNaira((min ?? max) as number)
}

export function formatLocation(job: Pick<AdminJob, 'location' | 'workMode'>) {
  if (job.workMode === 'remote' || job.location.state.includes('Remote')) return 'Remote'
  return `${job.location.city}, ${job.location.state}`
}

export function initials(name: string) {
  return name
    .replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}

const LOGO_TONES = [
  'bg-teal-600 text-white',
  'bg-amber-400 text-teal-950',
  'bg-emerald-600 text-white',
  'bg-rose-500 text-white',
  'bg-sky-600 text-white',
  'bg-teal-900 text-amber-300',
]

/** A stable colour pairing per id for initials avatars and logos */
export function toneFor(id: string) {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return LOGO_TONES[hash % LOGO_TONES.length]
}

/** Replaces {placeholders} in an email template */
export function fillTemplate(text: string, values: Record<string, string>) {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}

export function pluralise(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}
