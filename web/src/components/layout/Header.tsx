import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 lg:px-8">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-stone-950 focus:outline-2 focus:outline-teal-700">Skip to content</a>
      <nav className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 rounded-2xl border border-stone-200/80 bg-white/85 px-4 shadow-lg shadow-stone-900/5 backdrop-blur-xl sm:px-6 dark:border-stone-700/80 dark:bg-stone-900/85 dark:shadow-black/20" aria-label="Main navigation">
        <Link href="/" className="inline-flex min-h-11 shrink-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700" aria-label="Recruiture home">
          <Image src="/brand/recruiture-color.svg" alt="Recruiture by EduBridge Academy" width={356} height={78} priority className="h-auto w-44 sm:w-56 dark:hidden" />
          <Image src="/brand/recruiture-white.svg" alt="Recruiture by EduBridge Academy" width={356} height={78} priority className="hidden h-auto w-44 sm:w-56 dark:block" />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/jobs" className="rounded text-sm font-medium text-stone-700 transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-200 dark:hover:text-teal-300">Find jobs</Link>
          <Link href="/#how-it-works" className="rounded text-sm font-medium text-stone-700 transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-200 dark:hover:text-teal-300">How it works</Link>
          <Link href="/#employers" className="rounded text-sm font-medium text-stone-700 transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-200 dark:hover:text-teal-300">For employers</Link>
        </div>
        <Link href="/jobs" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-teal-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:px-5 dark:bg-lime-500 dark:text-stone-950 dark:hover:bg-lime-400">
          <span className="sm:hidden">Jobs</span><span className="hidden sm:inline">Explore jobs</span> <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </nav>
    </header>
  )
}
