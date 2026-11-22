import { useState } from 'react'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import type { FormOptions, HiringEnquiryInput } from '@/../product/sections/info-pages/types'
import { Field, FormPart, ThankYou } from './Bits'
import { BTN_PRIMARY, BTN_SECONDARY, INPUT } from './styles'

const START_OPTIONS = ['As soon as possible', 'Within a month', 'In 1 to 3 months', 'In more than 3 months', 'Not sure yet']
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Draft = Omit<HiringEnquiryInput, 'rolesToFill' | 'salaryMin' | 'salaryMax'> & { rolesToFill: string; salaryMin: string; salaryMax: string }

const EMPTY: Draft = {
  companyName: '',
  contactName: '',
  contactRole: '',
  email: '',
  phone: '',
  rolesToFill: '1',
  roleTitles: '',
  roleDescription: '',
  startBy: '',
  location: '',
  salaryMin: '',
  salaryMax: '',
  companySize: '',
  industry: '',
  heardAbout: '',
}

const digits = (value: string) => value.replace(/[^\d]/g, '')

function validate(draft: Draft) {
  const errors: Partial<Record<keyof Draft, string>> = {}
  if (!draft.companyName.trim()) errors.companyName = 'Please enter your company name.'
  if (!draft.contactName.trim()) errors.contactName = 'Please enter your name.'
  if (!draft.contactRole.trim()) errors.contactRole = 'Please enter your job title.'
  if (!EMAIL.test(draft.email.trim())) errors.email = 'Please enter a valid work email.'
  if (digits(draft.phone).length < 10) errors.phone = 'Please enter a phone number we can call.'
  const roles = Number(draft.rolesToFill)
  if (!Number.isInteger(roles) || roles < 1 || roles > 500) errors.rolesToFill = 'Enter a number from 1 to 500.'
  if (!draft.roleTitles.trim()) errors.roleTitles = 'Tell us which roles you need.'
  if (!draft.startBy) errors.startBy = 'Choose when you need people to start.'
  if (!draft.location) errors.location = 'Choose where the work is.'
  const min = draft.salaryMin ? Number(digits(draft.salaryMin)) : null
  const max = draft.salaryMax ? Number(digits(draft.salaryMax)) : null
  if (min !== null && max !== null && min > max) errors.salaryMax = 'The maximum should be more than the minimum.'
  return errors
}

interface HiringFormProps {
  formOptions: FormOptions
  replyTime: string
  onSubmit?: (input: HiringEnquiryInput) => Promise<string> | string
}

/** The For Employers hiring enquiry, in four parts, with a thank-you panel once sent */
export function HiringForm({ formOptions, replyTime, onSubmit }: HiringFormProps) {
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({})
  const [sending, setSending] = useState(false)
  const [reference, setReference] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  const set = (field: keyof Draft) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = event.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')
      first?.focus()
      return
    }
    setSending(true)
    setFailed(false)
    try {
      const input: HiringEnquiryInput = {
        ...draft,
        rolesToFill: Number(draft.rolesToFill),
        salaryMin: draft.salaryMin ? Number(digits(draft.salaryMin)) : null,
        salaryMax: draft.salaryMax ? Number(digits(draft.salaryMax)) : null,
      }
      const ref = onSubmit ? await onSubmit(input) : 'EQ-0000'
      setReference(ref)
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  if (reference) {
    return (
      <ThankYou title="Thank you. Your enquiry is with our team." reference={reference} replyTime={replyTime}>
        <button
          type="button"
          className={BTN_SECONDARY}
          onClick={() => {
            setDraft(EMPTY)
            setReference(null)
          }}
        >
          Send another enquiry
        </button>
      </ThankYou>
    )
  }

  const select = (field: keyof Draft, options: { value: string; label: string }[], placeholder: string, attrs: object) => (
    <select {...attrs} value={draft[field]} onChange={set(field)} className={INPUT}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )

  return (
    <form onSubmit={submit} noValidate className="space-y-7">
      <FormPart number={1} title="About you">
        <Field label="Company name" error={errors.companyName} className="sm:col-span-2">
          {(attrs) => <input {...attrs} value={draft.companyName} onChange={set('companyName')} autoComplete="organization" className={INPUT} />}
        </Field>
        <Field label="Your name" error={errors.contactName}>
          {(attrs) => <input {...attrs} value={draft.contactName} onChange={set('contactName')} autoComplete="name" className={INPUT} />}
        </Field>
        <Field label="Your job title" error={errors.contactRole}>
          {(attrs) => <input {...attrs} value={draft.contactRole} onChange={set('contactRole')} autoComplete="organization-title" placeholder="For example HR Manager" className={INPUT} />}
        </Field>
        <Field label="Work email" error={errors.email}>
          {(attrs) => <input {...attrs} type="email" value={draft.email} onChange={set('email')} autoComplete="email" className={INPUT} />}
        </Field>
        <Field label="Phone" error={errors.phone}>
          {(attrs) => <input {...attrs} type="tel" value={draft.phone} onChange={set('phone')} autoComplete="tel" placeholder="+234 800 000 0000" className={INPUT} />}
        </Field>
      </FormPart>

      <FormPart number={2} title="The roles">
        <Field label="How many people do you need?" error={errors.rolesToFill}>
          {(attrs) => <input {...attrs} type="number" inputMode="numeric" min={1} max={500} value={draft.rolesToFill} onChange={set('rolesToFill')} className={INPUT} />}
        </Field>
        <Field label="Role titles" error={errors.roleTitles}>
          {(attrs) => <input {...attrs} value={draft.roleTitles} onChange={set('roleTitles')} placeholder="For example Loan Officer, Data Analyst" className={INPUT} />}
        </Field>
        <Field label="A short description" optional hint="Main duties, must-have skills or anything that helps us find the right people." className="sm:col-span-2">
          {(attrs) => <textarea {...attrs} rows={4} value={draft.roleDescription} onChange={set('roleDescription')} className={`${INPUT} resize-y`} />}
        </Field>
      </FormPart>

      <FormPart number={3} title="Timing and place">
        <Field label="When should they start?" error={errors.startBy}>
          {(attrs) => select('startBy', START_OPTIONS.map((option) => ({ value: option, label: option })), 'Choose a timeframe', attrs)}
        </Field>
        <Field label="Where is the work?" error={errors.location}>
          {(attrs) => select('location', formOptions.locations, 'Choose a state or remote', attrs)}
        </Field>
      </FormPart>

      <FormPart number={4} title="Budget and extras">
        <Field label="Monthly salary from" optional hint="In naira">
          {(attrs) => (
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">₦</span>
              <input {...attrs} inputMode="numeric" value={draft.salaryMin} onChange={set('salaryMin')} placeholder="150,000" className={`${INPUT} pl-8 tabular-nums`} />
            </div>
          )}
        </Field>
        <Field label="Monthly salary to" optional error={errors.salaryMax} hint="In naira">
          {(attrs) => (
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">₦</span>
              <input {...attrs} inputMode="numeric" value={draft.salaryMax} onChange={set('salaryMax')} placeholder="250,000" className={`${INPUT} pl-8 tabular-nums`} />
            </div>
          )}
        </Field>
        <Field label="Company size" optional>
          {(attrs) => select('companySize', formOptions.companySizes, 'Choose a size', attrs)}
        </Field>
        <Field label="Industry" optional>
          {(attrs) => select('industry', formOptions.industries, 'Choose an industry', attrs)}
        </Field>
        <Field label="How did you hear about us?" optional className="sm:col-span-2">
          {(attrs) => select('heardAbout', formOptions.heardAbout, 'Choose one', attrs)}
        </Field>
      </FormPart>

      {failed && (
        <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-inset ring-rose-200">
          Your enquiry did not send. Please check your connection and try again. Nothing you typed has been lost.
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-stone-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-stone-500">{replyTime}</p>
        <button type="submit" disabled={sending} className={BTN_PRIMARY}>
          {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {sending ? 'Sending' : 'Send hiring enquiry'}
          {!sending && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </form>
  )
}
