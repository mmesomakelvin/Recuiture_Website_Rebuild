import { useState } from 'react'
import { ArrowLeft, Building2, Inbox, Mail, Phone, Reply, SearchX, StickyNote } from 'lucide-react'
import type { Enquiry, EnquirySource, EnquiryStatus } from '@/../product/sections/admin-portal/types'
import { EmptyState, EnquiryStatusBadge, FilterTabs, PageHeader, SourceTag } from './Bits'
import { ENQUIRY_STATUS_LABELS, formatDateTime, relativeDay } from './format'
import { BTN_PRIMARY, BTN_SECONDARY, CARD, INPUT, MONO, SECTION_TITLE } from './styles'

type StatusFilter = 'all' | EnquiryStatus
type SourceFilter = 'all' | EnquirySource

interface EnquiriesViewProps {
  enquiries: Enquiry[]
  today: string
  selectedId: string | null
  onSelect: (enquiryId: string | null) => void
  onUpdateStatus: (enquiryId: string, status: EnquiryStatus) => void
  onAddNote: (enquiryId: string, body: string) => void
  onReply: (enquiryId: string) => void
}

const STATUSES: EnquiryStatus[] = ['new', 'in-progress', 'closed']

function EnquiryDetail({
  enquiry,
  onBack,
  onUpdateStatus,
  onAddNote,
  onReply,
}: {
  enquiry: Enquiry
  onBack: () => void
  onUpdateStatus: (status: EnquiryStatus) => void
  onAddNote: (body: string) => void
  onReply: () => void
}) {
  const [note, setNote] = useState('')

  return (
    <article key={enquiry.id} className="ap-rise flex h-full flex-col">
      <div className="border-b border-stone-200 px-5 py-4 sm:px-6 dark:border-stone-800">
        <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 lg:hidden dark:text-stone-400">
          <ArrowLeft className="h-4 w-4" />
          All enquiries
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <SourceTag source={enquiry.source} />
          <span style={MONO} className="text-xs text-stone-400">
            {enquiry.reference}
          </span>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-stone-900 dark:text-white">{enquiry.subject}</h2>
        <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
          From <span className="font-medium text-stone-800 dark:text-stone-200">{enquiry.name}</span>
          {' · '}
          <span style={MONO} className="text-xs">
            {formatDateTime(enquiry.receivedAt)}
          </span>
        </p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
        {/* Status and reply */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="radiogroup" aria-label="Enquiry status" className="inline-flex rounded-lg bg-stone-100 p-1 dark:bg-stone-800">
            {STATUSES.map((status) => {
              const isActive = enquiry.status === status
              return (
                <button
                  key={status}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => !isActive && onUpdateStatus(status)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-teal-900 shadow-sm dark:bg-stone-950 dark:text-teal-200'
                      : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'
                  }`}
                >
                  {ENQUIRY_STATUS_LABELS[status]}
                </button>
              )
            })}
          </div>
          <button type="button" onClick={onReply} className={BTN_PRIMARY}>
            <Reply className="h-4 w-4" />
            Reply by email
          </button>
        </div>

        {/* Sender */}
        <section className="grid gap-3 sm:grid-cols-2">
          <a
            href={`mailto:${enquiry.email}`}
            className="flex items-center gap-2.5 rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-teal-800 hover:border-teal-300 dark:border-stone-700 dark:text-teal-300"
          >
            <Mail className="h-4 w-4 shrink-0 text-stone-400" />
            <span className="truncate">{enquiry.email}</span>
          </a>
          <div className="flex items-center gap-2.5 rounded-xl border border-stone-200 px-3 py-2.5 text-sm dark:border-stone-700">
            <Phone className="h-4 w-4 shrink-0 text-stone-400" />
            {enquiry.phone ? (
              <span style={MONO} className="text-stone-700 dark:text-stone-200">
                {enquiry.phone}
              </span>
            ) : (
              <span className="text-stone-400">No phone given</span>
            )}
          </div>
        </section>

        {enquiry.employerDetails && (
          <section className="rounded-xl bg-teal-950 p-4 text-teal-50 dark:bg-teal-900/50">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Building2 className="h-4 w-4 text-amber-300" />
              {enquiry.employerDetails.companyName}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-teal-200/80">Contact role</dt>
                <dd className="font-medium">{enquiry.employerDetails.contactRole}</dd>
              </div>
              <div>
                <dt className="text-xs text-teal-200/80">Roles to fill</dt>
                <dd style={MONO} className="font-medium text-amber-200">
                  {enquiry.employerDetails.rolesToFill}
                </dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-xs text-teal-200/80">Timeline</dt>
                <dd className="font-medium">{enquiry.employerDetails.hiringTimeline}</dd>
              </div>
            </dl>
          </section>
        )}

        <section>
          <h3 className={`${SECTION_TITLE} mb-2`}>Message</h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-stone-700 dark:text-stone-200">{enquiry.message}</p>
        </section>

        {/* Notes */}
        <section>
          <h3 className={`${SECTION_TITLE} mb-3 flex items-center gap-2`}>
            <StickyNote className="h-3.5 w-3.5" />
            Internal notes
          </h3>
          {enquiry.notes.length === 0 ? (
            <p className="mb-3 text-sm text-stone-400">No notes yet. Notes are only visible to EduBridge staff.</p>
          ) : (
            <ul className="mb-4 space-y-3">
              {enquiry.notes.map((item) => (
                <li key={item.id} className="rounded-xl bg-amber-50/70 px-4 py-3 ring-1 ring-inset ring-amber-200/70 dark:bg-amber-400/5 dark:ring-amber-400/15">
                  <p className="text-sm text-stone-800 dark:text-stone-100">{item.body}</p>
                  <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
                    {item.authorName} ·{' '}
                    <span style={MONO} className="text-[11px]">
                      {formatDateTime(item.at)}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (!note.trim()) return
              onAddNote(note.trim())
              setNote('')
            }}
          >
            <label htmlFor="enquiry-note" className="sr-only">
              Add an internal note
            </label>
            <textarea
              id="enquiry-note"
              rows={2}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add an internal note, for example who you spoke to and what happens next"
              className={INPUT}
            />
            <div className="mt-2 flex justify-end">
              <button type="submit" disabled={!note.trim()} className={BTN_SECONDARY}>
                Add note
              </button>
            </div>
          </form>
        </section>
      </div>
    </article>
  )
}

export function EnquiriesView({ enquiries, today, selectedId, onSelect, onUpdateStatus, onAddNote, onReply }: EnquiriesViewProps) {
  const [status, setStatus] = useState<StatusFilter>('new')
  const [source, setSource] = useState<SourceFilter>('all')

  const bySource = enquiries.filter((enquiry) => source === 'all' || enquiry.source === source)
  const visible = bySource
    .filter((enquiry) => status === 'all' || enquiry.status === status)
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
  const selected = enquiries.find((enquiry) => enquiry.id === selectedId)

  return (
    <div>
      <PageHeader title="Enquiries" description="Messages from the Contact and For Employers forms. Replies go from your own email." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs<StatusFilter>
          label="Filter by status"
          value={status}
          onChange={setStatus}
          options={(['new', 'in-progress', 'closed', 'all'] as StatusFilter[]).map((value) => ({
            value,
            label: value === 'all' ? 'All' : ENQUIRY_STATUS_LABELS[value],
            count: bySource.filter((enquiry) => value === 'all' || enquiry.status === value).length,
          }))}
        />
        <select
          aria-label="Filter by source"
          value={source}
          onChange={(event) => setSource(event.target.value as SourceFilter)}
          className={`${INPUT} sm:w-48`}
        >
          <option value="all">All sources</option>
          <option value="contact">Contact form</option>
          <option value="for-employers">For Employers form</option>
        </select>
      </div>

      <div className={`${CARD} overflow-hidden lg:grid lg:h-[calc(100vh-15rem)] lg:min-h-[560px] lg:grid-cols-[360px_minmax(0,1fr)]`}>
        {/* List */}
        <div className={`border-stone-200 lg:block lg:overflow-y-auto lg:border-r dark:border-stone-800 ${selected ? 'hidden' : 'block'}`}>
          {enquiries.length === 0 ? (
            <EmptyState compact icon={Inbox} title="No enquiries yet" body="Messages from the Contact and For Employers forms will land here." />
          ) : visible.length === 0 ? (
            <EmptyState
              compact
              icon={SearchX}
              title={status === 'new' ? 'No new enquiries' : 'Nothing here'}
              body={status === 'new' ? 'You are all caught up.' : 'Try another status or source.'}
              action={
                <button type="button" onClick={() => setStatus('all')} className={BTN_SECONDARY}>
                  Show all enquiries
                </button>
              }
            />
          ) : (
            <ul className="divide-y divide-stone-100 dark:divide-stone-800">
              {visible.map((enquiry) => {
                const isSelected = enquiry.id === selectedId
                return (
                  <li key={enquiry.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(enquiry.id)}
                      className={`relative flex w-full gap-3 px-4 py-3.5 text-left transition ${
                        isSelected ? 'bg-teal-50/80 dark:bg-teal-400/5' : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                      }`}
                    >
                      {isSelected && <span className="absolute inset-y-0 left-0 w-[3px] bg-teal-700 dark:bg-teal-400" />}
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${enquiry.status === 'new' ? 'bg-amber-500' : 'bg-transparent'}`}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span
                            className={`truncate text-sm ${
                              enquiry.status === 'new' ? 'font-semibold text-stone-900 dark:text-white' : 'font-medium text-stone-700 dark:text-stone-200'
                            }`}
                          >
                            {enquiry.employerDetails?.companyName ?? enquiry.name}
                          </span>
                          <span className="shrink-0 text-[11px] text-stone-400">{relativeDay(enquiry.receivedAt, today)}</span>
                        </span>
                        <span className="mt-0.5 block truncate text-sm text-stone-600 dark:text-stone-300">{enquiry.subject}</span>
                        <span className="mt-1.5 flex items-center gap-2">
                          <SourceTag source={enquiry.source} />
                          {status === 'all' && <EnquiryStatusBadge status={enquiry.status} />}
                          {enquiry.notes.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-stone-400">
                              <StickyNote className="h-3 w-3" />
                              <span style={MONO}>{enquiry.notes.length}</span>
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Detail */}
        <div className={`min-w-0 lg:block lg:overflow-hidden ${selected ? 'block' : 'hidden'}`}>
          {selected ? (
            <EnquiryDetail
              key={selected.id}
              enquiry={selected}
              onBack={() => onSelect(null)}
              onUpdateStatus={(next) => onUpdateStatus(selected.id, next)}
              onAddNote={(body) => onAddNote(selected.id, body)}
              onReply={() => onReply(selected.id)}
            />
          ) : (
            <div className="hidden h-full items-center justify-center lg:flex">
              <EmptyState compact icon={Mail} title="Choose an enquiry" body="Select a message on the left to read it, add notes and update its status." />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
