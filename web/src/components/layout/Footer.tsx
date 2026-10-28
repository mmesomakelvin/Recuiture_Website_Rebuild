import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 text-stone-950 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-lg text-lg font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-teal-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-lg font-bold text-white" aria-hidden="true">R</span>
            <span>Recruiture<span className="text-amber-500">.</span></span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-600 dark:text-stone-300">Connecting people and opportunities across Nigeria. A recruitment platform by EduBridge Academy.</p>
        </div>
        <nav aria-label="Explore Recruiture">
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm text-stone-600 dark:text-stone-300">
            <li><Link href="/jobs" className="hover:text-teal-800 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700 dark:hover:text-teal-300">Find jobs</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-teal-800 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700 dark:hover:text-teal-300">How it works</Link></li>
            <li><Link href="/#employers" className="hover:text-teal-800 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700 dark:hover:text-teal-300">For employers</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold">Built for better hiring</h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-600 dark:text-stone-300">For candidates, employers, and the EduBridge Academy community.</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-stone-200 px-4 py-6 text-sm text-stone-500 sm:px-6 lg:px-8 dark:border-stone-700 dark:text-stone-400">
        © {new Date().getFullYear()} Recruiture by EduBridge Academy.
      </div>
    </footer>
  )
}
