import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Check, FileText, Search, ShieldCheck, UsersRound } from 'lucide-react'

const steps = [
  { number: '01', icon: Search, title: 'Find a role that fits', description: 'Explore opportunities by role, location, and the way you want to work.' },
  { number: '02', icon: FileText, title: 'Apply with confidence', description: 'Put your experience forward with a straightforward application.' },
  { number: '03', icon: BadgeCheck, title: 'Stay in the loop', description: 'Follow your applications as employers move through the hiring process.' },
]

const linkButton = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-stone-950 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-teal-500 dark:text-stone-950 dark:hover:bg-teal-400'

export default function LandingPage() {
  return (
    <div className="bg-white text-stone-950 dark:bg-stone-950 dark:text-stone-50">
      <section className="overflow-hidden bg-stone-50 px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-teal-800 dark:border-teal-800 dark:bg-stone-900 dark:text-teal-200">
              <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />Recruiture by EduBridge Academy
            </p>
            <h1 className="mt-7 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
              Connecting great people with <span className="text-teal-700 dark:text-teal-400">meaningful opportunities.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg dark:text-stone-300">
              Find your next role or the talent to move your team forward. A clearer path to work and hiring in Nigeria starts here.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/jobs" className={linkButton}>Explore jobs <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="#how-it-works" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-7 py-3 text-sm font-semibold text-stone-900 transition-colors hover:border-teal-700 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-teal-400">
                How it works <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-3 sm:mt-16 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 lg:gap-4" aria-label="Recruiture for candidates and employers">
            <div className="relative min-h-80 overflow-hidden rounded-3xl bg-stone-200 sm:min-h-96 lg:col-span-5 lg:row-span-2 lg:min-h-[530px]">
              <Image src="/recruiture-people.png" alt="Nigerian professional working at her laptop" fill priority sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 42vw" className="object-cover object-left" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 shadow-sm backdrop-blur-sm sm:inset-x-6 sm:bottom-6 dark:bg-stone-900/95">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"><BriefcaseBusiness className="h-5 w-5" aria-hidden="true" /></span>
                  <div><p className="text-sm font-semibold">Your next chapter starts here</p><p className="text-xs text-stone-600 dark:text-stone-300">Discover work that matches your ambition.</p></div>
                </div>
              </div>
            </div>
            <div className="flex min-h-64 flex-col justify-between rounded-3xl bg-amber-100 p-6 sm:min-h-72 lg:col-span-3 lg:p-7 dark:bg-amber-950">
              <div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-700 dark:bg-stone-900 dark:text-amber-300"><Search className="h-5 w-5" aria-hidden="true" /></span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-amber-900 dark:text-amber-200">For job seekers</p>
                <h2 className="mt-2 max-w-52 text-2xl font-semibold leading-tight tracking-tight">A search with more possibility.</h2>
              </div>
              <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm dark:bg-stone-900">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0"><p className="text-xs font-medium text-stone-500 dark:text-stone-400">Explore opportunities</p><p className="mt-1 truncate text-sm font-semibold">Your next role</p></div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white"><ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </div>
              </div>
            </div>
            <div className="relative min-h-64 overflow-hidden rounded-3xl bg-stone-200 sm:min-h-72 lg:col-span-4">
              <Image src="/recruiture-people.png" alt="Nigerian colleagues collaborating over a tablet" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 34vw" className="object-cover object-right" />
            </div>
            <div className="flex min-h-72 flex-col justify-between gap-6 rounded-3xl bg-stone-950 p-6 text-white sm:col-span-2 sm:flex-row sm:items-end sm:p-8 lg:col-span-7 lg:min-h-56 dark:bg-stone-800">
              <div className="max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">For employers</p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Build a team ready for what&apos;s next.</h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-300">Bring your roles, applicants, and hiring decisions into one clear process.</p>
              </div>
              <div className="w-full shrink-0 rounded-2xl bg-white p-4 text-stone-950 sm:w-56">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold"><span>Hiring, made clearer</span><UsersRound className="h-4 w-4 text-teal-700" aria-hidden="true" /></div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-2 text-xs"><Check className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" /> Find the right people</div>
                  <div className="flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-2 text-xs"><Check className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" /> Keep hiring moving</div>
                </div>
                <Link href="#employers" className="mt-4 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-teal-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700">Learn more <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400">A simpler way forward</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">A smooth process, from search to next step.</h2>
            <p className="mt-5 text-base leading-relaxed text-stone-600 dark:text-stone-300">Spend less time guessing and more time moving toward the right opportunity.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-3xl border border-stone-200 bg-stone-50 p-7 dark:border-stone-800 dark:bg-stone-900">
                <div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"><step.icon className="h-5 w-5" aria-hidden="true" /></span><span className="text-xs font-semibold text-stone-400">{step.number}</span></div>
                <h3 className="mt-8 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="scroll-mt-24 bg-teal-900 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24 dark:bg-teal-950">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div><p className="text-xs font-semibold uppercase tracking-widest text-amber-300">Why Recruiture</p><h2 className="mt-4 max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">Talent deserves to be seen. Opportunities deserve to be real.</h2></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-teal-700 bg-teal-800/60 p-6 dark:border-teal-800 dark:bg-teal-900/60"><ShieldCheck className="h-7 w-7 text-amber-300" aria-hidden="true" /><h3 className="mt-5 text-lg font-semibold">More confidence</h3><p className="mt-2 text-sm leading-relaxed text-teal-100">Verified companies and clear role information help candidates focus on genuine openings.</p></div>
            <div className="rounded-2xl border border-teal-700 bg-teal-800/60 p-6 dark:border-teal-800 dark:bg-teal-900/60"><BadgeCheck className="h-7 w-7 text-amber-300" aria-hidden="true" /><h3 className="mt-5 text-lg font-semibold">More visibility</h3><p className="mt-2 text-sm leading-relaxed text-teal-100">EduBridge Academy graduates can show the training behind their skills with a verified badge.</p></div>
          </div>
        </div>
      </section>

      <section id="employers" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-3xl bg-amber-100 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center lg:p-16 dark:bg-amber-950">
          <div><p className="text-xs font-semibold uppercase tracking-widest text-amber-900 dark:text-amber-200">Hiring teams</p><h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Better hiring starts with a clearer view of talent.</h2><p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-700 dark:text-stone-200">Recruiture helps employers bring applications together, review candidates, and move each person through a thoughtful hiring process.</p></div>
          <Link href="/jobs" className={linkButton}>View the job board <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  )
}
