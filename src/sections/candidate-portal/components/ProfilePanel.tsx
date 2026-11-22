import { useRef, useState } from 'react'
import { CircleCheck, FileText, KeyRound, Lock, Upload } from 'lucide-react'
import type { Candidate, Option, ProfileInput } from '@/../product/sections/candidate-portal/types'
import { checkCvFile, formatDate, formatFileSize } from './format'
import { BTN_PRIMARY, BTN_SECONDARY, BTN_SOFT, CARD, FIELD_ERROR, HINT, INPUT, LABEL } from './styles'

interface ProfilePanelProps {
  candidate: Candidate
  locationOptions: Option[]
  onSave: (input: ProfileInput) => void
  onViewCv?: () => void
  onReplaceCv: (file: File) => void
  onRequestPasswordReset?: (email: string) => void
}

function DetailsCard({ candidate, locationOptions, onSave }: Pick<ProfilePanelProps, 'candidate' | 'locationOptions' | 'onSave'>) {
  const [form, setForm] = useState<ProfileInput>({
    fullName: candidate.fullName,
    phone: candidate.phone,
    location: candidate.location,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileInput, string>>>({})
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const isDirty = form.fullName !== candidate.fullName || form.phone !== candidate.phone || form.location !== candidate.location

  const update = (field: keyof ProfileInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSavedAt(null)
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (form.fullName.trim().split(/\s+/).length < 2) next.fullName = 'Please enter your first and last name.'
    if (form.phone.replace(/\D/g, '').length < 10) next.phone = 'Please enter a phone number we can reach you on.'
    if (!form.location) next.location = 'Please choose your state.'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    onSave({
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      location: form.location,
    })
    setSavedAt('now')
  }

  return (
    <form onSubmit={submit} className={`${CARD} p-5 sm:p-6`} noValidate>
      <h2 className="text-base font-semibold text-stone-900 dark:text-white">Your details</h2>
      <p className="text-sm text-stone-500 dark:text-stone-400">Employers see these when you apply.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="profile-name" className={LABEL}>
            Full name
          </label>
          <input id="profile-name" className={INPUT} value={form.fullName} onChange={(event) => update('fullName', event.target.value)} autoComplete="name" />
          {errors.fullName && <p className={FIELD_ERROR}>{errors.fullName}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="profile-email" className={LABEL}>
            Email
          </label>
          <div className="relative">
            <input id="profile-email" className={`${INPUT} pr-10`} value={candidate.email} disabled />
            <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>
          <p className={HINT}>You sign in with this email. Contact us if you need to change it.</p>
        </div>
        <div>
          <label htmlFor="profile-phone" className={LABEL}>
            Phone
          </label>
          <input
            id="profile-phone"
            type="tel"
            className={INPUT}
            value={form.phone}
            onChange={(event) => update('phone', event.target.value)}
            autoComplete="tel"
            placeholder="+234 800 000 0000"
          />
          {errors.phone && <p className={FIELD_ERROR}>{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="profile-location" className={LABEL}>
            Location
          </label>
          <select id="profile-location" className={INPUT} value={form.location} onChange={(event) => update('location', event.target.value)}>
            <option value="">Choose your state</option>
            {locationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.location && <p className={FIELD_ERROR}>{errors.location}</p>}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="submit" className={BTN_PRIMARY} disabled={!isDirty}>
          Save changes
        </button>
        {isDirty && (
          <button
            type="button"
            className={BTN_SECONDARY}
            onClick={() => {
              setForm({
                fullName: candidate.fullName,
                phone: candidate.phone,
                location: candidate.location,
              })
              setErrors({})
            }}
          >
            Cancel
          </button>
        )}
        {savedAt && !isDirty && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 dark:text-teal-300">
            <CircleCheck className="h-4 w-4" />
            Saved
          </span>
        )}
      </div>
    </form>
  )
}

function CvCard({ candidate, onViewCv, onReplaceCv }: Pick<ProfilePanelProps, 'candidate' | 'onViewCv' | 'onReplaceCv'>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const { cv } = candidate

  const pick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const problem = checkCvFile(file)
    setError(problem)
    if (!problem) onReplaceCv(file)
  }

  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <h2 className="text-base font-semibold text-stone-900 dark:text-white">Your CV</h2>
      <p className="text-sm text-stone-500 dark:text-stone-400">Used by default when you apply. Applications you already sent keep their own copy.</p>

      {cv ? (
        <div className="mt-5 rounded-xl border border-stone-200 p-4 dark:border-stone-700">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              <FileText className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-stone-900 dark:text-white">{cv.fileName}</p>
              <p className="text-xs tabular-nums text-stone-500 dark:text-stone-400">
                {formatFileSize(cv.sizeBytes)} · uploaded {formatDate(cv.uploadedAt, true)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={onViewCv} className={BTN_SOFT}>
              View
            </button>
            <button type="button" onClick={() => inputRef.current?.click()} className={BTN_SOFT}>
              <Upload className="h-4 w-4" />
              Replace
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 flex w-full flex-col items-center rounded-xl border-2 border-dashed border-stone-300 px-4 py-8 text-center transition hover:border-teal-500 hover:bg-teal-50/50 dark:border-stone-700 dark:hover:border-teal-400 dark:hover:bg-teal-400/5"
        >
          <Upload className="h-6 w-6 text-teal-700 dark:text-teal-300" />
          <span className="mt-2 text-sm font-semibold text-stone-900 dark:text-white">Upload your CV</span>
          <span className="text-xs text-stone-500 dark:text-stone-400">PDF or Word, up to 5 MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={pick}
        aria-label="Choose a CV file"
      />
      {error ? <p className={FIELD_ERROR}>{error}</p> : <p className={HINT}>PDF or Word, up to 5 MB.</p>}
    </section>
  )
}

function PasswordCard({ email, onRequestPasswordReset }: { email: string; onRequestPasswordReset?: (email: string) => void }) {
  const [isSent, setIsSent] = useState(false)
  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200">
          <KeyRound className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-stone-900 dark:text-white">Password</h2>
          {isSent ? (
            <p className="mt-0.5 text-sm text-teal-700 dark:text-teal-300">
              We sent a reset link to <span className="font-medium">{email}</span>.
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">We will email you a link to set a new password.</p>
          )}
          <button
            type="button"
            onClick={() => {
              onRequestPasswordReset?.(email)
              setIsSent(true)
            }}
            className={`${BTN_SECONDARY} mt-4`}
          >
            {isSent ? 'Send again' : 'Send reset email'}
          </button>
        </div>
      </div>
    </section>
  )
}

export function ProfilePanel({ candidate, locationOptions, onSave, onViewCv, onReplaceCv, onRequestPasswordReset }: ProfilePanelProps) {
  return (
    <div className="cp-rise grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-7">
        <DetailsCard candidate={candidate} locationOptions={locationOptions} onSave={onSave} />
      </div>
      <div className="min-w-0 space-y-6 lg:col-span-5">
        <CvCard candidate={candidate} onViewCv={onViewCv} onReplaceCv={onReplaceCv} />
        <PasswordCard email={candidate.email} onRequestPasswordReset={onRequestPasswordReset} />
      </div>
    </div>
  )
}
