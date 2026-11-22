import { useState } from 'react'
import { ArrowLeft, BriefcaseBusiness, Check, Eye, EyeOff, MailCheck, TriangleAlert } from 'lucide-react'
import type { AccountScreensProps } from '@/../product/sections/candidate-portal/types'
import { BTN_PRIMARY, CARD, FIELD_ERROR, INPUT, LABEL, LINK, PORTAL_STYLES } from './styles'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { label: 'A letter', test: (value: string) => /[A-Za-z]/.test(value) },
  { label: 'A number', test: (value: string) => /\d/.test(value) },
]

const passwordIsValid = (value: string) => PASSWORD_RULES.every((rule) => rule.test(value))

// -----------------------------------------------------------------------------
// Shared layout
// -----------------------------------------------------------------------------

function AccountLayout({
  title,
  subtitle,
  continueTo,
  errorMessage,
  children,
  footer,
}: {
  title: string
  subtitle: string
  continueTo?: AccountScreensProps['continueTo']
  errorMessage?: string | null
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="flex min-h-full items-start justify-center px-4 py-10 sm:py-16">
      <style>{PORTAL_STYLES}</style>
      <div className="cp-rise w-full max-w-md">
        {continueTo && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-teal-800 px-4 py-3 text-white shadow-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <BriefcaseBusiness className="h-4 w-4" />
            </span>
            <p className="text-sm leading-snug">
              <span className="opacity-80">You are applying for</span>{' '}
              <span className="font-semibold">
                {continueTo.title} at {continueTo.companyName}
              </span>
            </p>
          </div>
        )}

        <div className={`${CARD} p-6 sm:p-8`}>
          <div className="mb-6 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-base font-bold text-teal-950">R</span>
            <span className="text-lg font-semibold tracking-tight text-teal-900">Recruiture</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">{title}</h1>
          <p className="mt-1 text-sm text-stone-500">{subtitle}</p>

          {errorMessage && (
            <div role="alert" className="mt-5 flex items-start gap-2.5 rounded-xl bg-rose-50 px-3.5 py-3 text-sm text-rose-800 ring-1 ring-inset ring-rose-200">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-5 text-center text-sm text-stone-600">{footer}</div>}
      </div>
    </div>
  )
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  showRules = false,
  error,
  extra,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  showRules?: boolean
  error?: string
  extra?: React.ReactNode
}) {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className={LABEL}>
          {label}
        </label>
        {extra}
      </div>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className={`${INPUT} pr-11`}
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {showRules && (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {PASSWORD_RULES.map((rule) => {
            const met = rule.test(value)
            return (
              <li key={rule.label} className={`inline-flex items-center gap-1.5 text-xs ${met ? 'text-teal-700' : 'text-stone-500'}`}>
                <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${met ? 'bg-teal-600 text-white' : 'bg-stone-200'}`}>
                  {met && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                </span>
                {rule.label}
              </li>
            )
          })}
        </ul>
      )}
      {error && <p className={FIELD_ERROR}>{error}</p>}
    </div>
  )
}

const linkButton = `${LINK} text-sm`

// -----------------------------------------------------------------------------
// Sign in
// -----------------------------------------------------------------------------

export function SignInScreen({ continueTo, errorMessage, onSignIn, onGoToSignUp, onGoToForgotPassword }: AccountScreensProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Please enter the email you signed up with.'
    if (!password) next.password = 'Please enter your password.'
    setErrors(next)
    if (Object.keys(next).length === 0) onSignIn?.(email.trim(), password)
  }

  return (
    <AccountLayout
      title="Sign in"
      subtitle={continueTo ? 'Sign in to finish your application.' : 'Welcome back. Track your applications in one place.'}
      continueTo={continueTo}
      errorMessage={errorMessage}
      footer={
        <>
          New to Recruiture?{' '}
          <button type="button" onClick={onGoToSignUp} className={linkButton}>
            Create an account
          </button>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label htmlFor="signin-email" className={LABEL}>
            Email
          </label>
          <input id="signin-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={INPUT} />
          {errors.email && <p className={FIELD_ERROR}>{errors.email}</p>}
        </div>
        <PasswordField
          id="signin-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          error={errors.password}
          extra={
            <button type="button" onClick={onGoToForgotPassword} className={`${LINK} mb-1.5 text-xs`}>
              Forgot password?
            </button>
          }
        />
        <button type="submit" className={`${BTN_PRIMARY} w-full`}>
          Sign in
        </button>
      </form>
    </AccountLayout>
  )
}

// -----------------------------------------------------------------------------
// Create account
// -----------------------------------------------------------------------------

export function CreateAccountScreen({ continueTo, errorMessage, onSignUp, onGoToSignIn, onOpenTerms }: AccountScreensProps) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' })
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (form.fullName.trim().split(/\s+/).length < 2) next.fullName = 'Please enter your first and last name.'
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (form.phone.replace(/\D/g, '').length < 10) next.phone = 'Please enter a phone number we can reach you on.'
    if (!passwordIsValid(form.password)) next.password = 'Your password does not meet the rules yet.'
    if (!agreed) next.terms = 'Please agree to the terms to continue.'
    setErrors(next)
    if (Object.keys(next).length === 0) {
      onSignUp?.({ fullName: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password })
    }
  }

  return (
    <AccountLayout
      title="Create your account"
      subtitle="Apply in minutes and get an update at every stage."
      continueTo={continueTo}
      errorMessage={errorMessage}
      footer={
        <>
          Already have an account?{' '}
          <button type="button" onClick={onGoToSignIn} className={linkButton}>
            Sign in
          </button>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label htmlFor="signup-name" className={LABEL}>
            Full name
          </label>
          <input id="signup-name" autoComplete="name" value={form.fullName} onChange={(event) => update('fullName', event.target.value)} className={INPUT} />
          {errors.fullName && <p className={FIELD_ERROR}>{errors.fullName}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="signup-email" className={LABEL}>
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              className={INPUT}
            />
            {errors.email && <p className={FIELD_ERROR}>{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="signup-phone" className={LABEL}>
              Phone
            </label>
            <input
              id="signup-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+234 800 000 0000"
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              className={INPUT}
            />
            {errors.phone && <p className={FIELD_ERROR}>{errors.phone}</p>}
          </div>
        </div>
        <PasswordField
          id="signup-password"
          label="Password"
          value={form.password}
          onChange={(value) => update('password', value)}
          autoComplete="new-password"
          showRules
          error={errors.password}
        />
        <div>
          <label className="flex items-start gap-3 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => {
                setAgreed(event.target.checked)
                setErrors((current) => ({ ...current, terms: '' }))
              }}
              className="mt-0.5 h-4 w-4 rounded border-stone-300 text-teal-700 accent-teal-700 focus:ring-teal-600"
            />
            <span>
              I agree to the{' '}
              <button type="button" onClick={onOpenTerms} className={LINK}>
                terms and privacy policy
              </button>
              , and I am happy to get emails about my applications.
            </span>
          </label>
          {errors.terms && <p className={FIELD_ERROR}>{errors.terms}</p>}
        </div>
        <button type="submit" className={`${BTN_PRIMARY} w-full`}>
          {continueTo ? 'Create account and continue' : 'Create account'}
        </button>
      </form>
    </AccountLayout>
  )
}

// -----------------------------------------------------------------------------
// Forgot password
// -----------------------------------------------------------------------------

export function ForgotPasswordScreen({ onRequestPasswordReset, onGoToSignIn }: AccountScreensProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sentTo, setSentTo] = useState<string | null>(null)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    onRequestPasswordReset?.(email.trim())
    setSentTo(email.trim())
  }

  const back = (
    <button type="button" onClick={onGoToSignIn} className={`${linkButton} inline-flex items-center gap-1.5`}>
      <ArrowLeft className="h-4 w-4" />
      Back to sign in
    </button>
  )

  if (sentTo) {
    return (
      <AccountLayout title="Check your email" subtitle="If an account uses that address, a reset link is on its way." footer={back}>
        <div className="flex items-start gap-3 rounded-xl bg-teal-50 p-4 text-sm text-teal-900">
          <MailCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            We sent the link to <span className="font-semibold">{sentTo}</span>. Open it on this device to set a new password. If it does not arrive in a few
            minutes, check your spam folder.
          </p>
        </div>
        <button type="button" onClick={() => setSentTo(null)} className={`${LINK} mt-5 text-sm`}>
          Use a different email
        </button>
      </AccountLayout>
    )
  }

  return (
    <AccountLayout title="Forgot your password?" subtitle="Enter your email and we will send you a link to set a new one." footer={back}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label htmlFor="forgot-email" className={LABEL}>
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
            className={INPUT}
          />
          {error && <p className={FIELD_ERROR}>{error}</p>}
        </div>
        <button type="submit" className={`${BTN_PRIMARY} w-full`}>
          Send reset link
        </button>
      </form>
    </AccountLayout>
  )
}

// -----------------------------------------------------------------------------
// Set new password (from the email link)
// -----------------------------------------------------------------------------

export function SetNewPasswordScreen({ errorMessage, onSetNewPassword, onGoToSignIn }: AccountScreensProps) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [isDone, setIsDone] = useState(false)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (!passwordIsValid(password)) next.password = 'Your password does not meet the rules yet.'
    if (confirm !== password) next.confirm = 'The two passwords do not match.'
    setErrors(next)
    if (Object.keys(next).length === 0) {
      onSetNewPassword?.(password)
      setIsDone(true)
    }
  }

  if (isDone) {
    return (
      <AccountLayout title="Password updated" subtitle="You can now sign in with your new password.">
        <button type="button" onClick={onGoToSignIn} className={`${BTN_PRIMARY} w-full`}>
          Go to sign in
        </button>
      </AccountLayout>
    )
  }

  return (
    <AccountLayout title="Set a new password" subtitle="Choose a strong password that you do not use anywhere else." errorMessage={errorMessage}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <PasswordField id="new-password" label="New password" value={password} onChange={setPassword} autoComplete="new-password" showRules error={errors.password} />
        <PasswordField id="confirm-password" label="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" error={errors.confirm} />
        <button type="submit" className={`${BTN_PRIMARY} w-full`}>
          Save new password
        </button>
      </form>
    </AccountLayout>
  )
}
