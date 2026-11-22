import { useState } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import type {
  AdminJob,
  Application,
  Company,
  StaffSettableStage,
  StageEmailTemplate,
} from '@/../product/sections/admin-portal/types'
import { Dialog, StageBadge } from './Bits'
import { fillTemplate } from './format'
import { BTN_DANGER, BTN_PRIMARY, BTN_SECONDARY, HINT, INPUT, LABEL, MONO } from './styles'

interface StageDialogProps {
  application: Application
  job: AdminJob | undefined
  company: Company | undefined
  stage: StaffSettableStage
  template: StageEmailTemplate | undefined
  onCancel: () => void
  onConfirm: (note: string | null) => void
}

/** Confirms a stage move and previews the email the candidate will receive */
export function StageDialog({ application, job, company, stage, template, onCancel, onConfirm }: StageDialogProps) {
  const [note, setNote] = useState('')
  const values = {
    candidateName: application.candidate.name.split(' ')[0],
    jobTitle: job?.title ?? '',
    companyName: company?.name ?? '',
  }
  const subject = template ? fillTemplate(template.subject, values) : ''
  const body = template ? fillTemplate(template.body, values) : ''
  const isRejection = stage === 'not-selected'
  const trimmed = note.trim()

  return (
    <Dialog
      wide
      title={`Move ${application.candidate.name}?`}
      description={
        <span className="mt-1 flex flex-wrap items-center gap-2">
          <StageBadge stage={application.stage} />
          <ArrowRight className="h-4 w-4 text-stone-400" />
          <StageBadge stage={stage} />
        </span>
      }
      onClose={onCancel}
      footer={
        <>
          <button type="button" onClick={onCancel} className={BTN_SECONDARY}>
            Cancel
          </button>
          <button type="button" onClick={() => onConfirm(trimmed || null)} className={isRejection ? BTN_DANGER : BTN_PRIMARY}>
            <Mail className="h-4 w-4" />
            Move and send email
          </button>
        </>
      }
    >
      {isRejection && (
        <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-800 ring-1 ring-inset ring-rose-200">
          This ends the application. The candidate will see Not selected on their dashboard.
        </p>
      )}

      <div>
        <label htmlFor="stage-note" className={LABEL}>
          Personal note <span className="font-normal text-stone-400">(optional)</span>
        </label>
        <textarea
          id="stage-note"
          rows={3}
          className={INPUT}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            stage === 'interview'
              ? 'For example, the date, time and place of the interview'
              : isRejection
                ? 'A short, kind reason or encouragement'
                : 'Anything the candidate should know'
          }
        />
        <p className={HINT}>Added to the email and shown in the candidate's application history.</p>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-stone-900">Email preview</p>
        <div className="overflow-hidden rounded-xl border border-stone-200">
          <dl className="space-y-1 border-b border-stone-200 bg-stone-50 px-4 py-3 text-sm">
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-stone-500">To</dt>
              <dd style={MONO} className="truncate text-stone-800">
                {application.candidate.email}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-stone-500">Subject</dt>
              <dd className="font-medium text-stone-900">{subject}</dd>
            </div>
          </dl>
          <div className="bg-white px-4 py-4 text-sm leading-relaxed text-stone-700">
            <div className="mb-4 h-1 w-10 rounded-full bg-teal-700" />
            {body.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-3 whitespace-pre-line last:mb-0">
                {paragraph}
              </p>
            ))}
            {trimmed && (
              <blockquote className="my-3 border-l-2 border-amber-400 bg-amber-50/70 px-3 py-2 text-stone-800">
                <span className="block text-xs font-semibold text-amber-800">
                  Note from the hiring team
                </span>
                <span className="whitespace-pre-line">{trimmed}</span>
              </blockquote>
            )}
            <p className="mt-4 text-xs text-stone-400">Recruiture by EduBridge Academy</p>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
