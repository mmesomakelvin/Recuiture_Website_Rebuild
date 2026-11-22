import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Briefcase, MapPin, Search, ShieldCheck, UsersRound } from 'lucide-react'
import { CountUp } from '@/components/landing/CountUp'
import { HeroWindow } from '@/components/landing/HeroWindow'
import { Reveal } from '@/components/landing/Reveal'
import { Statement } from '@/components/landing/Statement'
import { Steps } from '@/components/landing/Steps'

const sampleRoles = [
  { initials: 'PS', company: 'Paystream Technologies', field: 'Fintech', title: 'Data Analyst', summary: 'Turn business data into useful decisions for a growing payments team.', location: 'Lagos', mode: 'Hybrid', salary: '₦350k to ₦500k / month', tone: 'bg-amber-300 text-teal-950' },
  { initials: 'LH', company: 'Lumen Health Nigeria', field: 'Health tech', title: 'Frontend Developer', summary: 'Build accessible tools that support healthcare teams.', location: 'Remote', mode: 'Remote', salary: '₦700k to ₦1.1m / month', tone: 'bg-teal-700 text-white' },
  { initials: 'GA', company: 'Greenfield Agro', field: 'Agriculture', title: 'HR Associate', summary: 'Help people and operations grow together.', location: 'Ibadan', mode: 'On-site', salary: '₦220k to ₦300k / month', tone: 'bg-emerald-700 text-white' },
]

const sectors = ['Fintech', 'Health tech', 'Agriculture', 'Logistics', 'Education', 'Media', 'Retail', 'Energy', 'Manufacturing', 'Design', 'Banking', 'Hospitality']

const promises = [
  { value: 7, unit: 'days', label: 'Our target for a first review of every application.' },
  { value: 5, unit: 'business days', label: 'The longest you wait for news after an interview.' },
  { value: 6, unit: 'stages', label: 'From Applied to Hired, each one dated in your tracker.' },
  { value: 1, unit: 'email', label: 'For every real change, so every update means something.' },
]

const primaryButton =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-900 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700'
const secondaryButton =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-7 py-3 text-sm font-semibold text-stone-900 transition-colors hover:border-teal-700 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700'

/** One line of the hero headline, rising out of a mask on load */
function RiseLine({ children, delay, className = '' }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className="block overflow-hidden pb-1">
      <span className={`block animate-rise motion-reduce:animate-none ${className}`} style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  )
}

export default function LandingPage() {
  return (
    <div className="bg-white text-stone-950">
      {/* Hero */}
      <section className="px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-16 lg:pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-semibold text-teal-900 motion-reduce:animate-none">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-700" aria-hidden="true" />
            Recruitment by EduBridge Academy
          </p>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <RiseLine delay={100}>Find the right role.</RiseLine>
            <RiseLine delay={220} className="text-teal-800">
              Hear back at every step.
            </RiseLine>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-base leading-relaxed text-stone-600 [animation-delay:350ms] motion-reduce:animate-none sm:text-lg">
            Recruiture connects ambitious people across Nigeria with real roles, and keeps every candidate updated from the day they apply to the day they hear yes.
          </p>
          <div className="mt-8 flex animate-fade-up flex-col justify-center gap-3 [animation-delay:450ms] motion-reduce:animate-none sm:flex-row">
            <Link href="/jobs" className={primaryButton}>
              Explore jobs <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="#employers" className={secondaryButton}>
              Hire with EduBridge <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="How an application looks on Recruiture" className="pb-16 lg:pb-24">
        <HeroWindow />
      </section>

      {/* Sectors */}
      <section aria-label="Sectors hiring on Recruiture" className="border-y border-stone-100 py-8">
        <p className="text-center text-sm text-stone-500">Roles from teams across Nigeria, in every kind of work</p>
        <div className="group relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <ul className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...sectors, ...sectors].map((sector, index) => (
              <li
                key={`${sector}-${index}`}
                aria-hidden={index >= sectors.length}
                className="whitespace-nowrap rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:border-teal-700 hover:text-teal-800"
              >
                {sector}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Statement */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <Statement text="Every application gets an answer. Each stage is dated in your tracker, and we email you the moment it changes. No more silence after you press apply." />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold text-teal-700">How it works</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">From search to signed, in four clear steps.</h2>
          </Reveal>
          <div className="mt-14">
            <Steps />
          </div>
        </div>
      </section>

      {/* Sample roles */}
      <section id="explore-roles" className="scroll-mt-24 border-t border-stone-100 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-teal-700">On the job board</p>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Opportunities worth a closer look.</h2>
              <p className="mt-3 text-base leading-relaxed text-stone-600">A preview of how roles appear on Recruiture. These are sample listings for the design.</p>
            </div>
            <Link href="/jobs" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-teal-800 underline decoration-amber-400 decoration-2 underline-offset-4 hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-teal-700">
              Browse all jobs <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {sampleRoles.map((role, index) => (
              <Reveal key={role.title} delay={index * 100}>
                <article className="group flex h-full flex-col rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/5">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${role.tone}`}>{role.initials}</span>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{role.field}</span>
                  </div>
                  <p className="mt-6 text-sm text-stone-500">{role.company}</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight">{role.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">{role.summary}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium text-stone-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1">
                      <MapPin className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
                      {role.location}
                    </span>
                    <span className="rounded-full bg-stone-100 px-3 py-1">{role.mode}</span>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-stone-100 pt-5">
                    <p className="text-sm font-semibold tabular-nums text-teal-800">{role.salary}</p>
                    <Link href="/jobs" aria-label={`View the ${role.title} role`} className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-900 text-white transition-transform group-hover:translate-x-0.5 hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our promise in numbers */}
      <section className="border-t border-stone-100 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold text-teal-700">Our promise to candidates</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Clear timelines, written down.</h2>
          </Reveal>
          <dl className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((promise) => (
              <div key={promise.unit} className="bg-white p-7">
                <dt className="sr-only">{promise.unit}</dt>
                <dd>
                  <span className="flex items-baseline gap-2">
                    <span className="text-5xl font-semibold tracking-tight text-teal-900 sm:text-6xl">
                      <CountUp value={promise.value} />
                    </span>
                    <span className="text-sm font-semibold text-amber-700">{promise.unit}</span>
                  </span>
                  <span className="mt-4 block text-sm leading-relaxed text-stone-600">{promise.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* EduBridge band */}
      <section id="why" className="scroll-mt-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2rem] bg-teal-900 px-6 py-16 text-white sm:px-12 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-16 lg:py-20">
          <Reveal>
            <p className="text-sm font-semibold text-amber-300">Why Recruiture</p>
            <h2 className="mt-3 max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Talent deserves to be seen. Opportunities deserve to be real.</h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-teal-100">
              EduBridge Academy trains people in practical skills. Recruiture carries that work into hiring, so trained people get noticed and employers meet talent that is ready.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, title: 'Real openings', text: 'Every job is posted by the EduBridge team for a known company, with clear pay and deadlines.' },
              { icon: BadgeCheck, title: 'Trained talent', text: 'EduBridge Academy graduates bring skills built on real projects, not just a CV.' },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 120}>
                <div className="h-full rounded-2xl bg-white/10 p-6 ring-1 ring-inset ring-white/15">
                  <item.icon className="h-7 w-7 text-amber-300" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-teal-100">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section id="employers" className="scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative flex h-full min-h-[28rem] flex-col justify-end overflow-hidden rounded-[2rem] bg-teal-900 p-8 text-white sm:p-10">
              <Image src="/employer-conversation.webp" alt="A hiring manager talking through a report with a colleague" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/95 via-teal-950/60 to-teal-950/10" />
              <div className="relative">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300 text-teal-950">
                  <UsersRound className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-5 max-w-md text-balance text-3xl font-semibold tracking-tight">Hiring? Let our team find your people.</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-teal-50">Tell us who you need. We post the role, review every applicant and bring you a shortlist of people ready to contribute.</p>
                <Link href="mailto:recruiture@edubridgeacademy.com?subject=Hiring%20with%20Recruiture" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-amber-300 px-6 py-3 text-sm font-semibold text-teal-950 transition-colors hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200">
                  Talk to our team <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative flex h-full min-h-[28rem] flex-col justify-end overflow-hidden rounded-[2rem] bg-amber-100 p-8 sm:p-10">
              <Image src="/team-collaboration.webp" alt="Two colleagues smiling as they review work on a tablet" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-[60%_30%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-white/0" />
              <div className="relative">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-900 text-white">
                  <Briefcase className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-5 max-w-md text-balance text-3xl font-semibold tracking-tight text-stone-900">Looking for work? Start with one search.</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-600">Browse live roles across Nigeria, apply with your saved CV and follow every update in one place.</p>
                <Link href="/jobs" className={`${primaryButton} mt-7`}>
                  <Search className="h-4 w-4" aria-hidden="true" /> Explore jobs
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
