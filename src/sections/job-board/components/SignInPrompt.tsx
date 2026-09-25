import { useEffect } from 'react'
import { Bookmark, FileCheck2, X } from 'lucide-react'

export type SignInReason = 'apply' | 'save'

interface SignInPromptProps {
  reason: SignInReason
  jobTitle?: string
  onSignIn?: () => void
  onCreateAccount?: () => void
  onClose: () => void
}

const COPY: Record<SignInReason, { title: string; body: string }> = {
  apply: {
    title: 'Sign in to apply',
    body: 'Your Recruiture account keeps your CV ready for every application and lets you track each one from applied to hired.',
  },
  save: {
    title: 'Sign in to save jobs',
    body: 'Save jobs to your account and come back to them from any device when you are ready to apply.',
  },
}

export function SignInPrompt({ reason, jobTitle, onSignIn, onCreateAccount, onClose }: SignInPromptProps) {
  const { title, body } = COPY[reason]
  const Icon = reason === 'apply' ? FileCheck2 : Bookmark

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="jb-signin-title">
      <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="jb-sheet relative w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl dark:bg-stone-900">
        <div className="relative overflow-hidden bg-teal-950 px-6 pb-6 pt-7">
          <div aria-hidden="true" className="jb-adire-fade absolute inset-0 opacity-[0.22]" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1.5 text-teal-100/80 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-teal-950">
            <Icon className="h-6 w-6" />
          </span>
          <h2 id="jb-signin-title" className="relative mt-4 text-xl font-bold text-white">
            {title}
          </h2>
          {jobTitle && <p className="relative mt-1 text-sm text-teal-100/80">{jobTitle}</p>}
        </div>
        <div className="px-6 pb-6 pt-5">
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{body}</p>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onSignIn}
              className="h-12 rounded-xl bg-teal-900 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={onCreateAccount}
              className="h-12 rounded-xl border border-stone-300 text-sm font-semibold text-stone-800 transition-colors hover:border-teal-800 hover:text-teal-900 dark:border-stone-700 dark:text-stone-200 dark:hover:border-teal-400 dark:hover:text-teal-200"
            >
              Create a free account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
