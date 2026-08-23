import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Footer() {
  const links = {
    product: [
      { label: 'Job Board', href: '/jobs' },
      { label: 'Companies', href: '/companies' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Candidate Portal', href: '/candidate' },
      { label: 'Employer Dashboard', href: '/employer' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' },
    ],
    resources: [
      { label: 'Help Center', href: '/help' },
      { label: 'Candidate Guide', href: '/guides/candidates' },
      { label: 'Employer Guide', href: '/guides/employers' },
      { label: 'API Docs', href: '/api-docs' },
      { label: 'Status', href: '/status' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' },
    ],
  }

  return (
    <footer className="border-t bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-zinc-900" aria-label="Recruiture Home">
              Recruiture
            </Link>
            <p className="mt-4 text-sm text-zinc-600">
              Connecting talent with opportunity. Building the future of recruitment.
            </p>
          </div>
          <nav aria-label="Product links">
            <h3 className="text-sm font-semibold text-zinc-900">Product</h3>
            <ul className="mt-4 space-y-3">
              {links.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company links">
            <h3 className="text-sm font-semibold text-zinc-900">Company</h3>
            <ul className="mt-4 space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Resource links">
            <h3 className="text-sm font-semibold text-zinc-900">Resources</h3>
            <ul className="mt-4 space-y-3">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal links">
            <h3 className="text-sm font-semibold text-zinc-900">Legal</h3>
            <ul className="mt-4 space-y-3">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Recruiture. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}