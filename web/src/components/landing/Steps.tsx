'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText, Mail, MapPin, Search } from 'lucide-react'

type StepId = 'find' | 'apply' | 'track' | 'hear'

const STEPS: { id: StepId; title: string; text: string }[] = [
  { id: 'find', title: 'Find a role that fits', text: 'Search live jobs across Nigeria by title, skill, state or remote, with the monthly salary shown in naira wherever the employer shares it.' },
  { id: 'apply', title: 'Apply in minutes', text: 'Create an account once, keep your CV on your profile and send it with a short cover letter. One application per job, nothing to repeat.' },
  { id: 'track', title: 'Track every stage', text: 'Your tracker shows where each application stands, from Applied to Hired, with the date of every change and what happens next.' },
  { id: 'hear', title: 'Hear back, always', text: 'We email you each time the hiring team moves your application, so you are never left wondering after you press apply.' },
]

function StepVisual({ id }: { id: StepId }) {
  if (id === 'find') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
          <Search className="h-4 w-4 text-teal-700" aria-hidden="true" />
          <span className="text-sm text-stone-900">Data analyst</span>
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-stone-500">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Lagos
          </span>
        </div>
        {[
          ['Data Analyst', 'Paystream Technologies', '₦350k to ₦500k'],
          ['Junior Data Analyst', 'Greenfield Agro', '₦220k to ₦300k'],
          ['Business Intelligence Intern', 'BrightPath Logistics', '₦120k to ₦180k'],
        ].map(([title, company, pay], index) => (
          <div key={title} className={`flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ${index === 0 ? 'ring-2 ring-teal-600' : 'ring-1 ring-stone-200'}`}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-xs font-bold text-teal-800">{company.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-900">{title}</p>
              <p className="truncate text-xs text-stone-500">{company}</p>
            </div>
            <span className="ml-auto whitespace-nowrap text-xs font-semibold tabular-nums text-teal-800">{pay}</span>
          </div>
        ))}
      </div>
    )
  }
  if (id === 'apply') {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
        <p className="text-sm font-semibold text-stone-900">Apply for Data Analyst</p>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-stone-200 p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-stone-900">Your-CV-2026.pdf</p>
            <p className="text-xs text-stone-500">Saved on your profile</p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-stone-200 p-3 text-xs leading-relaxed text-stone-600">
          I would love to bring my reporting skills to the Paystream team...
        </div>
        <span className="mt-4 flex w-full items-center justify-center rounded-xl bg-teal-800 py-2.5 text-sm font-semibold text-white">Send application</span>
      </div>
    )
  }
  if (id === 'track') {
    const history = [
      ['Invited to interview', '12 Nov', 'bg-teal-600'],
      ['Moved to Screening', '7 Nov', 'bg-amber-500'],
      ['You applied', '3 Nov', 'bg-stone-400'],
    ]
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-stone-900">Junior Accountant</p>
          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800">Interview</span>
        </div>
        <ol className="mt-4 flex items-center" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((index) => (
            <li key={index} className={`flex items-center ${index === 4 ? '' : 'flex-1'}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${index <= 2 ? 'bg-teal-600' : 'bg-stone-200'} ${index === 2 ? 'ring-4 ring-teal-600/20' : ''}`} />
              {index < 4 && <span className={`mx-1 h-0.5 flex-1 rounded-full ${index < 2 ? 'bg-teal-600' : 'bg-stone-200'}`} />}
            </li>
          ))}
        </ol>
        <ul className="mt-5 space-y-3">
          {history.map(([label, date, dot]) => (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
              <span className="text-stone-800">{label}</span>
              <span className="ml-auto text-xs tabular-nums text-stone-500">{date}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-stone-50 px-3 py-2 text-xs text-stone-600">Interview done. Expect your next update by Thu 26 Nov.</p>
      </div>
    )
  }
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
      <div className="flex items-center gap-3 border-b border-stone-100 px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 text-teal-950">
          <Mail className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-900">Recruiture</p>
          <p className="truncate text-xs text-stone-500">Your application moved to Interview</p>
        </div>
        <span className="ml-auto text-xs text-stone-400">2:45 pm</span>
      </div>
      <div className="space-y-2 px-5 py-4 text-sm leading-relaxed text-stone-600">
        <p>Hi Chiamaka,</p>
        <p>Good news. Harbour Point Foods would like to interview you for the Junior Accountant role.</p>
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-stone-700">Note from the hiring team: please bring a printed copy of your CV.</p>
      </div>
    </div>
  )
}

/**
 * How it works: on wide screens the steps scroll past while the matching card
 * stays in view beside them. On small screens each card sits under its step.
 */
export function Steps() {
  const [active, setActive] = useState<StepId>('find')
  const refs = useRef<Record<string, HTMLLIElement | null>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.getAttribute('data-step') as StepId)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    Object.values(refs.current).forEach((element) => element && observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const activeIndex = STEPS.findIndex((step) => step.id === active)

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
      <ol className="min-w-0 space-y-10 lg:space-y-56 lg:py-24">
        {STEPS.map((step, index) => {
          const isActive = step.id === active
          return (
            <li key={step.id} ref={(element) => { refs.current[step.id] = element }} data-step={step.id}>
              <div className={`h-1 w-full overflow-hidden rounded-full bg-stone-100`}>
                <div className={`h-full rounded-full bg-teal-700 transition-all duration-500 ${index <= activeIndex ? 'w-full' : 'w-0'}`} />
              </div>
              <p className="mt-5 text-sm font-semibold tabular-nums text-teal-700">0{index + 1}</p>
              <h3 className={`mt-2 text-2xl font-semibold tracking-tight transition-colors sm:text-3xl ${isActive ? 'text-stone-900' : 'text-stone-900 lg:text-stone-300'}`}>{step.title}</h3>
              <p className={`mt-3 max-w-md text-base leading-relaxed transition-colors ${isActive ? 'text-stone-600' : 'text-stone-600 lg:text-stone-300'}`}>{step.text}</p>
              <div className="mt-6 rounded-3xl bg-amber-50 p-5 lg:hidden">
                <StepVisual id={step.id} />
              </div>
            </li>
          )
        })}
      </ol>
      <div className="hidden min-w-0 lg:block">
        <div className="sticky top-32 overflow-hidden rounded-[2rem] bg-amber-50 p-10">
          <div key={active} className="animate-fade-up motion-reduce:animate-none">
            <StepVisual id={active} />
          </div>
        </div>
      </div>
    </div>
  )
}
