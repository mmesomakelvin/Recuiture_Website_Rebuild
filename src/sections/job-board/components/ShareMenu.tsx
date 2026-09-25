import { useEffect, useRef, useState } from 'react'
import { Check, Link2, Linkedin, MessageCircle, Share2 } from 'lucide-react'
import type { ShareChannel } from '@/../product/sections/job-board/types'

interface ShareMenuProps {
  onShare?: (channel: ShareChannel) => void
}

const CHANNELS: { channel: ShareChannel; label: string; icon: typeof Link2 }[] = [
  { channel: 'copy-link', label: 'Copy link', icon: Link2 },
  { channel: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { channel: 'linkedin', label: 'LinkedIn', icon: Linkedin },
]

export function ShareMenu({ onShare }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const share = (channel: ShareChannel) => {
    setIsOpen(false)
    if (channel === 'copy-link') setCopied(true)
    onShare?.(channel)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Share this job"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-300 text-stone-700 transition-colors hover:border-teal-800 hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:border-stone-700 dark:text-stone-300 dark:hover:border-teal-400 dark:hover:text-teal-200"
      >
        {copied ? <Check className="h-5 w-5 text-teal-700 dark:text-teal-300" /> : <Share2 className="h-5 w-5" />}
      </button>

      {copied && (
        <span
          role="status"
          className="absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-stone-100 dark:text-stone-900"
        >
          Link copied
        </span>
      )}

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-stone-200 bg-white p-1.5 shadow-xl shadow-stone-900/10 dark:border-stone-700 dark:bg-stone-900 dark:shadow-black/40"
        >
          {CHANNELS.map(({ channel, label, icon: Icon }) => (
            <button
              key={channel}
              type="button"
              role="menuitem"
              onClick={() => share(channel)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-stone-700 transition-colors hover:bg-stone-100 hover:text-teal-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-teal-200"
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
