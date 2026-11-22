// Shared animation, pattern and class styles for the Admin Portal.
// Typography: Poppins for all text, with tabular figures for dates, counts and reference codes.
// The portal is standalone (no app shell), so AdminPortal applies the font stack itself.

const ADIRE_TILE = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><g fill='none' stroke='#fbbf24' stroke-width='1'><circle cx='24' cy='24' r='7'/><circle cx='24' cy='24' r='2.5'/><path d='M0 0l8 8M48 0l-8 8M0 48l8-8M48 48l-8-8'/><path d='M24 0v6M24 42v6M0 24h6M42 24h6'/></g></svg>`,
)

export const ADMIN_STYLES = `
@keyframes ap-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes ap-panel { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: none; } }
@keyframes ap-pop { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes ap-fade { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: no-preference) {
  .ap-rise { animation: ap-rise 380ms cubic-bezier(.2,.7,.2,1) both; }
  .ap-panel { animation: ap-panel 260ms cubic-bezier(.2,.7,.2,1) both; }
  .ap-pop { animation: ap-pop 220ms cubic-bezier(.2,.7,.2,1) both; }
  .ap-fade { animation: ap-fade 200ms ease-out both; }
}
.ap-adire { background-image: url("data:image/svg+xml,${ADIRE_TILE}"); background-size: 48px 48px; -webkit-mask-image: linear-gradient(to top, #000 0%, transparent 85%); mask-image: linear-gradient(to top, #000 0%, transparent 85%); }
`

export const POPPINS = '"Poppins", ui-sans-serif, system-ui, sans-serif'

export const FONT_STACK = {
  fontFamily: POPPINS,
  '--font-display': POPPINS,
  '--font-sans': POPPINS,
  '--font-body': POPPINS,
  '--font-mono': POPPINS,
  // White-only design: keep native controls light even when the host is dark
  colorScheme: 'light',
} as React.CSSProperties

/** Even-width figures for dates, counts and reference codes so columns line up */
export const MONO = { fontVariantNumeric: 'tabular-nums' } as React.CSSProperties

// Buttons
const BTN_BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50'

export const BTN_PRIMARY = `${BTN_BASE} bg-teal-800 px-4 py-2 text-white shadow-sm hover:bg-teal-900`
export const BTN_SECONDARY = `${BTN_BASE} border border-stone-300 bg-white px-4 py-2 text-stone-800 hover:bg-stone-50`
export const BTN_GHOST = `${BTN_BASE} px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900`
export const BTN_DANGER = `${BTN_BASE} bg-rose-700 px-4 py-2 text-white shadow-sm hover:bg-rose-800`

// Form fields
export const INPUT =
  'block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm transition focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20'
export const LABEL = 'mb-1.5 block text-sm font-medium text-stone-800'
export const HINT = 'mt-1 text-xs text-stone-500'

// Surfaces
export const CARD =
  'rounded-2xl bg-white shadow-[0_2px_14px_rgba(28,25,23,0.06)] ring-1 ring-stone-200/70'
export const SECTION_TITLE = 'text-sm font-semibold text-stone-900'
