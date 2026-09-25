import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, GraduationCap, SlidersHorizontal, X } from 'lucide-react'
import type { FilterOptions, JobSearchState } from '@/../product/sections/job-board/types'
import { countActiveFilters } from './format'

interface FilterBarProps {
  state: JobSearchState
  options: FilterOptions
  resultCount: number
  onChange: (next: JobSearchState) => void
  onClearAll: () => void
}

type ListKey = 'locations' | 'jobTypes' | 'workModes' | 'experienceLevels'

interface FilterGroup {
  key: ListKey
  label: string
  options: { value: string; label: string }[]
}

function buildGroups(options: FilterOptions): FilterGroup[] {
  return [
    { key: 'locations', label: 'Location', options: options.locations.map((place) => ({ value: place, label: place })) },
    { key: 'jobTypes', label: 'Job type', options: options.jobTypes },
    { key: 'workModes', label: 'Work mode', options: options.workModes },
    { key: 'experienceLevels', label: 'Experience', options: options.experienceLevels },
  ]
}

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function useDismiss(isOpen: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, close])
  return ref
}

function chipClass(active: boolean) {
  return `inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
    active
      ? 'border-teal-900 bg-teal-900 text-white dark:border-teal-500 dark:bg-teal-600'
      : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600 dark:hover:bg-stone-800'
  }`
}

function OptionRow({
  label,
  checked,
  radio = false,
  onToggle,
}: {
  label: string
  checked: boolean
  radio?: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      role={radio ? 'menuitemradio' : 'menuitemcheckbox'}
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
    >
      <span
        aria-hidden="true"
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors ${
          radio ? 'rounded-full' : 'rounded-[5px]'
        } ${
          checked
            ? 'border-teal-900 bg-teal-900 text-white dark:border-teal-500 dark:bg-teal-600'
            : 'border-stone-300 dark:border-stone-600'
        }`}
      >
        {checked && (radio ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : <Check className="h-3 w-3" strokeWidth={3} />)}
      </span>
      {label}
    </button>
  )
}

function FilterDropdown({
  label,
  count,
  children,
}: {
  label: string
  count: number
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useDismiss(isOpen, () => setIsOpen(false))

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={chipClass(count > 0)}
      >
        {label}
        {count > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 font-mono text-[11px] font-semibold text-teal-950">
            {count}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-2 max-h-80 w-60 overflow-y-auto rounded-xl border border-stone-200 bg-white p-1.5 shadow-xl shadow-stone-900/10 dark:border-stone-700 dark:bg-stone-900 dark:shadow-black/40"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function FilterBar({ state, options, resultCount, onChange, onClearAll }: FilterBarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const groups = buildGroups(options)
  const activeCount = countActiveFilters(state)

  useEffect(() => {
    if (!isSheetOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isSheetOpen])

  const toggleList = (key: ListKey, value: string) =>
    onChange({ ...state, [key]: toggleValue(state[key] as string[], value) })

  const setSalary = (value: string) =>
    onChange({ ...state, salaryRange: state.salaryRange === value ? null : value })

  const toggleGraduate = () => onChange({ ...state, graduateFriendlyOnly: !state.graduateFriendlyOnly })

  const activeChips: { key: string; label: string; remove: () => void }[] = [
    ...groups.flatMap((group) =>
      (state[group.key] as string[]).map((value) => ({
        key: `${group.key}-${value}`,
        label: group.options.find((option) => option.value === value)?.label ?? value,
        remove: () => toggleList(group.key, value),
      })),
    ),
    ...(state.salaryRange
      ? [
          {
            key: 'salary',
            label: options.salaryRanges.find((range) => range.value === state.salaryRange)?.label ?? 'Salary',
            remove: () => onChange({ ...state, salaryRange: null }),
          },
        ]
      : []),
    ...(state.graduateFriendlyOnly
      ? [{ key: 'graduate', label: 'Graduate-friendly', remove: toggleGraduate }]
      : []),
  ]

  const graduateToggle = (
    <button
      type="button"
      role="switch"
      aria-checked={state.graduateFriendlyOnly}
      onClick={toggleGraduate}
      className={`inline-flex h-10 items-center gap-2.5 rounded-full border pl-3 pr-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
        state.graduateFriendlyOnly
          ? 'border-amber-400 bg-amber-50 text-amber-950 dark:border-amber-400/60 dark:bg-amber-400/10 dark:text-amber-100'
          : 'border-stone-300 bg-white text-stone-700 hover:border-amber-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300'
      }`}
    >
      <GraduationCap className="h-4 w-4 text-amber-600 dark:text-amber-300" />
      Graduate-friendly
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 rounded-full transition-colors ${
          state.graduateFriendlyOnly ? 'bg-amber-400' : 'bg-stone-300 dark:bg-stone-700'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
            state.graduateFriendlyOnly ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )

  return (
    <div>
      {/* Desktop chips */}
      <div className="hidden flex-wrap items-center gap-2 md:flex">
        {groups.map((group) => (
          <FilterDropdown key={group.key} label={group.label} count={(state[group.key] as string[]).length}>
            {group.options.map((option) => (
              <OptionRow
                key={option.value}
                label={option.label}
                checked={(state[group.key] as string[]).includes(option.value)}
                onToggle={() => toggleList(group.key, option.value)}
              />
            ))}
          </FilterDropdown>
        ))}
        <FilterDropdown label="Salary" count={state.salaryRange ? 1 : 0}>
          <p className="px-3 pb-1 pt-2 text-xs font-medium text-stone-500 dark:text-stone-400">Monthly, in naira</p>
          {options.salaryRanges.map((range) => (
            <OptionRow
              key={range.value}
              radio
              label={range.label}
              checked={state.salaryRange === range.value}
              onToggle={() => setSalary(range.value)}
            />
          ))}
        </FilterDropdown>
        <span aria-hidden="true" className="mx-1 h-6 w-px bg-stone-300 dark:bg-stone-700" />
        {graduateToggle}
      </div>

      {/* Mobile trigger */}
      <div className="flex items-center gap-2 md:hidden">
        <button type="button" onClick={() => setIsSheetOpen(true)} className={chipClass(activeCount > 0)}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 font-mono text-[11px] font-semibold text-teal-950">
              {activeCount}
            </span>
          )}
        </button>
        {graduateToggle}
      </div>

      {/* Active filters */}
      {activeChips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.remove}
              aria-label={`Remove filter ${chip.label}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 py-1 pl-3 pr-2 text-xs font-semibold text-teal-900 ring-1 ring-inset ring-teal-200 transition-colors hover:bg-teal-100 dark:bg-teal-400/10 dark:text-teal-200 dark:ring-teal-400/25 dark:hover:bg-teal-400/20"
            >
              {chip.label}
              <X className="h-3.5 w-3.5" />
            </button>
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="px-2 py-1 text-xs font-semibold text-stone-600 underline decoration-stone-300 underline-offset-4 hover:text-teal-900 hover:decoration-teal-900 dark:text-stone-400 dark:hover:text-teal-200"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Mobile sheet */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm" onClick={() => setIsSheetOpen(false)} />
          <div className="jb-sheet absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-white dark:bg-stone-900">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 dark:border-stone-800">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-white">Filters</h2>
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                aria-label="Close filters"
                className="rounded-full p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              {groups.map((group) => (
                <fieldset key={group.key}>
                  <legend className="text-sm font-semibold text-stone-900 dark:text-stone-100">{group.label}</legend>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const checked = (state[group.key] as string[]).includes(option.value)
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={checked}
                          onClick={() => toggleList(group.key, option.value)}
                          className={chipClass(checked)}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              ))}
              <fieldset>
                <legend className="text-sm font-semibold text-stone-900 dark:text-stone-100">Monthly salary</legend>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {options.salaryRanges.map((range) => (
                    <button
                      key={range.value}
                      type="button"
                      aria-pressed={state.salaryRange === range.value}
                      onClick={() => setSalary(range.value)}
                      className={chipClass(state.salaryRange === range.value)}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="flex gap-3 border-t border-stone-200 px-5 py-4 dark:border-stone-800">
              <button
                type="button"
                onClick={onClearAll}
                className="h-12 rounded-xl border border-stone-300 px-5 text-sm font-semibold text-stone-700 dark:border-stone-700 dark:text-stone-300"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                className="h-12 flex-1 rounded-xl bg-teal-900 text-sm font-semibold text-white dark:bg-teal-600"
              >
                Show {resultCount} {resultCount === 1 ? 'job' : 'jobs'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
