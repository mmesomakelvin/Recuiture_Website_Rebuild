import type { Application, ApplicationStage, Salary } from '@/../product/sections/candidate-portal/types'

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

/** The five steps shown on the progress line */
export const PROGRESS_STEPS: ApplicationStage[] = ['applied', 'screening', 'interview', 'offer', 'hired']

const ACTIVE: ApplicationStage[] = ['applied', 'screening', 'interview', 'offer']
const WITHDRAWABLE: ApplicationStage[] = ['applied', 'screening', 'interview']

export const isActive = (stage: ApplicationStage) => ACTIVE.includes(stage)
export const canWithdraw = (stage: ApplicationStage) => WITHDRAWABLE.includes(stage)
export const isEnded = (stage: ApplicationStage) => stage === 'not-selected' || stage === 'withdrawn' || stage === 'role-cancelled'

/** How far along the five steps an application got, even if it later closed */
export function furthestStep(app: Application) {
  const reached = app.history.map((entry) => PROGRESS_STEPS.indexOf(entry.stage)).filter((index) => index >= 0)
  return Math.max(0, ...reached)
}

// -----------------------------------------------------------------------------
// Dates (worked out at noon so time zones never shift the day)
// -----------------------------------------------------------------------------

const atNoon = (iso: string) => new Date(`${iso.slice(0, 10)}T12:00:00`)

export function daysBetween(fromIso: string, toIso: string) {
  return Math.round((atNoon(toIso).getTime() - atNoon(fromIso).getTime()) / 86_400_000)
}

export function formatDate(iso: string, withYear = false) {
  return atNoon(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) })
}

/** "Thu 27 Nov" */
export function formatDayDate(iso: string) {
  return atNoon(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function relativeDay(iso: string, today: string) {
  const days = daysBetween(iso, today)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return formatDate(iso)
}

// -----------------------------------------------------------------------------
// Plain-language next step for each stage
// -----------------------------------------------------------------------------

export function nextStepText(app: Application, today: string): { text: string; tone: 'neutral' | 'good' | 'waiting' | 'late' } {
  switch (app.stage) {
    case 'applied': {
      if (daysBetween(today, app.firstReviewDueDate) < 0) {
        return { text: 'Your first update is taking longer than our usual 7 days. Thank you for your patience.', tone: 'late' }
      }
      return { text: `Expect a first update by ${formatDayDate(app.firstReviewDueDate)}.`, tone: 'waiting' }
    }
    case 'screening':
      return { text: 'The hiring team is reviewing your application.', tone: 'waiting' }
    case 'interview':
      if (app.interviewCompletedAt && app.nextUpdateDueDate) {
        return { text: `Interview done. Expect your next update by ${formatDayDate(app.nextUpdateDueDate)}.`, tone: 'waiting' }
      }
      return { text: 'You are invited to interview. Check your email for the time and place.', tone: 'good' }
    case 'offer':
      return { text: 'You have an offer. Check your email and reply to the hiring team.', tone: 'good' }
    case 'hired':
      return { text: 'You got the job. Congratulations.', tone: 'good' }
    case 'not-selected':
      return { text: 'You were not selected this time. This application is closed.', tone: 'neutral' }
    case 'withdrawn':
      return { text: 'You withdrew this application.', tone: 'neutral' }
    case 'role-cancelled':
      return { text: 'The employer cancelled this role, so the application is closed.', tone: 'neutral' }
  }
}

/** Candidate-facing wording for each history entry */
export const HISTORY_TEXT: Record<ApplicationStage, string> = {
  applied: 'You applied',
  screening: 'Moved to Screening',
  interview: 'Invited to interview',
  offer: 'You received an offer',
  hired: 'You were hired',
  'not-selected': 'Not selected',
  withdrawn: 'You withdrew your application',
  'role-cancelled': 'Role cancelled by the employer',
}

// -----------------------------------------------------------------------------
// Other formatting
// -----------------------------------------------------------------------------

const naira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

export function formatSalary(salary: Salary) {
  const { min, max, isConfidential } = salary
  if (isConfidential || (min === null && max === null)) return 'Confidential'
  if (min !== null && max !== null) return `${naira(min)} to ${naira(max)} / month`
  return `${naira((min ?? max) as number)} / month`
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

const TILE_TONES = [
  'bg-teal-600 text-white dark:bg-teal-500 dark:text-teal-950',
  'bg-amber-400 text-teal-950',
  'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950',
  'bg-rose-500 text-white dark:bg-rose-400 dark:text-rose-950',
  'bg-sky-600 text-white dark:bg-sky-500 dark:text-sky-950',
  'bg-teal-900 text-amber-300 dark:bg-teal-800',
]

/** A stable colour per company name for initials tiles */
export function toneFor(key: string) {
  let hash = 0
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return TILE_TONES[hash % TILE_TONES.length]
}

export function pluralise(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

export const MAX_CV_BYTES = 5 * 1024 * 1024
const CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

/** Returns an error message, or null when the file is a PDF or Word file within 5 MB */
export function checkCvFile(file: File) {
  const byExtension = /\.(pdf|docx?)$/i.test(file.name)
  if (!CV_TYPES.includes(file.type) && !byExtension) return 'Please choose a PDF or Word file.'
  if (file.size > MAX_CV_BYTES) return `That file is ${formatFileSize(file.size)}. Please choose one that is 5 MB or smaller.`
  return null
}
