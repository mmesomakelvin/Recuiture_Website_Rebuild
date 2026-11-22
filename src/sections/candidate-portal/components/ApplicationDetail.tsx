import { useState } from 'react'
import { ArrowLeft, Building2, CalendarCheck, ExternalLink, FileText, Mail, MapPin, Wallet } from 'lucide-react'
import type { Application, ApplicationStage } from '@/../product/sections/candidate-portal/types'
import { CompanyTile, Dialog, NextStep, StagePill, StageProgress } from './Bits'
import { HISTORY_TEXT, canWithdraw, formatDate, formatSalary, formatTime } from './format'
import { BTN_DANGER, BTN_SECONDARY, BTN_SOFT, CARD, HINT, INPUT, LABEL, LINK } from './styles'

interface ApplicationDetailProps {
  application: Application
  today: string
  onBack: () => void
  onViewJob?: (jobSlug: string) => void
  onOpenSubmittedCv?: (applicationId: string) => void
  onWithdraw: (reason: string) => void
}

const DOT_TONES: Partial<Record<ApplicationStage, string>> = {
  applied: 'bg-stone-400',
  screening: 'bg-amber-500',
  interview: 'bg-teal-600 dark:bg-teal-400',
  offer: 'bg-teal-800 dark:bg-teal-300',
  hired: 'bg-emerald-600',
  'not-selected': 'bg-rose-500',
}

const WHO: Record<string, string> = {
  candidate: 'By you',
  staff: 'By the EduBridge hiring team',
  system: 'Automatic update',
}

type TimelineItem =
  | { kind: 'stage'; id: string; at: string; stage: ApplicationStage; actorKind: string; note: string | null; emailSent: boolean }
  | { kind: 'interview-done'; id: string; at: string }

function Timeline({ application }: { application: Application }) {
  const items: TimelineItem[] = application.history.map((entry) => ({ kind: 'stage' as const, ...entry }))
  if (application.interviewCompletedAt) {
    items.push({ kind: 'interview-done', id: 'interview-done', at: `${application.interviewCompletedAt}T18:00:00+01:00` })
  }
  items.sort((a, b) => b.at.localeCompare(a.at))

  return (
    <ol className="relative">
      {items.map((item, index) => {
        const isLatest = index === 0
        const isLast = index === items.length - 1
        return (
          <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && <span className="absolute left-[7px] top-5 h-[calc(100%-12px)] w-0.5 bg-stone-200 dark:bg-stone-800" aria-hidden="true" />}
            <span
              className={`relative mt-1 h-4 w-4 shrink-0 rounded-full ring-4 ring-white dark:ring-stone-900 ${
                item.kind === 'stage' ? DOT_TONES[item.stage] ?? 'bg-stone-300 dark:bg-stone-600' : 'bg-teal-600 dark:bg-teal-400'
              } ${isLatest ? 'outline outline-2 outline-offset-2 outline-teal-600/30 dark:outline-teal-400/30' : ''}`}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={`text-sm font-semibold ${isLatest ? 'text-stone-900 dark:text-white' : 'text-stone-700 dark:text-stone-200'}`}>
                  {item.kind === 'stage' ? HISTORY_TEXT[item.stage] : 'Interview completed'}
                </p>
                <p className="text-xs tabular-nums text-stone-500 dark:text-stone-400">
                  {formatDate(item.at, true)}
                  {item.kind === 'stage' && <span className="text-stone-400 dark:text-stone-500">, {formatTime(item.at)}</span>}
                </p>
              </div>
              {item.kind === 'stage' ? (
                <>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
                    <span>{WHO[item.actorKind]}</span>
                    {item.emailSent && (
                      <span className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-300">
                        <Mail className="h-3.5 w-3.5" />
                        We emailed you
                      </span>
                    )}
                  </p>
                  {item.note && (
                    <blockquote className="mt-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-sm leading-relaxed text-stone-700 ring-1 ring-inset ring-amber-200/70 dark:bg-amber-400/10 dark:text-stone-200 dark:ring-amber-400/20">
                      <span className="mb-0.5 block text-xs font-semibold text-amber-800 dark:text-amber-300">Note from the hiring team</span>
                      {item.note}
                    </blockquote>
                  )}
                </>
              ) : (
                <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">Recorded by the EduBridge hiring team</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function WithdrawDialog({ jobTitle, onCancel, onConfirm }: { jobTitle: string; onCancel: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState('')
  return (
    <Dialog
      title="Withdraw this application?"
      description={
        <>
          The hiring team for <span className="font-medium text-stone-700 dark:text-stone-200">{jobTitle}</span> will stop considering you. You cannot
          undo this.
        </>
      }
      onClose={onCancel}
      footer={
        <>
          <button type="button" onClick={onCancel} className={BTN_SECONDARY}>
            Keep application
          </button>
          <button type="button" onClick={() => onConfirm(reason.trim())} className={BTN_DANGER}>
            Withdraw application
          </button>
        </>
      }
    >
      <label htmlFor="withdraw-reason" className={LABEL}>
        Reason <span className="font-normal text-stone-400">(optional)</span>
      </label>
      <textarea
        id="withdraw-reason"
        rows={3}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="For example, I accepted another offer"
        className={INPUT}
      />
      <p className={HINT}>Only the EduBridge hiring team sees this.</p>
    </Dialog>
  )
}

export function ApplicationDetail({ application, today, onBack, onViewJob, onOpenSubmittedCv, onWithdraw }: ApplicationDetailProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const { job, submission } = application

  return (
    <div className="cp-rise space-y-6">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        All applications
      </button>

      {/* Header */}
      <section className={`${CARD} p-5 sm:p-6`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <CompanyTile name={job.companyName} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl dark:text-white">{job.title}</h2>
              <StagePill stage={application.stage} />
            </div>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {job.companyName} · Applied {formatDate(application.submittedAt, true)} · Ref <span className="tabular-nums">{application.reference}</span>
            </p>
          </div>
          {canWithdraw(application.stage) && (
            <button
              type="button"
              onClick={() => setIsWithdrawing(true)}
              className="self-start rounded-xl px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              Withdraw
            </button>
          )}
        </div>
        <div className="mt-6">
          <StageProgress application={application} />
        </div>
        <div className="mt-5 rounded-xl bg-stone-50 px-4 py-3 dark:bg-stone-800/60">
          <NextStep application={application} today={today} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Timeline */}
        <section className={`${CARD} min-w-0 p-5 sm:p-6 lg:col-span-7 lg:self-start`}>
          <h3 className="text-base font-semibold text-stone-900 dark:text-white">History</h3>
          <p className="mb-5 text-sm text-stone-500 dark:text-stone-400">Every change to this application, newest first.</p>
          <Timeline application={application} />
        </section>

        <div className="min-w-0 space-y-6 lg:col-span-5">
          {/* What you sent */}
          <section className={`${CARD} p-5 sm:p-6`}>
            <h3 className="text-base font-semibold text-stone-900 dark:text-white">What you sent</h3>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-stone-200 p-3 dark:border-stone-700">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-stone-900 dark:text-white">{submission.cvFileName}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">CV sent with this application</p>
              </div>
              <button type="button" onClick={() => onOpenSubmittedCv?.(application.id)} className={BTN_SOFT}>
                Open
              </button>
            </div>

            <h4 className="mt-5 text-sm font-semibold text-stone-900 dark:text-white">Cover letter</h4>
            {submission.coverLetter ? (
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-stone-600 dark:text-stone-300">{submission.coverLetter}</p>
            ) : (
              <p className="mt-1.5 text-sm text-stone-400 dark:text-stone-500">No cover letter</p>
            )}

            {submission.answers.length > 0 && (
              <>
                <h4 className="mt-5 text-sm font-semibold text-stone-900 dark:text-white">Your answers</h4>
                <dl className="mt-2 space-y-3">
                  {submission.answers.map((answer) => (
                    <div key={answer.question} className="rounded-xl bg-stone-50 px-3.5 py-3 dark:bg-stone-800/60">
                      <dt className="text-xs text-stone-500 dark:text-stone-400">{answer.question}</dt>
                      <dd className="mt-0.5 break-words text-sm font-medium text-stone-900 dark:text-white">{answer.answer}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </section>

          {/* Job summary */}
          <section className={`${CARD} p-5 sm:p-6`}>
            <h3 className="text-base font-semibold text-stone-900 dark:text-white">About the job</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-600 dark:text-stone-300">
              <li className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 text-stone-400" />
                {job.companyName}
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-stone-400" />
                {job.workMode === 'remote' ? 'Remote' : `${job.city}, ${job.state}`}
              </li>
              <li className="flex items-center gap-2.5">
                <Wallet className="h-4 w-4 text-stone-400" />
                {formatSalary(job.salary)}
              </li>
              {job.isManagedByEduBridge && (
                <li className="flex items-center gap-2.5">
                  <CalendarCheck className="h-4 w-4 text-stone-400" />
                  Hiring through EduBridge
                </li>
              )}
            </ul>
            <button type="button" onClick={() => onViewJob?.(job.slug)} className={`${LINK} mt-4 inline-flex items-center gap-1.5 text-sm`}>
              View job on the board
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </section>
        </div>
      </div>

      {isWithdrawing && (
        <WithdrawDialog
          jobTitle={job.title}
          onCancel={() => setIsWithdrawing(false)}
          onConfirm={(reason) => {
            setIsWithdrawing(false)
            onWithdraw(reason)
          }}
        />
      )}
    </div>
  )
}
