import { useState } from 'react'
import type { WeeklyActivity } from '@/../product/sections/admin-portal/types'
import { formatDate } from './format'

// Series colours were checked for colour-blind separation and contrast on
// both the light (white) and dark (stone-900) card surfaces.
const SERIES = [
  { key: 'applications', label: 'Applications', stroke: 'stroke-teal-600', swatch: 'bg-teal-600' },
  { key: 'interviews', label: 'Moved to interview', stroke: 'stroke-amber-600', swatch: 'bg-amber-600' },
] as const

type SeriesKey = (typeof SERIES)[number]['key']

/** Smooth path through points (in a 0 to 100 box) using Catmull-Rom curves */
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`
  }
  return d
}

function niceMax(value: number) {
  return Math.max(20, Math.ceil(value / 20) * 20)
}

export function ActivityChart({ weeks }: { weeks: WeeklyActivity[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  if (weeks.length < 2) {
    return <p className="py-16 text-center text-sm text-stone-500 dark:text-stone-400">Not enough activity to chart yet.</p>
  }

  const max = niceMax(Math.max(...weeks.map((week) => Math.max(week.applications, week.interviews))))
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((share) => Math.round(max * share))
  const xFor = (index: number) => (index / (weeks.length - 1)) * 100
  const yFor = (value: number) => 100 - (value / max) * 100
  const pointsFor = (key: SeriesKey) => weeks.map((week, index) => ({ x: xFor(index), y: yFor(week[key]) }))

  const applicationsPath = smoothPath(pointsFor('applications'))
  const areaPath = `${applicationsPath} L 100 100 L 0 100 Z`
  const active = hovered ?? weeks.length - 1
  const activeWeek = weeks[active]

  const pickIndex = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const share = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width))
    setHovered(Math.round(share * (weeks.length - 1)))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') setHovered(Math.min(weeks.length - 1, active + 1))
    if (event.key === 'ArrowLeft') setHovered(Math.max(0, active - 1))
    if (event.key === 'Escape') setHovered(null)
  }

  const tooltipAlign = active === 0 ? 'translate-x-0' : active === weeks.length - 1 ? '-translate-x-full' : '-translate-x-1/2'

  return (
    <div>
      {/* Legend with the latest week's totals */}
      <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2">
        {SERIES.map((series) => (
          <div key={series.key} className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
            <span className={`h-1 w-5 rounded-full ${series.swatch}`} aria-hidden="true" />
            {series.label}
            <span className="font-semibold tabular-nums text-stone-900 dark:text-white">{activeWeek[series.key]}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        {/* Y axis */}
        <div className="relative h-56 w-7 shrink-0 text-right text-xs tabular-nums text-stone-400 dark:text-stone-500" aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick} className="absolute right-0 -translate-y-1/2" style={{ top: `${yFor(tick)}%` }}>
              {tick}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div
            role="img"
            tabIndex={0}
            aria-label={`Applications and interview moves over the last ${weeks.length} weeks. Use the arrow keys to read each week.`}
            onPointerMove={pickIndex}
            onPointerLeave={() => setHovered(null)}
            onKeyDown={onKeyDown}
            onBlur={() => setHovered(null)}
            className="relative h-56 cursor-crosshair rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            {/* Grid */}
            {ticks.map((tick) => (
              <div
                key={tick}
                className={`absolute inset-x-0 border-t ${tick === 0 ? 'border-stone-300 dark:border-stone-700' : 'border-dashed border-stone-200 dark:border-stone-800'}`}
                style={{ top: `${yFor(tick)}%` }}
              />
            ))}

            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              <path d={areaPath} className="fill-teal-600/10 dark:fill-teal-500/10" />
              {SERIES.map((series) => (
                <path
                  key={series.key}
                  d={smoothPath(pointsFor(series.key))}
                  fill="none"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className={series.stroke}
                />
              ))}
            </svg>

            {/* Crosshair and markers for the active week */}
            <div
              className="pointer-events-none absolute inset-y-0 border-l border-stone-300 dark:border-stone-600"
              style={{ left: `${xFor(active)}%` }}
              aria-hidden="true"
            />
            {SERIES.map((series) => (
              <span
                key={series.key}
                aria-hidden="true"
                className={`pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white dark:ring-stone-900 ${series.swatch}`}
                style={{ left: `${xFor(active)}%`, top: `${yFor(activeWeek[series.key])}%` }}
              />
            ))}

            {hovered !== null && (
              <div
                className={`pointer-events-none absolute top-0 z-10 w-48 ${tooltipAlign} rounded-xl bg-white p-3 text-xs shadow-lg ring-1 ring-stone-200 dark:bg-stone-800 dark:ring-stone-700`}
                style={{ left: `${xFor(active)}%` }}
              >
                <p className="mb-2 font-semibold text-stone-900 dark:text-white">Week of {formatDate(activeWeek.weekStart)}</p>
                {SERIES.map((series) => (
                  <p key={series.key} className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                    <span className={`h-2 w-2 rounded-full ${series.swatch}`} aria-hidden="true" />
                    <span className="flex-1">{series.label}</span>
                    <span className="font-semibold tabular-nums text-stone-900 dark:text-white">{activeWeek[series.key]}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* X axis */}
          <div className="relative mt-3 h-4 text-xs text-stone-400 dark:text-stone-500" aria-hidden="true">
            {weeks.map((week, index) => (
              <span
                key={week.weekStart}
                className={`absolute whitespace-nowrap ${
                  index === 0 ? '' : index === weeks.length - 1 ? '-translate-x-full' : '-translate-x-1/2'
                } ${(index % 2 === 1 || index === weeks.length - 2) && index !== weeks.length - 1 ? 'hidden sm:inline' : ''} ${
                  index === active ? 'font-semibold text-stone-700 dark:text-stone-200' : ''
                }`}
                style={{ left: `${xFor(index)}%` }}
              >
                {formatDate(week.weekStart)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Same numbers as a table for screen readers */}
      <table className="sr-only">
        <caption>Weekly applications and moves to interview</caption>
        <thead>
          <tr>
            <th scope="col">Week of</th>
            {SERIES.map((series) => (
              <th key={series.key} scope="col">
                {series.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.weekStart}>
              <th scope="row">{formatDate(week.weekStart, true)}</th>
              <td>{week.applications}</td>
              <td>{week.interviews}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
