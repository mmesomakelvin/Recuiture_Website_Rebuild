import { useCallback, useMemo, useState } from 'react'
import { ArrowUpDown, MapPin, Search, SearchX } from 'lucide-react'
import type { JobBoardProps, JobSearchState, SortOption } from '@/../product/sections/job-board/types'
import { EMPTY_SEARCH_STATE, applySearch } from './format'
import { FilterBar } from './FilterBar'
import { JobCard } from './JobCard'
import { JobDetail } from './JobDetail'
import { SignInPrompt, type SignInReason } from './SignInPrompt'

// Typography: Poppins (headings and body) and IBM Plex Mono (salaries, counts), applied by the app shell.

const ADIRE_TILE = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><g fill='none' stroke='#fbbf24' stroke-width='1.2'><circle cx='28' cy='28' r='9'/><circle cx='28' cy='28' r='3'/><path d='M0 0l10 10M56 0L46 10M0 56l10-10M56 56L46 46'/><path d='M28 0v8M28 48v8M0 28h8M48 28h8'/></g></svg>`,
)

const BOARD_STYLES = `
@keyframes jb-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes jb-sheet { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: no-preference) {
  .jb-rise { animation: jb-rise 420ms cubic-bezier(.2,.7,.2,1) both; }
  .jb-sheet { animation: jb-sheet 260ms cubic-bezier(.2,.7,.2,1) both; }
}
.jb-adire-fade { background-image: url("data:image/svg+xml,${ADIRE_TILE}"); background-size: 56px 56px; -webkit-mask-image: linear-gradient(115deg, transparent 20%, #000 75%); mask-image: linear-gradient(115deg, transparent 20%, #000 75%); }
.jb-weave { background-image: repeating-linear-gradient(135deg, rgb(19 78 74 / .07) 0 1px, transparent 1px 9px); -webkit-mask-image: linear-gradient(to bottom, #000, transparent); mask-image: linear-gradient(to bottom, #000, transparent); }
`

export function JobBoard({
  jobs,
  currentUser,
  filterOptions,
  searchState,
  selectedJobId,
  onSearch,
  onSearchStateChange,
  onClearFilters,
  onSelectJob,
  onSaveJob,
  onUnsaveJob,
  onShareJob,
  onApply,
  onSignIn,
  onCreateAccount,
}: JobBoardProps) {
  const [search, setSearch] = useState<JobSearchState>(searchState ?? EMPTY_SEARCH_STATE)
  const [draftKeyword, setDraftKeyword] = useState(search.keyword)
  const [draftLocation, setDraftLocation] = useState(search.location)
  const [selectedId, setSelectedId] = useState<string | undefined>(selectedJobId)
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>(currentUser?.savedJobIds ?? [])
  const [prompt, setPrompt] = useState<{ reason: SignInReason; jobTitle: string } | null>(null)

  const results = useMemo(
    () => applySearch(jobs, search, filterOptions.salaryRanges),
    [jobs, search, filterOptions.salaryRanges],
  )
  const selectedJob = results.find((job) => job.id === selectedId) ?? results[0]
  const graduateFriendlyCount = jobs.filter((job) => job.isGraduateFriendly).length
  const appliedIds = currentUser?.appliedJobIds ?? []

  const updateSearch = (next: JobSearchState) => {
    setSearch(next)
    onSearchStateChange?.(next)
  }

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault()
    updateSearch({ ...search, keyword: draftKeyword, location: draftLocation })
    onSearch?.(draftKeyword, draftLocation)
  }

  const clearAll = () => {
    const cleared = { ...EMPTY_SEARCH_STATE, sort: search.sort }
    setDraftKeyword('')
    setDraftLocation('')
    setSearch(cleared)
    onSearchStateChange?.(cleared)
    onClearFilters?.()
  }

  const selectJob = (jobId: string) => {
    setSelectedId(jobId)
    setIsMobileDetailOpen(true)
    onSelectJob?.(jobId)
    if (window.matchMedia('(max-width: 1023px)').matches) window.scrollTo({ top: 0 })
  }

  const toggleSave = (jobId: string, jobTitle: string) => {
    if (!currentUser) {
      setPrompt({ reason: 'save', jobTitle })
      return
    }
    if (savedIds.includes(jobId)) {
      setSavedIds((ids) => ids.filter((id) => id !== jobId))
      onUnsaveJob?.(jobId)
    } else {
      setSavedIds((ids) => [...ids, jobId])
      onSaveJob?.(jobId)
    }
  }

  const apply = (jobId: string, jobTitle: string) => {
    if (!currentUser) {
      setPrompt({ reason: 'apply', jobTitle })
      return
    }
    onApply?.(jobId)
  }

  const closePrompt = useCallback(() => setPrompt(null), [])

  const detail = selectedJob && (
    <JobDetail
      key={selectedJob.id}
      job={selectedJob}
      isSaved={savedIds.includes(selectedJob.id)}
      hasApplied={appliedIds.includes(selectedJob.id)}
      onApply={() => apply(selectedJob.id, selectedJob.title)}
      onToggleSave={() => toggleSave(selectedJob.id, selectedJob.title)}
      onShare={(channel) => onShareJob?.(selectedJob.id, channel)}
    />
  )

  return (
    <div className="min-h-full bg-stone-50 dark:bg-stone-950">
      <style>{BOARD_STYLES}</style>

      {/* Mobile full-page detail */}
      {isMobileDetailOpen && selectedJob && (
        <div className="px-4 py-5 sm:px-6 lg:hidden">
          <JobDetail
            key={`mobile-${selectedJob.id}`}
            job={selectedJob}
            isSaved={savedIds.includes(selectedJob.id)}
            hasApplied={appliedIds.includes(selectedJob.id)}
            onBack={() => setIsMobileDetailOpen(false)}
            onApply={() => apply(selectedJob.id, selectedJob.title)}
            onToggleSave={() => toggleSave(selectedJob.id, selectedJob.title)}
            onShare={(channel) => onShareJob?.(selectedJob.id, channel)}
          />
        </div>
      )}

      <div className={isMobileDetailOpen ? 'hidden lg:block' : ''}>
        {/* Hero search */}
        <section className="relative overflow-hidden bg-teal-950">
          <div aria-hidden="true" className="jb-adire-fade absolute inset-0 opacity-[0.18]" />
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-teal-700/40 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Jobs across Nigeria</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-[2.75rem]">
              Find work that moves you <span className="text-amber-300">forward.</span>
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-teal-100/85">
              Live roles from employers across Nigeria, including jobs open to EduBridge Academy graduates.
            </p>

            <form
              onSubmit={submitSearch}
              role="search"
              className="mt-7 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] sm:flex-row sm:items-center sm:gap-0 dark:bg-stone-900"
            >
              <label className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5 focus-within:bg-stone-50 dark:focus-within:bg-stone-800">
                <Search className="h-5 w-5 shrink-0 text-teal-800 dark:text-teal-300" />
                <span className="sr-only">Job title, skill or company</span>
                <input
                  type="search"
                  value={draftKeyword}
                  onChange={(event) => setDraftKeyword(event.target.value)}
                  placeholder="Job title, skill or company"
                  className="w-full bg-transparent text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-white"
                />
              </label>
              <span aria-hidden="true" className="hidden h-8 w-px bg-stone-200 sm:block dark:bg-stone-700" />
              <label className="flex items-center gap-3 rounded-xl px-3 py-2.5 focus-within:bg-stone-50 sm:w-64 dark:focus-within:bg-stone-800">
                <MapPin className="h-5 w-5 shrink-0 text-teal-800 dark:text-teal-300" />
                <span className="sr-only">City, state or Remote</span>
                <input
                  type="text"
                  value={draftLocation}
                  onChange={(event) => setDraftLocation(event.target.value)}
                  placeholder="City, state or Remote"
                  className="w-full bg-transparent text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-white"
                />
              </label>
              <button
                type="submit"
                className="h-12 rounded-xl bg-amber-400 px-7 text-[15px] font-semibold text-teal-950 transition-colors hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-900"
              >
                Search jobs
              </button>
            </form>

            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-teal-100/80">
              <span>
                <span className="font-mono font-semibold tabular-nums text-white">{jobs.length}</span> live jobs
              </span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-teal-100/40" />
              <span>
                <span className="font-mono font-semibold tabular-nums text-amber-300">{graduateFriendlyCount}</span>{' '}
                open to EduBridge graduates
              </span>
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="border-b border-stone-200 py-5 dark:border-stone-800">
            <FilterBar
              state={search}
              options={filterOptions}
              resultCount={results.length}
              onChange={updateSearch}
              onClearAll={clearAll}
            />
          </div>

          {/* Result count and sort */}
          <div className="flex items-center justify-between gap-4 py-4">
            <p className="text-sm text-stone-600 dark:text-stone-400" aria-live="polite">
              <span className="font-mono font-semibold tabular-nums text-stone-900 dark:text-white">{results.length}</span>{' '}
              {results.length === 1 ? 'job' : 'jobs'}
              {search.keyword && (
                <>
                  {' '}
                  for <span className="font-semibold text-stone-900 dark:text-white">"{search.keyword}"</span>
                </>
              )}
            </p>
            <label className="relative flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
              <ArrowUpDown className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Sort by</span>
              <select
                value={search.sort}
                onChange={(event) => updateSearch({ ...search, sort: event.target.value as SortOption })}
                className="cursor-pointer rounded-lg border border-stone-300 bg-white py-1.5 pl-2.5 pr-8 text-sm font-medium text-stone-900 focus:border-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-800/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
              >
                {filterOptions.sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <div className="jb-rise mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center dark:border-stone-700 dark:bg-stone-900">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-800 dark:bg-teal-400/10 dark:text-teal-300">
                <SearchX className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-stone-900 dark:text-white">No jobs match your search</h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                Try removing a filter, widening the salary range or searching a different location.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-6 h-11 rounded-xl bg-teal-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,27rem)_minmax(0,1fr)]">
              <ul className="flex flex-col gap-3" aria-label="Job results">
                {results.map((job, index) => (
                  <li key={job.id}>
                    <JobCard
                      job={job}
                      index={index}
                      isSelected={job.id === selectedJob?.id}
                      isSaved={savedIds.includes(job.id)}
                      hasApplied={appliedIds.includes(job.id)}
                      onSelect={() => selectJob(job.id)}
                      onToggleSave={() => toggleSave(job.id, job.title)}
                    />
                  </li>
                ))}
              </ul>

              <div className="hidden lg:block">
                <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain rounded-3xl [scrollbar-width:thin]">
                  {detail}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {prompt && (
        <SignInPrompt
          reason={prompt.reason}
          jobTitle={prompt.jobTitle}
          onSignIn={() => {
            setPrompt(null)
            onSignIn?.()
          }}
          onCreateAccount={() => {
            setPrompt(null)
            onCreateAccount?.()
          }}
          onClose={closePrompt}
        />
      )}
    </div>
  )
}
