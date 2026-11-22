'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { BadgeCheck, CalendarCheck, Mail, MapPin, Send } from 'lucide-react'

// Sample updates the window cycles through. They show the product, not real people.
const UPDATES = [
  {
    chip: 'Applied',
    icon: Send,
    title: 'Application sent',
    text: 'Data Analyst at Paystream Technologies. Expect a first update by Friday.',
    step: 0,
  },
  {
    chip: 'Screening',
    icon: BadgeCheck,
    title: 'Moved to Screening',
    text: 'The hiring team is reviewing your application. We emailed you about it.',
    step: 1,
  },
  {
    chip: 'Interview',
    icon: CalendarCheck,
    title: 'Invited to interview',
    text: 'Thursday at 10:00, Lekki office. The details are in your email.',
    step: 2,
  },
]

const STEPS = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired']
const ROTATE_MS = 4200

/**
 * The hero "window": a framed photo that opens out as the page scrolls, with
 * product cards floating inside it. The update card rotates through stages and
 * pauses while hovered.
 */
export function HeroWindow() {
  const frameRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  // Open the window as the visitor scrolls (fully open straight away for reduced motion)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    const update = () => {
      frame = 0
      setProgress(reduced ? 1 : Math.min(1, Math.max(0, window.scrollY / 420)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const first = window.setTimeout(update, 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(first)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Rotate the update card
  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => setActive((index) => (index + 1) % UPDATES.length), ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [paused])

  const update = UPDATES[active]
  const Icon = update.icon

  return (
    <div
      ref={frameRef}
      className="mx-auto max-w-[1400px] px-[var(--inset)] transition-[padding] duration-150 ease-out"
      style={{ '--inset': `${(1 - progress) * 3}vw` } as React.CSSProperties}
    >
      <div
        className="relative overflow-hidden bg-teal-900 shadow-2xl shadow-teal-950/20"
        style={{ borderRadius: `${32 - progress * 12}px` }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/8]">
          <Image
            src="/hero-candidate.webp"
            alt="A young Nigerian professional at her laptop in a bright office"
            fill
            priority
            sizes="(max-width: 1400px) 94vw, 1400px"
            className="object-cover object-[50%_30%] transition-transform duration-300 ease-out"
            style={{ transform: `scale(${1.08 - progress * 0.08})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-teal-950/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-teal-950/55" />

          {/* Job card */}
          <div className="absolute bottom-4 left-4 right-4 animate-fade-up rounded-2xl bg-white p-4 shadow-xl [animation-delay:500ms] motion-reduce:animate-none sm:bottom-8 sm:left-8 sm:right-auto sm:w-80">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-300 text-sm font-bold text-teal-950">PT</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-900">Data Analyst</p>
                <p className="text-xs text-stone-500">Paystream Technologies</p>
              </div>
              <span className="ml-auto rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800">Hybrid</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-stone-100 pt-3">
              <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                Lekki, Lagos
              </span>
              <span className="text-xs font-semibold tabular-nums text-teal-800">₦350,000 to ₦500,000 / month</span>
            </div>
          </div>

          {/* Rotating update card */}
          <div className="absolute right-4 top-4 hidden w-[22rem] animate-fade-up [animation-delay:800ms] motion-reduce:animate-none sm:right-8 sm:top-8 sm:block">
            <div className="rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur" aria-live="polite">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-stone-500">Your application</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                  <Mail className="h-3 w-3" aria-hidden="true" />
                  Emailed
                </span>
              </div>
              <div key={active} className="mt-3 flex animate-fade-up gap-3 motion-reduce:animate-none">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{update.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-stone-600">{update.text}</p>
                </div>
              </div>
              <ol className="mt-4 flex items-center" aria-label="Application progress">
                {STEPS.map((step, index) => (
                  <li key={step} className={`flex items-center ${index === STEPS.length - 1 ? '' : 'flex-1'}`}>
                    <span
                      title={step}
                      className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-500 ${index <= update.step ? 'bg-teal-600' : 'bg-stone-200'} ${
                        index === update.step ? 'ring-4 ring-teal-600/20' : ''
                      }`}
                    />
                    {index < STEPS.length - 1 && (
                      <span className={`mx-1 h-0.5 flex-1 rounded-full transition-colors duration-500 ${index < update.step ? 'bg-teal-600' : 'bg-stone-200'}`} />
                    )}
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              {UPDATES.map((item, index) => (
                <button
                  key={item.chip}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={index === active}
                  className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    index === active ? 'bg-white text-teal-900' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {item.chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
