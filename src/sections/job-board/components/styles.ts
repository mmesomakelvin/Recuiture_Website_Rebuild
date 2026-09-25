// Shared animation and pattern styles for Job Board screens.
// Typography: Poppins (headings and body) and IBM Plex Mono (salaries, counts), applied by the app shell.

const ADIRE_TILE = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><g fill='none' stroke='#fbbf24' stroke-width='1.2'><circle cx='28' cy='28' r='9'/><circle cx='28' cy='28' r='3'/><path d='M0 0l10 10M56 0L46 10M0 56l10-10M56 56L46 46'/><path d='M28 0v8M28 48v8M0 28h8M48 28h8'/></g></svg>`,
)

export const JOB_BOARD_STYLES = `
@keyframes jb-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes jb-sheet { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes jb-pop { 0% { opacity: 0; transform: scale(.6); } 60% { opacity: 1; transform: scale(1.08); } 100% { transform: scale(1); } }
@media (prefers-reduced-motion: no-preference) {
  .jb-rise { animation: jb-rise 420ms cubic-bezier(.2,.7,.2,1) both; }
  .jb-sheet { animation: jb-sheet 260ms cubic-bezier(.2,.7,.2,1) both; }
  .jb-pop { animation: jb-pop 520ms cubic-bezier(.2,.7,.2,1) both; }
}
.jb-adire-fade { background-image: url("data:image/svg+xml,${ADIRE_TILE}"); background-size: 56px 56px; -webkit-mask-image: linear-gradient(115deg, transparent 20%, #000 75%); mask-image: linear-gradient(115deg, transparent 20%, #000 75%); }
.jb-weave { background-image: repeating-linear-gradient(135deg, rgb(19 78 74 / .07) 0 1px, transparent 1px 9px); -webkit-mask-image: linear-gradient(to bottom, #000, transparent); mask-image: linear-gradient(to bottom, #000, transparent); }
`
