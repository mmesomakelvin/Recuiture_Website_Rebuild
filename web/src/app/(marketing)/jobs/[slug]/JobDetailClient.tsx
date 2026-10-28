'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CalendarDays, Check, MapPin, Share2 } from 'lucide-react'
import type { PreviewJob } from '@/lib/jobs/mock-jobs'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

const formatNaira = (amount: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)

const typeNames: Record<string, string> = { FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship' }
const experienceNames: Record<string, string> = { ENTRY: 'Entry level', MID: 'Mid level', SENIOR: 'Senior' }

export default function JobDetail({ job }: { job: PreviewJob }) {
  const [showApply, setShowApply] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareJob = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: `${job.title} at ${job.company}`, url }) } catch { /* User cancelled sharing. */ }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch { setCopied(false) }
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950 dark:bg-stone-950 dark:text-stone-50">
      <section className="bg-teal-950 pb-24 pt-10 text-white sm:pt-14 dark:bg-stone-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link href="/jobs" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-teal-100 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"><ArrowLeft className="size-4" aria-hidden="true" /> Back to jobs</Link>
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-lime-300">{job.sector} <span className="mx-2 text-teal-400">/</span> Preview opportunity</p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{job.title}</h1>
              <p className="mt-3 text-lg font-semibold text-teal-100">{job.company}</p>
              <div className="mt-6 flex flex-wrap gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-700 bg-teal-900 px-3 py-2"><MapPin className="size-4 text-lime-300" aria-hidden="true" /> {job.location}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-700 bg-teal-900 px-3 py-2"><BriefcaseBusiness className="size-4 text-lime-300" aria-hidden="true" /> {typeNames[job.jobType[0]]} · {job.workMode}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-700 bg-teal-900 px-3 py-2"><CalendarDays className="size-4 text-lime-300" aria-hidden="true" /> {experienceNames[job.experienceLevel]}</span>
              </div>
            </div>
            <button type="button" onClick={shareJob} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-teal-500 px-4 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300">{copied ? <Check className="size-4" aria-hidden="true" /> : <Share2 className="size-4" aria-hidden="true" />}{copied ? 'Link copied' : 'Share role'}</button>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-12 grid max-w-6xl gap-7 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
        <div className="space-y-5">
          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 dark:border-stone-700 dark:bg-stone-900">
            <h2 className="text-2xl font-bold tracking-tight">About the role</h2>
            <p className="mt-4 leading-7 text-stone-700 dark:text-stone-300">{job.description}</p>
          </article>
          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 dark:border-stone-700 dark:bg-stone-900">
            <h2 className="text-xl font-bold">What you will do</h2>
            <p className="mt-3 leading-7 text-stone-700 dark:text-stone-300">{job.responsibilities}</p>
          </article>
          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 dark:border-stone-700 dark:bg-stone-900">
            <h2 className="text-xl font-bold">What you bring</h2>
            <p className="mt-3 leading-7 text-stone-700 dark:text-stone-300">{job.requirements}</p>
            <div className="mt-5 flex flex-wrap gap-2">{job.skills.map((skill) => <span key={skill} className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-900 dark:bg-teal-900 dark:text-lime-200">{skill}</span>)}</div>
          </article>
          <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 dark:border-stone-700 dark:bg-stone-900">
            <h2 className="text-xl font-bold">Benefits</h2>
            <p className="mt-3 leading-7 text-stone-700 dark:text-stone-300">{job.benefits}</p>
          </article>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-lg shadow-stone-900/5 dark:border-stone-700 dark:bg-stone-900">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-lime-300">Role at a glance</p>
            <p className="mt-4 text-2xl font-bold tracking-tight text-teal-950 dark:text-stone-50">{formatNaira(job.salaryMin)} – {formatNaira(job.salaryMax)}</p>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Estimated monthly salary · preview data</p>
            <dl className="mt-6 divide-y divide-stone-200 text-sm dark:divide-stone-700">
              <div className="flex justify-between gap-3 py-3"><dt className="text-stone-500 dark:text-stone-400">Location</dt><dd className="text-right font-semibold">{job.location}</dd></div>
              <div className="flex justify-between gap-3 py-3"><dt className="text-stone-500 dark:text-stone-400">Work mode</dt><dd className="font-semibold">{job.workMode}</dd></div>
              <div className="flex justify-between gap-3 py-3"><dt className="text-stone-500 dark:text-stone-400">Job type</dt><dd className="font-semibold">{typeNames[job.jobType[0]]}</dd></div>
              <div className="flex justify-between gap-3 py-3"><dt className="text-stone-500 dark:text-stone-400">Experience</dt><dd className="font-semibold">{experienceNames[job.experienceLevel]}</dd></div>
            </dl>
            <button type="button" onClick={() => setShowApply(true)} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-900 px-5 text-sm font-bold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-lime-400 dark:text-stone-950 dark:hover:bg-lime-300">Apply for this role <ArrowRight className="size-4" aria-hidden="true" /></button>
            <p className="mt-3 text-center text-xs leading-5 text-stone-500 dark:text-stone-400">This is a design preview. Applications are not open yet.</p>
          </div>
          <Link href="/jobs" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-teal-900 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-lime-300">Explore more roles <ArrowRight className="size-4" aria-hidden="true" /></Link>
        </aside>
      </div>

      <Dialog open={showApply} onOpenChange={setShowApply}>
        <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-md rounded-3xl border-stone-200 bg-white p-6 text-stone-950 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50 sm:p-8">
          <DialogTitle className="pr-8 text-xl font-bold">Applications opening soon</DialogTitle>
          <DialogDescription className="leading-7 text-stone-600 dark:text-stone-300">This opportunity is part of the Recruiture design preview. You can explore the role now; applications will become available when the platform launches.</DialogDescription>
          <button type="button" onClick={() => setShowApply(false)} className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-teal-900 px-5 text-sm font-bold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-lime-400 dark:text-stone-950">Got it</button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
