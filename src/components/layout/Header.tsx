'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2" aria-label="Recruiture Home">
            <span className="text-2xl font-bold text-zinc-900">Recruiture</span>
          </Link>
          <div className="hidden md:flex md:gap-6">
            <Link href="/jobs" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors">
              Jobs
            </Link>
            <Link href="/companies" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors">
              Companies
            </Link>
            <Link href="/about" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors">
              About
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}