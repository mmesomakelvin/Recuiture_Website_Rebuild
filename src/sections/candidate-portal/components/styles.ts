// Shared motion and class styles for the Candidate Portal.
// Typography: Poppins throughout (applied by the app shell), with tabular figures for dates and counts.
// The look matches the Admin Portal: white rounded cards, solid colour stat tiles and teal actions.

export const PORTAL_STYLES = `
@keyframes cp-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes cp-pop { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes cp-fade { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: no-preference) {
  .cp-rise { animation: cp-rise 360ms cubic-bezier(.2,.7,.2,1) both; }
  .cp-pop { animation: cp-pop 220ms cubic-bezier(.2,.7,.2,1) both; }
  .cp-fade { animation: cp-fade 200ms ease-out both; }
}
`

const BTN_BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-stone-950'

export const BTN_PRIMARY = `${BTN_BASE} bg-teal-800 px-4 py-2.5 text-white shadow-sm hover:bg-teal-900 dark:bg-teal-600 dark:hover:bg-teal-500`
export const BTN_SECONDARY = `${BTN_BASE} border border-stone-300 bg-white px-4 py-2.5 text-stone-800 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800`
export const BTN_SOFT = `${BTN_BASE} bg-teal-50 px-3 py-2 text-teal-800 hover:bg-teal-100 dark:bg-teal-400/10 dark:text-teal-200 dark:hover:bg-teal-400/20`
export const BTN_DANGER = `${BTN_BASE} bg-rose-700 px-4 py-2.5 text-white shadow-sm hover:bg-rose-800 dark:bg-rose-600 dark:hover:bg-rose-500`
export const LINK = 'font-semibold text-teal-700 hover:text-teal-900 hover:underline dark:text-teal-300 dark:hover:text-teal-200'

export const INPUT =
  'block w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm transition focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 disabled:bg-stone-100 disabled:text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/20 dark:disabled:bg-stone-800 dark:disabled:text-stone-400'
export const LABEL = 'mb-1.5 block text-sm font-medium text-stone-800 dark:text-stone-200'
export const HINT = 'mt-1.5 text-xs text-stone-500 dark:text-stone-400'
export const FIELD_ERROR = 'mt-1.5 text-xs font-medium text-rose-700 dark:text-rose-300'

export const CARD =
  'rounded-2xl bg-white shadow-[0_2px_14px_rgba(28,25,23,0.06)] ring-1 ring-stone-200/70 dark:bg-stone-900 dark:shadow-none dark:ring-stone-800'
