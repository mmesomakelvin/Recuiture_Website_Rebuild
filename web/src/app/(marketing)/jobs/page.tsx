'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, MapPin, Search, SlidersHorizontal, X } from 'lucide-react'
import { previewJobs } from '@/lib/jobs/mock-jobs'

const markColors = [
  'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100',
  'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100',
  'bg-lime-100 text-lime-900 dark:bg-lime-900 dark:text-lime-100',
  'bg-sky-100 text-sky-900 dark:bg-sky-900 dark:text-sky-100',
  'bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-100',
  'bg-violet-100 text-violet-900 dark:bg-violet-900 dark:text-violet-100',
]

const typeNames: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
}

const experienceNames: Record<string, string> = {
  ENTRY: 'Entry level',
  MID: 'Mid level',
  SENIOR: 'Senior',
}

const formatNaira = (amount: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)

export default function JobsPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const [appliedLocation, setAppliedLocation] = useState('')
  const [jobType, setJobType] = useState('all')
  const [experience, setExperience] = useState('all')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [sort, setSort] = useState('relevance')

  const jobs = useMemo(() => {
    const matches = previewJobs.filter((job) => {
      const needle = appliedQuery.trim().toLowerCase()
      const place = appliedLocation.trim().toLowerCase()
      return (!needle || [job.title, job.company, job.sector, ...job.skills].some((value) => value.toLowerCase().includes(needle)))
        && (!place || job.location.toLowerCase().includes(place))
        && (jobType === 'all' || job.jobType.includes(jobType))
        && (experience === 'all' || job.experienceLevel === experience)
        && (!remoteOnly || job.isRemote)
    })
    if (sort === 'newest') return matches.sort((a, b) => b.postedAt.localeCompare(a.postedAt))
    if (sort === 'salary') return matches.sort((a, b) => b.salaryMax - a.salaryMax)
    return matches
  }, [appliedQuery, appliedLocation, jobType, experience, remoteOnly, sort])

  const hasFilters = Boolean(appliedQuery || appliedLocation || jobType !== 'all' || experience !== 'all' || remoteOnly)

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAppliedQuery(query)
    setAppliedLocation(location)
  }

  const clearFilters = () => {
    setQuery('')
    setLocation('')
    setAppliedQuery('')
    setAppliedLocation('')
    setJobType('all')
    setExperience('all')
    setRemoteOnly(false)
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950 dark:bg-stone-950 dark:text-stone-50">
      <section className="relative overflow-hidden bg-teal-950 pb-28 pt-16 text-white sm:pb-32 sm:pt-20 dark:bg-stone-900">
        <div className="pointer-events-none absolute -right-20 top-0 size-80 rounded-full border-[50px] border-teal-800/50 sm:right-8 sm:size-[28rem] sm:border-[70px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-12 top-28 size-52 rounded-full border-[30px] border-lime-400/15 sm:right-40 sm:size-72" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Work worth getting <span className="text-lime-300">excited about.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-teal-50/85 sm:text-lg">Explore opportunities that match your skills, ambitions, and the way you want to work.</p>
          </div>
          <div className="hidden max-w-xs border-l border-teal-400/60 pl-6 lg:block">
            <p className="text-sm font-semibold text-lime-300">A better search starts here</p>
            <p className="mt-2 text-sm leading-6 text-teal-50/75">Find a role, understand the opportunity, and take your next step with confidence.</p>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-xl shadow-teal-950/10 sm:p-6 dark:border-stone-700 dark:bg-stone-900 dark:shadow-black/20">
          <form onSubmit={submitSearch} role="search" className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.65fr)_auto]">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">Job title or skill</span>
              <span className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-teal-700 dark:text-lime-300" aria-hidden="true" />
                <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. Data analyst, design, React" className="min-h-12 w-full rounded-xl border border-stone-300 bg-stone-50 pl-12 pr-4 text-sm text-stone-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 dark:border-stone-600 dark:bg-stone-800 dark:text-white dark:focus:border-lime-400 dark:focus:ring-lime-400/20" />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">Location</span>
              <span className="relative block">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-teal-700 dark:text-lime-300" aria-hidden="true" />
                <input type="search" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City or remote" className="min-h-12 w-full rounded-xl border border-stone-300 bg-stone-50 pl-12 pr-4 text-sm text-stone-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 dark:border-stone-600 dark:bg-stone-800 dark:text-white dark:focus:border-lime-400 dark:focus:ring-lime-400/20" />
              </span>
            </label>
            <button type="submit" className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-900 px-6 text-sm font-bold text-white transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-lime-400 dark:text-stone-950 dark:hover:bg-lime-300">
              Search roles <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-5 flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:flex-wrap sm:items-center dark:border-stone-700">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400"><SlidersHorizontal className="size-4" aria-hidden="true" /> Refine search</span>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <label className="sr-only" htmlFor="job-type">Job type</label>
              <select id="job-type" value={jobType} onChange={(event) => setJobType(event.target.value)} className="min-h-11 rounded-xl border border-stone-300 bg-white px-3 text-sm font-medium text-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100">
                <option value="all">All job types</option>
                {Object.entries(typeNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <label className="sr-only" htmlFor="experience">Experience level</label>
              <select id="experience" value={experience} onChange={(event) => setExperience(event.target.value)} className="min-h-11 rounded-xl border border-stone-300 bg-white px-3 text-sm font-medium text-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100">
                <option value="all">All experience</option>
                {Object.entries(experienceNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-stone-300 px-3 text-sm font-medium text-stone-800 dark:border-stone-600 dark:text-stone-100">
              <input type="checkbox" checked={remoteOnly} onChange={(event) => setRemoteOnly(event.target.checked)} className="size-4 accent-teal-800 dark:accent-lime-400" /> Remote only
            </label>
            {hasFilters && <button type="button" onClick={clearFilters} className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-teal-900 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-lime-300"><X className="size-4" aria-hidden="true" /> Clear filters</button>}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8" aria-labelledby="results-heading">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-800 dark:text-lime-300">Explore opportunities</p>
            <h2 id="results-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">Roles for your next chapter</h2>
            <p role="status" className="mt-2 text-sm text-stone-600 dark:text-stone-300">{jobs.length} {jobs.length === 1 ? 'role' : 'roles'} found <span className="text-stone-400">·</span> Preview listings for design review</p>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300">
            Sort by
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-11 rounded-xl border border-stone-300 bg-white px-3 font-semibold text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-50">
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="salary">Highest salary</option>
            </select>
          </label>
        </div>

        {jobs.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job, index) => (
              <Link key={job.id} href={`/jobs/${job.slug}`} className="group flex min-h-72 flex-col rounded-3xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-900/5 transition duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-950/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:p-6 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-lime-500 dark:hover:shadow-black/30">
                <div className="flex items-start justify-between gap-3">
                  <span className={`inline-flex size-12 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold ${markColors[index % markColors.length]}`} aria-hidden="true">{job.company.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span>
                  <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-200">{job.workMode}</span>
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-lime-300">{job.sector}</p>
                <h3 className="mt-1 text-xl font-bold leading-snug tracking-tight text-stone-950 group-hover:text-teal-900 dark:text-stone-50 dark:group-hover:text-lime-300">{job.title}</h3>
                <p className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-300">{job.company}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-200"><MapPin className="size-3.5 text-teal-700 dark:text-lime-300" aria-hidden="true" />{job.location}</span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-200"><BriefcaseBusiness className="size-3.5 text-teal-700 dark:text-lime-300" aria-hidden="true" />{typeNames[job.jobType[0]]}</span>
                  <span className="rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-200">{experienceNames[job.experienceLevel]}</span>
                </div>
                <div className="mt-auto flex items-end justify-between gap-3 border-t border-stone-200 pt-5 dark:border-stone-700">
                  <div><p className="text-xs text-stone-500 dark:text-stone-400">Monthly salary</p><p className="mt-1 text-sm font-bold text-teal-950 dark:text-lime-300">{formatNaira(job.salaryMin)} – {formatNaira(job.salaryMax)}</p></div>
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-900 text-white transition group-hover:bg-lime-400 group-hover:text-teal-950 dark:bg-lime-400 dark:text-stone-950" aria-label={`View ${job.title}`}><ArrowUpRight className="size-5" aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center dark:border-stone-700 dark:bg-stone-900">
            <Search className="mx-auto size-8 text-teal-800 dark:text-lime-300" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-bold">No roles match those filters</h3>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">Try a different keyword, location, or job type.</p>
            <button type="button" onClick={clearFilters} className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-teal-900 px-5 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-lime-400 dark:text-stone-950">Clear filters</button>
          </div>
        )}
      </section>
    </div>
  )
}
