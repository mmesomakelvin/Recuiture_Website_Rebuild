import { useId, useState } from 'react'
import { CircleCheck, Info, Plus } from 'lucide-react'
import type { FaqItem } from '@/../product/sections/info-pages/types'
import { ERROR, LABEL, OPTIONAL } from './styles'

// -----------------------------------------------------------------------------
// Form field wrapper: label, optional tag, hint and error, wired for screen readers
// -----------------------------------------------------------------------------

export function Field({
  label,
  optional = false,
  hint,
  error,
  className = '',
  children,
}: {
  label: string
  optional?: boolean
  hint?: React.ReactNode
  error?: string
  className?: string
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => React.ReactNode
}) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL}>
        <span>{label}</span>
        {optional && <span className={OPTIONAL}>Optional</span>}
      </label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {error ? (
        <p id={`${id}-error`} className={ERROR}>
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-stone-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

/** A numbered heading for one part of a long form */
export function FormPart({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-stone-100 pt-7 first:border-t-0 first:pt-0">
      <legend className="flex items-center gap-3 text-base font-semibold text-stone-900">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-300 text-xs font-bold text-teal-950">{number}</span>
        {title}
      </legend>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}

// -----------------------------------------------------------------------------
// Thank-you panel shown after a form is sent
// -----------------------------------------------------------------------------

export function ThankYou({
  title,
  reference,
  replyTime,
  children,
}: {
  title: string
  reference: string
  replyTime: string
  children?: React.ReactNode
}) {
  return (
    <div role="status" className="ip-pop flex flex-col items-center px-4 py-10 text-center sm:py-14">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-900 text-amber-300">
        <CircleCheck className="h-8 w-8" strokeWidth={2} />
      </span>
      <h3 className="mt-6 text-2xl font-semibold tracking-tight text-stone-950">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-600">{replyTime} We have sent a copy to your email.</p>
      <p className="mt-5 rounded-full bg-stone-100 px-4 py-1.5 text-sm text-stone-600">
        Your reference <span className="font-semibold tabular-nums text-stone-900">{reference}</span>
      </p>
      {children && <div className="mt-7">{children}</div>}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Note shown while contact details are sample placeholders
// -----------------------------------------------------------------------------

export function PlaceholderNote() {
  return (
    <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-900 ring-1 ring-inset ring-amber-200">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      Sample contact details for the design. They will be replaced with EduBridge&apos;s real details before launch.
    </p>
  )
}

// -----------------------------------------------------------------------------
// FAQ accordion item, with optional search highlighting
// -----------------------------------------------------------------------------

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'))
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={index} className="rounded bg-amber-200 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  )
}

export function FaqAccordionItem({ item, query = '', defaultOpen = false }: { item: FaqItem; query?: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  return (
    <div className="border-b border-stone-200 last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="group flex w-full items-start justify-between gap-6 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          <span className="text-base font-medium text-stone-900 group-hover:text-teal-800">
            <Highlight text={item.question} query={query} />
          </span>
          <span
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
              open ? 'rotate-45 border-teal-900 bg-teal-900 text-white' : 'border-stone-300 text-stone-500 group-hover:border-teal-700 group-hover:text-teal-800'
            }`}
            aria-hidden="true"
          >
            <Plus className="h-4 w-4" />
          </span>
        </button>
      </h3>
      <div id={panelId} hidden={!open} className="pb-6 pr-12">
        <p className="text-sm leading-relaxed text-stone-600">
          <Highlight text={item.answer} query={query} />
        </p>
      </div>
    </div>
  )
}
