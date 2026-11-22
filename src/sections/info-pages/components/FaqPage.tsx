import { useState } from 'react'
import { ArrowRight, Search, X } from 'lucide-react'
import type { FaqGroup, FaqItem, InfoPage } from '@/../product/sections/info-pages/types'
import { FaqAccordionItem } from './Bits'
import { BTN_GOLD } from './styles'

interface FaqPageProps {
  groups: FaqGroup[]
  faqs: FaqItem[]
  onNavigate?: (page: InfoPage) => void
}

export function FaqPage({ groups, faqs, onNavigate }: FaqPageProps) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const matches = q ? faqs.filter((faq) => `${faq.question} ${faq.answer}`.toLowerCase().includes(q)) : faqs
  const visibleGroups = groups.map((group) => ({ group, items: matches.filter((faq) => faq.group === group.id) })).filter(({ items }) => items.length > 0)

  const jumpTo = (id: string) => document.getElementById(`faq-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="bg-white px-4 pb-24 pt-10 text-stone-950 sm:px-6 lg:px-8 lg:pt-16">
      <div className="mx-auto max-w-4xl">
        <div className="ip-rise text-center">
          <p className="text-sm font-semibold text-teal-700">Help centre</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">Questions, answered.</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
            Everything about applying, hiring and your account. Search or pick a topic below.
          </p>
        </div>

        {/* Search */}
        <div className="ip-rise mx-auto mt-10 max-w-2xl [animation-delay:100ms]">
          <label htmlFor="faq-search" className="sr-only">
            Search the questions
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-700" />
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search, for example password or shortlist"
              className="block min-h-14 w-full rounded-2xl border border-stone-300 bg-white pl-14 pr-12 text-base text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p aria-live="polite" className="mt-3 min-h-5 text-center text-sm text-stone-500">
            {q ? `${matches.length} ${matches.length === 1 ? 'question matches' : 'questions match'} "${query.trim()}"` : ''}
          </p>
        </div>

        {/* Group chips */}
        {!q && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => jumpTo(group.id)}
                className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-teal-700 hover:bg-teal-50 hover:text-teal-900"
              >
                {group.label}
              </button>
            ))}
          </div>
        )}

        {/* Groups */}
        <div className="mt-12 space-y-12">
          {visibleGroups.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 px-6 py-14 text-center">
              <p className="text-lg font-semibold">No questions match that search.</p>
              <p className="mt-2 text-sm text-stone-600">Try another word, or ask us directly and we will answer.</p>
              <button type="button" onClick={() => onNavigate?.('contact')} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 underline decoration-amber-400 decoration-2 underline-offset-4">
                Contact us <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            visibleGroups.map(({ group, items }) => (
              <section key={group.id} id={`faq-${group.id}`} className="scroll-mt-28" aria-labelledby={`faq-${group.id}-title`}>
                <div className="flex items-baseline justify-between gap-4 border-b-2 border-teal-900 pb-3">
                  <h2 id={`faq-${group.id}-title`} className="text-xl font-semibold tracking-tight">
                    {group.label}
                  </h2>
                  <span className="text-sm tabular-nums text-stone-500">{items.length}</span>
                </div>
                <p className="mt-2 text-sm text-stone-500">{group.description}</p>
                <div className="mt-2">
                  {items.map((item) => (
                    <FaqAccordionItem key={`${item.id}-${q}`} item={item} query={query} defaultOpen={Boolean(q)} />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {/* Still need help */}
        <div className="mt-16 flex flex-col items-start gap-6 rounded-[2rem] bg-teal-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Still have a question?</h2>
            <p className="mt-2 text-sm text-teal-100">Send us a message and a real person on our team will reply.</p>
          </div>
          <button type="button" onClick={() => onNavigate?.('contact')} className={`${BTN_GOLD} shrink-0`}>
            Contact us <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
