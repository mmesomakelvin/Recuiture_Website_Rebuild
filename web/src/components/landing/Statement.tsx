'use client'

import { useEffect, useRef, useState } from 'react'

/** A large statement whose words brighten one by one as it scrolls through the screen. */
export function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [lit, setLit] = useState(0)
  const words = text.split(' ')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    const update = () => {
      frame = 0
      const element = ref.current
      if (!element) return
      if (reduced) {
        setLit(words.length)
        return
      }
      const rect = element.getBoundingClientRect()
      const viewport = window.innerHeight
      const share = (viewport * 0.85 - rect.top) / (rect.height + viewport * 0.3)
      setLit(Math.round(Math.min(1, Math.max(0, share)) * words.length))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const first = window.setTimeout(update, 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(first)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [words.length])

  return (
    <p ref={ref} className="text-balance text-3xl font-semibold leading-snug tracking-tight sm:text-4xl lg:text-5xl lg:leading-tight">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={index} className={`transition-colors duration-300 ${index < lit ? 'text-stone-900' : 'text-stone-200'}`}>
            {word}{' '}
          </span>
        ))}
      </span>
    </p>
  )
}
