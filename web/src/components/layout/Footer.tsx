import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white text-stone-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-teal-700">
            <Image src="/brand/recruiture-color.svg" alt="Recruiture by EduBridge Academy" width={356} height={78} className="h-auto w-56" />
            <Image src="/brand/recruiture-white.svg" alt="Recruiture by EduBridge Academy" width={356} height={78} className="hidden h-auto w-56" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-600">Connecting people and opportunities across Nigeria. A recruitment platform by EduBridge Academy.</p>
        </div>
        <nav aria-label="Explore Recruiture">
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm text-stone-600">
            <li><Link href="/jobs" className="hover:text-teal-800 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700">Find jobs</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-teal-800 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700">How it works</Link></li>
            <li><Link href="/#employers" className="hover:text-teal-800 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700">For employers</Link></li>
            <li><Link href="/about" className="hover:text-teal-800 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700">About us</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold">Built for better hiring</h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-600">For candidates, employers, and the EduBridge Academy community.</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-stone-200 px-4 py-6 text-sm text-stone-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Recruiture by EduBridge Academy.
      </div>
    </footer>
  )
}
