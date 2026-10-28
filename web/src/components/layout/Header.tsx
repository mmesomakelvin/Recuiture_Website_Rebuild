import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/95">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-stone-950 focus:outline-2 focus:outline-teal-700">Skip to content</a>
      <nav className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700" aria-label="Recruiture home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-lg font-bold text-white" aria-hidden="true">R</span>
          <span className="text-lg font-semibold tracking-tight text-stone-950 dark:text-stone-50">Recruiture<span className="text-amber-500">.</span></span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/jobs" className="rounded text-sm font-medium text-stone-700 transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-200 dark:hover:text-teal-300">Find jobs</Link>
          <Link href="/#how-it-works" className="rounded text-sm font-medium text-stone-700 transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-200 dark:hover:text-teal-300">How it works</Link>
          <Link href="/#employers" className="rounded text-sm font-medium text-stone-700 transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-200 dark:hover:text-teal-300">For employers</Link>
        </div>
        <Link href="/jobs" className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:px-5 dark:bg-teal-500 dark:text-stone-950 dark:hover:bg-teal-400">
          Explore jobs <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </nav>
    </header>
  )
}
