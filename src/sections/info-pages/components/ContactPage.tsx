import { useState } from 'react'
import { ArrowRight, Clock, LoaderCircle, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import type { ContactDetails, ContactMessageInput, ContactTopic, FormOptions } from '@/../product/sections/info-pages/types'
import { Field, PlaceholderNote, ThankYou } from './Bits'
import { BTN_PRIMARY, BTN_SECONDARY, CARD, INPUT } from './styles'

const MAX_MESSAGE = 1000
const MIN_MESSAGE = 20
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Draft = Omit<ContactMessageInput, 'topic'> & { topic: ContactTopic | '' }
const EMPTY: Draft = { name: '', email: '', phone: '', topic: '', message: '' }

interface ContactPageProps {
  contactDetails: ContactDetails
  formOptions: FormOptions
  onSubmit?: (input: ContactMessageInput) => Promise<string> | string
  onOpenWhatsApp?: (number: string) => void
}

/** A simple drawn map tile with a pin, so no third-party map loads on the page */
function MapTile({ details }: { details: ContactDetails }) {
  return (
    <a
      href={details.mapUrl}
      target="_blank"
      rel="noreferrer"
      className="group relative block h-44 overflow-hidden rounded-2xl bg-teal-50 ring-1 ring-inset ring-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
      aria-label={`Open the office location in ${details.city} in a maps app`}
    >
      <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g stroke="#ffffff" strokeWidth="10" fill="none" strokeLinecap="round">
          <path d="M-10 120 C80 100 140 140 220 110 S340 60 420 80" />
          <path d="M60 -10 L120 200" />
          <path d="M260 -10 C250 60 300 120 280 200" />
        </g>
        <g stroke="#ccfbf1" strokeWidth="4" fill="none">
          <path d="M-10 40 L420 30" />
          <path d="M-10 160 L420 170" />
          <path d="M180 -10 L170 200" />
        </g>
        <path d="M300 10 C340 20 380 10 420 30 L420 -10 L300 -10 Z" fill="#99f6e4" opacity=".6" />
      </svg>
      <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-900 text-amber-300 shadow-lg transition group-hover:-translate-y-1">
          <MapPin className="h-5 w-5" />
        </span>
        <span className="h-3 w-0.5 bg-teal-900" />
      </span>
      <span className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-teal-900 shadow-sm">Open in Maps</span>
    </a>
  )
}

export function ContactPage({ contactDetails: details, formOptions, onSubmit, onOpenWhatsApp }: ContactPageProps) {
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({})
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  const [reference, setReference] = useState<string | null>(null)

  const set = (field: keyof Draft) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = field === 'message' ? event.target.value.slice(0, MAX_MESSAGE) : event.target.value
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found: Partial<Record<keyof Draft, string>> = {}
    if (!draft.name.trim()) found.name = 'Please enter your name.'
    if (!EMAIL.test(draft.email.trim())) found.email = 'Please enter a valid email address.'
    if (!draft.topic) found.topic = 'Choose what your message is about.'
    if (draft.message.trim().length < MIN_MESSAGE) found.message = `Please write at least ${MIN_MESSAGE} characters so we can help.`
    setErrors(found)
    if (Object.keys(found).length > 0) {
      event.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setSending(true)
    setFailed(false)
    try {
      const ref = onSubmit ? await onSubmit({ ...draft, topic: draft.topic as ContactTopic }) : 'EQ-0000'
      setReference(ref)
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  const rows = [
    { icon: Mail, label: 'Email', value: details.email, href: `mailto:${details.email}` },
    { icon: Phone, label: 'Phone', value: details.phone, href: `tel:${details.phone.replace(/\s/g, '')}` },
  ]

  return (
    <div className="bg-white px-4 pb-24 pt-10 text-stone-950 sm:px-6 lg:px-8 lg:pt-16">
      <div className="mx-auto max-w-7xl">
        <div className="ip-rise max-w-2xl">
          <p className="text-sm font-semibold text-teal-700">Contact</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">We are here to help.</h1>
          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            Questions about an application, your account or hiring with EduBridge. Send us a message or reach us directly.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.35fr] lg:gap-8">
          {/* Details */}
          <aside className="ip-rise min-w-0 space-y-6 [animation-delay:100ms]">
            <div className="rounded-3xl bg-teal-900 p-7 text-white">
              <h2 className="text-lg font-semibold">Reach us directly</h2>
              <ul className="mt-5 space-y-4">
                {rows.map((row) => (
                  <li key={row.label}>
                    <a href={row.href} className="group flex items-center gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                        <row.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs text-teal-200">{row.label}</span>
                        <span className="block truncate font-medium group-hover:underline">{row.value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onOpenWhatsApp?.(details.whatsappNumber)}
                className="mt-6 flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </button>
            </div>

            <div className={`${CARD} p-7`}>
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <MapPin className="h-5 w-5" />
                </span>
                <address className="not-italic">
                  <span className="block text-xs text-stone-500">Office</span>
                  {details.addressLines.map((line) => (
                    <span key={line} className="block text-sm font-medium text-stone-900">
                      {line}
                    </span>
                  ))}
                  <span className="block text-sm font-medium text-stone-900">
                    {details.city}, {details.state}
                  </span>
                </address>
              </div>
              <div className="mt-5">
                <MapTile details={details} />
              </div>
              <div className="mt-6 flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                  <Clock className="h-5 w-5" />
                </span>
                <dl className="min-w-0 flex-1 space-y-1.5 text-sm">
                  <dt className="text-xs text-stone-500">Opening hours</dt>
                  {details.openingHours.map((slot) => (
                    <div key={slot.days} className="flex justify-between gap-4">
                      <dd className="text-stone-600">{slot.days}</dd>
                      <dd className="shrink-0 font-medium tabular-nums text-stone-900">{slot.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            {details.isPlaceholder && <PlaceholderNote />}
          </aside>

          {/* Form */}
          <div className={`${CARD} ip-rise min-w-0 p-6 [animation-delay:200ms] sm:p-8 lg:self-start`}>
            {reference ? (
              <ThankYou title="Thank you. Your message is with us." reference={reference} replyTime={details.replyTime}>
                <button
                  type="button"
                  className={BTN_SECONDARY}
                  onClick={() => {
                    setDraft(EMPTY)
                    setReference(null)
                  }}
                >
                  Send another message
                </button>
              </ThankYou>
            ) : (
              <form onSubmit={submit} noValidate>
                <h2 className="text-xl font-semibold tracking-tight">Send us a message</h2>
                <p className="mt-1 text-sm text-stone-500">{details.replyTime}</p>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name}>
                    {(attrs) => <input {...attrs} value={draft.name} onChange={set('name')} autoComplete="name" className={INPUT} />}
                  </Field>
                  <Field label="Email" error={errors.email}>
                    {(attrs) => <input {...attrs} type="email" value={draft.email} onChange={set('email')} autoComplete="email" className={INPUT} />}
                  </Field>
                  <Field label="Phone" optional>
                    {(attrs) => <input {...attrs} type="tel" value={draft.phone} onChange={set('phone')} autoComplete="tel" placeholder="+234 800 000 0000" className={INPUT} />}
                  </Field>
                  <Field label="What is it about?" error={errors.topic}>
                    {(attrs) => (
                      <select {...attrs} value={draft.topic} onChange={set('topic')} className={INPUT}>
                        <option value="">Choose a topic</option>
                        {formOptions.contactTopics.map((topic) => (
                          <option key={topic.value} value={topic.value}>
                            {topic.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <Field
                    label="Message"
                    error={errors.message}
                    hint={
                      <span className="flex justify-between gap-4">
                        <span>If it is about an application, include the job title or reference.</span>
                        <span className={`tabular-nums ${draft.message.length > MAX_MESSAGE - 50 ? 'text-amber-700' : ''}`}>
                          {draft.message.length}/{MAX_MESSAGE}
                        </span>
                      </span>
                    }
                    className="sm:col-span-2"
                  >
                    {(attrs) => <textarea {...attrs} rows={6} value={draft.message} onChange={set('message')} className={`${INPUT} resize-y`} />}
                  </Field>
                </div>

                {failed && (
                  <p role="alert" className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-inset ring-rose-200">
                    Your message did not send. Please check your connection and try again. Nothing you typed has been lost.
                  </p>
                )}

                <button type="submit" disabled={sending} className={`${BTN_PRIMARY} mt-7 w-full sm:w-auto`}>
                  {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  {sending ? 'Sending' : 'Send message'}
                  {!sending && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
