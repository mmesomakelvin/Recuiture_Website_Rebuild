'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Menu } from 'lucide-react'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 lg:px-8">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-stone-950 focus:outline-2 focus:outline-teal-700">Skip to content</a>
      <nav className="relative mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 rounded-2xl border border-stone-200/80 bg-white/85 px-4 shadow-lg shadow-stone-900/5 backdrop-blur-xl sm:px-6 dark:border-stone-700/80 dark:bg-stone-900/85 dark:shadow-black/20" aria-label="Main navigation" onKeyDown={(event) => { if (event.key === 'Escape') setMenuOpen(false) }}>
        <Link href="/" className="inline-flex min-h-11 shrink-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700" aria-label="Recruiture home">
          <Image src="/brand/recruiture-color.svg" alt="Recruiture by EduBridge Academy" width={356} height={78} priority className="h-auto w-36 sm:w-56 dark:hidden" />
          <Image src="/brand/recruiture-white.svg" alt="Recruiture by EduBridge Academy" width={356} height={78} priority className="hidden h-auto w-36 sm:w-56 dark:block" />
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          <Link href="/jobs" className="rounded text-sm font-medium text-stone-700 transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-200 dark:hover:text-teal-300">Find jobs</Link>
          <Link href="/#how-it-works" className="rounded text-sm font-medium text-stone-700 transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-200 dark:hover:text-teal-300">How it works</Link>
          <Link href="/#employers" className="rounded text-sm font-medium text-stone-700 transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-200 dark:hover:text-teal-300">For employers</Link>
          <Link href="/about" className="rounded text-sm font-medium text-stone-700 transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-200 dark:hover:text-teal-300">About us</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/jobs" className="hidden min-h-11 items-center justify-center gap-1.5 rounded-xl bg-teal-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:inline-flex sm:px-5 dark:bg-lime-500 dark:text-stone-950 dark:hover:bg-lime-400">
            Explore jobs <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div className="lg:hidden">
            <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-200 px-3 text-sm font-semibold text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:border-stone-700 dark:text-stone-100">
              <Menu className="h-5 w-5" aria-hidden="true" /><span className="hidden sm:inline">Menu</span>
            </button>
            {menuOpen && <div id="mobile-navigation" className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 rounded-2xl border border-stone-200 bg-white/95 p-3 shadow-xl backdrop-blur-xl dark:border-stone-700 dark:bg-stone-900/95">
              <Link href="/jobs" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-stone-800 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-100 dark:hover:bg-stone-800">Find jobs</Link>
              <Link href="/#how-it-works" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-stone-800 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-100 dark:hover:bg-stone-800">How it works</Link>
              <Link href="/#employers" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-stone-800 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-100 dark:hover:bg-stone-800">For employers</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-stone-800 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-stone-100 dark:hover:bg-stone-800">About us</Link>
            </div>}
          </div>
        </div>
      </nav>
    </header>
  )
}
