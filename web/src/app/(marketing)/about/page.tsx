import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Search, UsersRound } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About us',
  description: 'Learn about Recruiture, the recruitment platform by EduBridge Academy connecting people and employers across Nigeria.',
}

const audiences = [
  {
    icon: Search,
    label: 'For job seekers',
    title: 'A clearer way to find your next role',
    description: 'Explore relevant opportunities, understand what each role asks for, and keep track of your applications in one place.',
  },
  {
    icon: BriefcaseBusiness,
    label: 'For employers',
    title: 'A simpler way to build a team',
    description: 'Share vacancies, review candidates, and keep hiring decisions moving with a process your team can follow.',
  },
  {
    icon: BadgeCheck,
    label: 'For EduBridge graduates',
    title: 'Skills with a story behind them',
    description: 'Verified EduBridge Academy graduates can show the programme they completed alongside their experience.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-white text-stone-950 dark:bg-stone-950 dark:text-stone-50">
      <section className="overflow-hidden bg-stone-50 px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20 dark:bg-stone-950">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-900 dark:border-teal-800 dark:bg-stone-900 dark:text-lime-300">
              <span className="size-2 rounded-full bg-lime-500" aria-hidden="true" /> About Recruiture
            </p>
            <h1 className="mt-7 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Better hiring starts with <span className="text-teal-800 dark:text-lime-400">better connections.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-stone-700 sm:text-lg dark:text-stone-300">Recruiture is a recruitment platform by EduBridge Academy, built to help people discover meaningful work and help organisations find qualified talent across Nigeria.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-900 px-6 text-sm font-bold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-lime-400 dark:text-stone-950 dark:hover:bg-lime-300">Explore jobs <ArrowRight className="size-4" aria-hidden="true" /></Link>
              <Link href="/#employers" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 text-sm font-bold text-teal-900 hover:border-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:border-stone-700 dark:bg-stone-900 dark:text-lime-300">Hire with Recruiture <ArrowRight className="size-4" aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-3xl bg-stone-200 sm:min-h-[440px] lg:min-h-[520px]">
            <Image src="/employer-conversation.webp" alt="Professionals discussing information together" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-xs dark:bg-stone-900/95">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-teal-900 dark:bg-lime-900 dark:text-lime-200"><UsersRound className="size-5" aria-hidden="true" /></span>
              <p className="text-sm font-semibold leading-6">People, potential, and opportunity in one place.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="who-we-serve">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800 dark:text-lime-300">Who we serve</p>
            <h2 id="who-we-serve" className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">One platform. More ways forward.</h2>
            <p className="mt-4 leading-7 text-stone-600 dark:text-stone-300">Recruiture brings candidates, employers, and the EduBridge community into a clearer recruitment process.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {audiences.map((audience) => (
              <article key={audience.label} className="rounded-3xl border border-stone-200 bg-stone-50 p-7 dark:border-stone-800 dark:bg-stone-900">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-lime-300"><audience.icon className="size-6" aria-hidden="true" /></span>
                <p className="mt-7 text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-lime-300">{audience.label}</p>
                <h3 className="mt-2 text-xl font-bold leading-snug">{audience.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">{audience.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal-950 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24 dark:bg-stone-900">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-center lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">Powered by EduBridge Academy</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Learning and opportunity belong together.</h2>
          </div>
          <div>
            <p className="leading-8 text-teal-50/85">EduBridge Academy helps people build practical skills. Recruiture extends that work into recruitment: making it easier for trained people to be seen and for employers to connect with the talent they need.</p>
            <Link href="/jobs" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-lime-300 underline decoration-lime-300/60 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-lime-300">See the opportunities <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
