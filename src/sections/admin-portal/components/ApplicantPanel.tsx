import { useEffect, useState } from 'react'
import { CalendarCheck, ChevronDown, ExternalLink, FileText, Lock, Mail, MapPin, Phone, X } from 'lucide-react'
import type {
  AdminJob,
  Application,
  Company,
  HistoryEntry,
  StaffSettableStage,
} from '@/../product/sections/admin-portal/types'
import { Avatar, DueTag, GraduateMarker, StageBadge, TargetBar } from './Bits'
import {
  NEXT_STAGE,
  STAFF_STAGES,
  STAGE_LABELS,
  addBusinessDays,
  awaitsFirstReview,
  firstReviewProgress,
  formatDate,
  formatDateTime,
  isActiveStage,
  isFirstReviewOverdue,
} from './format'
import { BTN_PRIMARY, BTN_SECONDARY, INPUT, MONO, SECTION_TITLE } from './styles'

interface ApplicantPanelProps {
  application: Application
  job: AdminJob | undefined
  company: Company | undefined
  today: string
  onClose: () => void
  onOpenCv: () => void
  onRequestMove: (stage: StaffSettableStage) => void
  onCompleteInterview: (nextUpdateDueDate: string) => void
}

const EMAIL_STATUS = {
  sent: { label: 'Email sent', className: 'text-stone-500 dark:text-stone-400' },
  queued: { label: 'Email queued', className: 'text-amber-700 dark:text-amber-300' },
  failed: { label: 'Email failed', className: 'font-semibold text-rose-700 dark:text-rose-300' },
}

function actorLabel(entry: HistoryEntry) {
  if (entry.actorKind === 'candidate') return 'by the candidate'
  if (entry.actorKind === 'system') return 'by Recruiture'
  return `by ${entry.actorName}`
}

function Timeline({ history }: { history: HistoryEntry[] }) {
  const entries = [...history].reverse()
  return (
    <ol className="relative space-y-5">
      <span className="absolute bottom-2 left-[7px] top-2 w-px bg-stone-200 dark:bg-stone-700" aria-hidden="true" />
      {entries.map((entry, index) => {
        const email = EMAIL_STATUS[entry.emailStatus]
        return (
          <li key={entry.id} className="relative pl-7">
            <span
              className={`absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2 ${
                index === 0
                  ? 'border-teal-700 bg-amber-300 dark:border-teal-400 dark:bg-amber-300'
                  : 'border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-900'
              }`}
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <StageBadge stage={entry.stage} />
              <span style={MONO} className="text-xs text-stone-500 dark:text-stone-400">
                {formatDateTime(entry.at)}
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              {actorLabel(entry)} · <span className={email.className}>{email.label}</span>
            </p>
            {entry.note && (
              <p className="mt-2 rounded-lg border-l-2 border-amber-400 bg-amber-50/60 px-3 py-2 text-sm text-stone-700 dark:bg-amber-400/5 dark:text-stone-200">
                {entry.note}
              </p>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function InterviewBlock({
  application,
  today,
  onCompleteInterview,
}: {
  application: Application
  today: string
  onCompleteInterview: (date: string) => void
}) {
  const suggested = addBusinessDays(today, 5)
  const [isEditing, setIsEditing] = useState(false)
  const [date, setDate] = useState(application.nextUpdateDueDate ?? suggested)

  const isCompleted = application.interviewCompletedAt !== null

  if (isCompleted && !isEditing) {
    return (
      <div className="rounded-xl border border-stone-200 p-4 dark:border-stone-700">
        <p className="flex items-center gap-2 text-sm font-medium text-stone-900 dark:text-white">
          <CalendarCheck className="h-4 w-4 text-teal-700 dark:text-teal-300" />
          Interview completed{' '}
          <span style={MONO} className="font-normal text-stone-500 dark:text-stone-400">
            {formatDate(application.interviewCompletedAt as string)}
          </span>
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          {application.nextUpdateDueDate ? (
            <DueTag date={application.nextUpdateDueDate} today={today} prefix="Next update" />
          ) : (
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">No next update date set</span>
          )}
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs font-semibold text-teal-800 hover:underline dark:text-teal-300"
          >
            {application.nextUpdateDueDate ? 'Change date' : 'Set date'}
          </button>
        </div>
      </div>
    )
  }

  if (!isCompleted && !isEditing) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-stone-300 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-stone-700">
        <p className="text-sm text-stone-600 dark:text-stone-300">Interview scheduled. Mark it completed once it has happened.</p>
        <button type="button" onClick={() => setIsEditing(true)} className={`${BTN_SECONDARY} shrink-0`}>
          <CalendarCheck className="h-4 w-4" />
          Mark interview completed
        </button>
      </div>
    )
  }

  return (
    <div className="ap-rise rounded-xl border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-800 dark:bg-teal-950/30">
      <label htmlFor="next-update" className="block text-sm font-medium text-stone-900 dark:text-white">
        When will the candidate hear next?
      </label>
      <p className="mt-0.5 text-xs text-stone-600 dark:text-stone-400">
        Suggested: five business days from today,{' '}
        <span style={MONO} className="font-medium">
          {formatDate(suggested)}
        </span>
        . The candidate sees this date on their dashboard.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id="next-update"
          type="date"
          min={today}
          style={MONO}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`${INPUT} sm:w-44`}
        />
        <button type="button" disabled={!date} onClick={() => onCompleteInterview(date)} className={BTN_PRIMARY}>
          Confirm date
        </button>
        <button type="button" onClick={() => setIsEditing(false)} className={BTN_SECONDARY}>
          Cancel
        </button>
      </div>
    </div>
  )
}

function StageControls({
  application,
  onRequestMove,
}: {
  application: Application
  onRequestMove: (stage: StaffSettableStage) => void
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  if (!isActiveStage(application.stage)) {
    const closedText =
      application.stage === 'withdrawn'
        ? 'The candidate withdrew this application.'
        : application.stage === 'role-cancelled'
          ? 'The role was cancelled, so this application was closed.'
          : application.stage === 'hired'
            ? 'This candidate was hired.'
            : 'This application has ended.'
    return (
      <p className="flex items-center gap-2 rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-600 dark:bg-stone-800 dark:text-stone-300">
        <Lock className="h-4 w-4 shrink-0" />
        {closedText} No further stage changes.
      </p>
    )
  }

  const next = NEXT_STAGE[application.stage]
  const others = STAFF_STAGES.filter((stage) => stage !== next && stage !== 'not-selected' && stage !== application.stage)

  return (
    <div className="flex flex-wrap gap-2">
      {next && (
        <button type="button" onClick={() => onRequestMove(next)} className={BTN_PRIMARY}>
          Move to {STAGE_LABELS[next]}
        </button>
      )}
      <button
        type="button"
        onClick={() => onRequestMove('not-selected')}
        className={`${BTN_SECONDARY} text-rose-700 hover:border-rose-300 hover:bg-rose-50 dark:text-rose-300 dark:hover:border-rose-500/40 dark:hover:bg-rose-500/10`}
      >
        Not selected
      </button>
      {others.length > 0 && (
        <div className="relative">
          <button type="button" onClick={() => setIsMoreOpen((open) => !open)} aria-expanded={isMoreOpen} className={BTN_SECONDARY}>
            Other stage
            <ChevronDown className="h-4 w-4" />
          </button>
          {isMoreOpen && (
            <div className="ap-pop absolute left-0 top-full z-10 mt-1 w-44 overflow-hidden rounded-xl bg-white py-1 shadow-xl ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-700">
              {others.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => {
                    setIsMoreOpen(false)
                    onRequestMove(stage)
                  }}
                  className="block w-full px-3.5 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-800"
                >
                  {STAGE_LABELS[stage]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ApplicantPanel({
  application,
  job,
  company,
  today,
  onClose,
  onOpenCv,
  onRequestMove,
  onCompleteInterview,
}: ApplicantPanelProps) {
  const { candidate } = application

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex justify-end lg:pointer-events-none lg:top-20">
      <div className="ap-fade absolute inset-0 bg-stone-950/40 lg:hidden" onClick={onClose} />
      <aside
        key={application.id}
        aria-label={`Application from ${candidate.name}`}
        className="ap-panel pointer-events-auto relative flex h-full w-full flex-col bg-white shadow-2xl ring-1 ring-stone-200 sm:max-w-xl dark:bg-stone-900 dark:ring-stone-800"
      >
        {/* Header */}
        <div className="border-b border-stone-200 px-5 pb-4 pt-5 sm:px-6 dark:border-stone-800">
          <div className="flex items-start gap-3">
            <Avatar id={candidate.id} name={candidate.name} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-stone-900 dark:text-white">{candidate.name}</h2>
                {candidate.isVerifiedGraduate && <GraduateMarker program={candidate.graduateProgram} />}
              </div>
              <p className="truncate text-sm text-stone-500 dark:text-stone-400">
                {job?.title} at {company?.name}
              </p>
              <p style={MONO} className="mt-0.5 text-[11px] text-stone-400">
                {application.reference} · applied {formatDate(application.submittedAt, true)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close application"
              className="-mr-2 rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5 sm:px-6">
          {/* Stage */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className={SECTION_TITLE}>Stage</h3>
              <StageBadge stage={application.stage} />
            </div>
            {awaitsFirstReview(application) && (
              <div className="mb-4 rounded-xl bg-stone-50 p-3 dark:bg-stone-800/60">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-stone-600 dark:text-stone-300">7-day first review target</span>
                  <DueTag date={application.firstReviewDueDate} today={today} />
                </div>
                <TargetBar progress={firstReviewProgress(application, today)} overdue={isFirstReviewOverdue(application, today)} />
              </div>
            )}
            <StageControls key={`${application.id}-${application.stage}`} application={application} onRequestMove={onRequestMove} />
            {application.stage === 'interview' && (
              <div className="mt-4">
                {/* Keyed so the editor resets when the applicant or confirmed date changes */}
                <InterviewBlock
                  key={`${application.id}-${application.nextUpdateDueDate ?? 'none'}`}
                  application={application}
                  today={today}
                  onCompleteInterview={onCompleteInterview}
                />
              </div>
            )}
          </section>

          {/* Contact */}
          <section>
            <h3 className={`${SECTION_TITLE} mb-3`}>Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-stone-400" />
                <a href={`mailto:${candidate.email}`} className="truncate text-teal-800 hover:underline dark:text-teal-300">
                  {candidate.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-stone-400" />
                <a href={`tel:${candidate.phone.replace(/\s/g, '')}`} style={MONO} className="text-stone-700 hover:underline dark:text-stone-200">
                  {candidate.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-stone-700 dark:text-stone-200">
                <MapPin className="h-4 w-4 shrink-0 text-stone-400" />
                {candidate.location}
              </li>
            </ul>
          </section>

          {/* CV */}
          <section>
            <h3 className={`${SECTION_TITLE} mb-3`}>CV</h3>
            <button
              type="button"
              onClick={onOpenCv}
              className="group flex w-full items-center gap-3 rounded-xl border border-stone-200 p-3 text-left transition hover:border-teal-300 hover:bg-teal-50/40 dark:border-stone-700 dark:hover:border-teal-700 dark:hover:bg-teal-400/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                <FileText className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-stone-900 dark:text-white">{application.cv.fileName}</span>
                <span style={MONO} className="text-xs text-stone-500 dark:text-stone-400">
                  {application.cv.fileSizeKb} KB
                </span>
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-800 group-hover:underline dark:text-teal-300">
                Open
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </button>
          </section>

          {/* Cover letter */}
          <section>
            <h3 className={`${SECTION_TITLE} mb-3`}>Cover letter</h3>
            {application.coverLetter ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-stone-700 dark:text-stone-200">{application.coverLetter}</p>
            ) : (
              <p className="text-sm italic text-stone-400">No cover letter included.</p>
            )}
          </section>

          {/* Screening answers */}
          {application.answers.length > 0 && (
            <section>
              <h3 className={`${SECTION_TITLE} mb-3`}>Screening answers</h3>
              <dl className="divide-y divide-stone-100 rounded-xl border border-stone-200 dark:divide-stone-800 dark:border-stone-700">
                {application.answers.map((answer) => (
                  <div key={answer.questionId} className="px-4 py-3">
                    <dt className="text-xs text-stone-500 dark:text-stone-400">{answer.question}</dt>
                    <dd className="mt-0.5 break-words text-sm font-medium text-stone-900 dark:text-white">{answer.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* History */}
          <section>
            <h3 className={`${SECTION_TITLE} mb-4`}>History</h3>
            <Timeline history={application.history} />
          </section>
        </div>
      </aside>
    </div>
  )
}
