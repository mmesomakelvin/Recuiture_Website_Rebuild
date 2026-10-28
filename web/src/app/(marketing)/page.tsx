import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Check, FileText, MapPin, Search, ShieldCheck, UsersRound } from 'lucide-react'

const sampleRoles = [
  { initials: 'PS', company: 'Paystream Technologies', field: 'Fintech', title: 'Data Analyst', summary: 'Turn business data into useful decisions for a growing team.', location: 'Lagos', mode: 'Hybrid', salary: '₦350k–₦500k / month' },
  { initials: 'LH', company: 'Lumen Health Nigeria', field: 'Health tech', title: 'Frontend Developer', summary: 'Build accessible tools that support healthcare teams.', location: 'Remote', mode: 'Remote', salary: '₦700k–₦1.1m / month' },
  { initials: 'GA', company: 'Greenfield Agro', field: 'Agriculture', title: 'HR Associate', summary: 'Help people and operations grow together.', location: 'Ibadan', mode: 'On-site', salary: '₦220k–₦300k / month' },
]

const steps = [
  { number: '01', icon: Search, title: 'Find a role that fits', description: 'Explore opportunities by role, location, and the way you want to work.' },
  { number: '02', icon: FileText, title: 'Apply with confidence', description: 'Put your experience forward with a straightforward application.' },
  { number: '03', icon: BadgeCheck, title: 'Stay in the loop', description: 'Follow your applications as employers move through the hiring process.' },
]

const linkButton = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-900 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-lime-500 dark:text-stone-950 dark:hover:bg-lime-400'

export default function LandingPage() {
  return (
    <div className="bg-white text-stone-950 dark:bg-stone-950 dark:text-stone-50">
      <section className="overflow-hidden bg-stone-50 px-4 pb-16 pt-14 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-5xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-teal-800 dark:border-teal-800 dark:bg-stone-900 dark:text-teal-200">
              <span className="h-2 w-2 rounded-full bg-lime-500" aria-hidden="true" />Made for ambition, built for hiring
            </p>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find the right role. <span className="text-teal-800 dark:text-lime-400">Hire the right people.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg dark:text-stone-300">
              Recruiture connects ambitious people with opportunities and helps Nigerian businesses build teams ready to grow.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/jobs" className={linkButton}>Explore jobs <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="#employers" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-7 py-3 text-sm font-semibold text-stone-900 transition-colors hover:border-teal-700 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-teal-400">
                Hire talent <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 lg:gap-4" aria-label="Recruiture for candidates and employers">
            <div className="relative min-h-80 overflow-hidden rounded-3xl bg-stone-200 sm:min-h-96 lg:col-span-5 lg:row-span-2 lg:min-h-[530px]">
              <Image src="/recruiture-people.png" alt="Nigerian professional working at her laptop" fill priority sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 42vw" className="object-cover object-left" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 shadow-sm backdrop-blur-sm sm:inset-x-6 sm:bottom-6 dark:bg-stone-900/95">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"><BriefcaseBusiness className="h-5 w-5" aria-hidden="true" /></span>
                  <div><p className="text-sm font-semibold">Your next chapter starts here</p><p className="text-xs text-stone-600 dark:text-stone-300">Discover work that matches your ambition.</p></div>
                </div>
              </div>
            </div>
            <div className="flex min-h-64 flex-col justify-between rounded-3xl bg-lime-100 p-6 sm:min-h-72 lg:col-span-3 lg:p-7 dark:bg-lime-950">
              <div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-800 dark:bg-stone-900 dark:text-lime-300"><Search className="h-5 w-5" aria-hidden="true" /></span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-teal-900 dark:text-lime-200">For job seekers</p>
                <h2 className="mt-2 max-w-52 text-2xl font-semibold leading-tight tracking-tight">Make your next move count.</h2>
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
                <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">People who can move your business forward.</h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-300">Find work-ready talent and bring your hiring decisions into focus.</p>
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

      <section id="explore-roles" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-800 dark:text-lime-400">Explore what is possible</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Opportunities worth a closer look.</h2>
            <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-stone-300">A preview of how roles will appear on Recruiture. These are sample listings for the design.</p>
          </div>
          <div className="mt-11 grid gap-5 md:grid-cols-3">
            {sampleRoles.map((role) => (
              <article key={role.title} className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xs font-bold text-teal-900 dark:bg-teal-900 dark:text-lime-200">{role.initials}</span>
                  <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-teal-900 dark:bg-lime-900 dark:text-lime-100">{role.field}</span>
                </div>
                <p className="mt-5 text-xs font-semibold text-stone-500 dark:text-stone-400">{role.company}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{role.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600 dark:text-stone-300">{role.summary}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-stone-100 pt-4 text-xs font-medium text-stone-600 dark:border-stone-700 dark:text-stone-300">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-teal-700 dark:text-lime-400" aria-hidden="true" />{role.location}</span>
                  <span>{role.mode}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-teal-900 dark:text-lime-300">{role.salary}</p>
                  <Link href="/jobs" className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-lime-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-lime-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-lime-500 dark:text-stone-950 dark:hover:bg-lime-400">Explore jobs <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-9 text-center"><Link href="/jobs" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-teal-900 underline decoration-lime-500 underline-offset-4 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:text-lime-300">Browse the job board <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 bg-stone-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28 dark:bg-stone-950">
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
          <div><p className="text-xs font-semibold uppercase tracking-widest text-lime-300">Why Recruiture</p><h2 className="mt-4 max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">Talent deserves to be seen. Opportunities deserve to be real.</h2></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-teal-700 bg-teal-800/60 p-6 dark:border-teal-800 dark:bg-teal-900/60"><ShieldCheck className="h-7 w-7 text-lime-300" aria-hidden="true" /><h3 className="mt-5 text-lg font-semibold">More confidence</h3><p className="mt-2 text-sm leading-relaxed text-teal-100">Verified companies and clear role information help candidates focus on genuine openings.</p></div>
            <div className="rounded-2xl border border-teal-700 bg-teal-800/60 p-6 dark:border-teal-800 dark:bg-teal-900/60"><BadgeCheck className="h-7 w-7 text-lime-300" aria-hidden="true" /><h3 className="mt-5 text-lg font-semibold">More visibility</h3><p className="mt-2 text-sm leading-relaxed text-teal-100">EduBridge Academy graduates can show the training behind their skills with a verified badge.</p></div>
          </div>
        </div>
      </section>

      <section id="employers" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-lime-100 lg:grid-cols-2 dark:bg-lime-950">
          <div className="flex flex-col items-start justify-center p-8 sm:p-12 lg:p-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-900 dark:text-lime-200">For hiring teams</p>
            <h2 className="mt-4 max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Your next great hire starts with the right conversation.</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-700 dark:text-stone-200">Tell us who you need. Our recruiting team can help source, assess, and shortlist people who are ready to contribute.</p>
            <Link href="mailto:recruiture@edubridgeacademy.com?subject=Hiring%20with%20Recruiture" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-900 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-lime-500 dark:text-stone-950 dark:hover:bg-lime-400">Talk to our team <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div className="relative min-h-80 bg-stone-200 sm:min-h-96 lg:min-h-[460px]">
            <Image src="/employer-conversation.webp" alt="Professional discussing a report with a colleague" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
          </div>
        </div>
      </section>
    </div>
  )
}
