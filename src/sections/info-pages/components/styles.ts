// Shared classes for the Info Pages (For Employers, Contact, FAQ).
// White-only design in Poppins (applied by the site shell), EduBridge teal with gold accents.

export const INFO_STYLES = `
@keyframes ip-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes ip-pop { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: no-preference) {
  .ip-rise { animation: ip-rise 600ms cubic-bezier(.22,1,.36,1) both; }
  .ip-pop { animation: ip-pop 320ms cubic-bezier(.22,1,.36,1) both; }
}
`

const BTN_BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60'

export const BTN_PRIMARY = `${BTN_BASE} min-h-12 bg-teal-900 px-6 py-3 text-white hover:bg-teal-800`
export const BTN_SECONDARY = `${BTN_BASE} min-h-12 border border-stone-300 bg-white px-6 py-3 text-stone-900 hover:border-teal-700 hover:text-teal-800`
export const BTN_GOLD = `${BTN_BASE} min-h-12 bg-amber-300 px-6 py-3 text-teal-950 hover:bg-amber-200`

export const INPUT =
  'block w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10 aria-[invalid=true]:border-rose-500 aria-[invalid=true]:focus:ring-rose-500/10'
export const LABEL = 'mb-2 flex items-baseline justify-between gap-2 text-sm font-medium text-stone-900'
export const OPTIONAL = 'text-xs font-normal text-stone-400'
export const ERROR = 'mt-1.5 text-xs font-medium text-rose-700'

export const CARD = 'rounded-3xl border border-stone-200 bg-white shadow-sm'
export const EYEBROW = 'text-sm font-semibold text-teal-700'
export const H2 = 'text-balance text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl'
