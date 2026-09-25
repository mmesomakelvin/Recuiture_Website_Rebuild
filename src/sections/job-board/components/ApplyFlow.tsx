import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Send, X } from 'lucide-react'
import type { ApplyFlowProps } from '@/../product/sections/job-board/types'
import { formatDate, formatLocation, formatSalary } from './format'
import { CompanyLogo } from './JobBits'
import { CoverLetterStep, CvStep, QuestionsStep, ReviewStep } from './ApplySteps'
import { JOB_BOARD_STYLES } from './styles'

type StepId = 'cv' | 'cover-letter' | 'questions' | 'review'

const STEP_LABELS: Record<StepId, string> = {
  cv: 'CV',
  'cover-letter': 'Cover letter',
  questions: 'Questions',
  review: 'Review',
}

export function ApplyFlow({ job, currentUser, onSubmit, onCancel, onViewApplications, onKeepBrowsing }: ApplyFlowProps) {
  const hasQuestions = job.screeningQuestions.length > 0
  const steps: StepId[] = hasQuestions
    ? ['cv', 'cover-letter', 'questions', 'review']
    : ['cv', 'cover-letter', 'review']

  const [stepIndex, setStepIndex] = useState(0)
  const [returnToReview, setReturnToReview] = useState(false)
  const [cvSource, setCvSource] = useState<'saved' | 'upload'>(currentUser.savedCv ? 'saved' : 'upload')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvError, setCvError] = useState<string | undefined>()
  const [coverLetter, setCoverLetter] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [questionErrors, setQuestionErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  const goTo = (target: StepId) => {
    setStepIndex(steps.indexOf(target))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const validateStep = (id: StepId) => {
    if (id === 'cv' && cvSource === 'upload' && !cvFile) {
      setCvError('Choose a CV to upload, or use the CV on your profile.')
      return false
    }
    if (id === 'questions') {
      const errors: Record<string, string> = {}
      for (const question of job.screeningQuestions) {
        if (question.required && !answers[question.id]?.trim()) errors[question.id] = 'Please answer this question.'
      }
      setQuestionErrors(errors)
      return Object.keys(errors).length === 0
    }
    return true
  }

  const handleContinue = () => {
    if (!validateStep(step)) {
      // Bring the first error into view, as it can sit below the sticky action bar on mobile
      window.setTimeout(() => {
        document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 0)
      return
    }
    if (isLastStep) {
      onSubmit?.({
        jobId: job.id,
        cvSource,
        uploadedCvFile: cvSource === 'upload' ? (cvFile ?? undefined) : undefined,
        coverLetter: coverLetter.trim(),
        answers,
      })
      setIsSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (returnToReview) {
      setReturnToReview(false)
      goTo('review')
      return
    }
    setStepIndex((index) => index + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    if (stepIndex === 0) {
      onCancel?.()
      return
    }
    setReturnToReview(false)
    setStepIndex((index) => index - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEdit = (target: 'cv' | 'cover-letter' | 'questions') => {
    setReturnToReview(true)
    goTo(target)
  }

  const cvLabel = cvSource === 'saved' && currentUser.savedCv ? currentUser.savedCv.fileName : (cvFile?.name ?? 'No file chosen')
  const cvMeta =
    cvSource === 'saved' && currentUser.savedCv
      ? `From your profile · Uploaded ${formatDate(currentUser.savedCv.uploadedAt)}`
      : 'Uploaded for this application'

  const salary = formatSalary(job)

  // ---------------------------------------------------------------------------
  // Success
  // ---------------------------------------------------------------------------
  if (isSubmitted) {
    return (
      <div className="min-h-full bg-stone-50 px-4 py-12 sm:py-20 dark:bg-stone-950">
        <style>{JOB_BOARD_STYLES}</style>
        <div className="jb-rise mx-auto max-w-lg overflow-hidden rounded-3xl border border-stone-200 bg-white text-center shadow-[0_30px_60px_-30px_rgba(19,78,74,0.35)] dark:border-stone-800 dark:bg-stone-900">
          <div className="relative overflow-hidden bg-teal-950 px-6 pb-10 pt-12">
            <div aria-hidden="true" className="jb-adire-fade absolute inset-0 opacity-20" />
            <span className="jb-pop relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-400 text-teal-950 shadow-[0_0_0_10px_rgba(251,191,36,0.15)]">
              <Check className="h-10 w-10" strokeWidth={3} />
            </span>
            <h1 className="relative mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">Application sent</h1>
          </div>
          <div className="px-6 pb-8 pt-6 sm:px-10">
            <p className="text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
              Your application for <span className="font-semibold text-stone-900 dark:text-white">{job.title}</span> at{' '}
              <span className="font-semibold text-stone-900 dark:text-white">{job.company.name}</span> is on its way. You
              can follow its progress from your applications.
            </p>
            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row-reverse">
              <button
                type="button"
                onClick={onViewApplications}
                className="h-12 flex-1 rounded-xl bg-teal-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:bg-teal-600 dark:hover:bg-teal-500"
              >
                View my applications
              </button>
              <button
                type="button"
                onClick={onKeepBrowsing}
                className="h-12 flex-1 rounded-xl border border-stone-300 px-6 text-sm font-semibold text-stone-800 transition-colors hover:border-teal-800 hover:text-teal-900 dark:border-stone-700 dark:text-stone-200 dark:hover:border-teal-400 dark:hover:text-teal-200"
              >
                Keep browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Steps
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-full bg-stone-50 pb-28 sm:pb-16 dark:bg-stone-950">
      <style>{JOB_BOARD_STYLES}</style>

      {/* Job context */}
      <div className="relative overflow-hidden bg-teal-950">
        <div aria-hidden="true" className="jb-adire-fade absolute inset-0 opacity-[0.16]" />
        <div className="relative mx-auto flex max-w-3xl items-center gap-4 px-4 py-5 sm:px-6 sm:py-6">
          <CompanyLogo company={job.company} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">Applying for</p>
            <h1 className="mt-0.5 truncate text-lg font-bold text-white sm:text-xl">{job.title}</h1>
            <p className="truncate text-sm text-teal-100/80">
              {job.company.name} · {formatLocation(job)}
              <span className="hidden sm:inline">
                {' '}
                · <span className="font-mono tabular-nums">{salary}</span>
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel application"
            className="flex items-center gap-1.5 rounded-lg p-2 text-sm font-medium text-teal-100/80 transition-colors hover:bg-white/10 hover:text-white sm:px-3"
          >
            <X className="h-5 w-5" />
            <span className="hidden sm:inline">Cancel</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Step indicator: desktop */}
        <ol className="hidden items-center gap-2 py-8 sm:flex" aria-label="Application steps">
          {steps.map((id, index) => {
            const done = index < stepIndex
            const current = index === stepIndex
            return (
              <li key={id} className="flex flex-1 items-center gap-2 last:flex-none">
                <span className="flex items-center gap-2.5">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold transition-colors ${
                      done
                        ? 'bg-teal-900 text-white dark:bg-teal-600'
                        : current
                          ? 'bg-amber-400 text-teal-950 ring-4 ring-amber-400/25'
                          : 'bg-stone-200 text-stone-500 dark:bg-stone-800 dark:text-stone-400'
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
                  </span>
                  <span
                    aria-current={current ? 'step' : undefined}
                    className={`whitespace-nowrap text-sm font-semibold ${
                      current ? 'text-stone-900 dark:text-white' : done ? 'text-teal-900 dark:text-teal-300' : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {STEP_LABELS[id]}
                  </span>
                </span>
                {index < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`mx-2 h-0.5 flex-1 rounded-full ${done ? 'bg-teal-900 dark:bg-teal-600' : 'bg-stone-200 dark:bg-stone-800'}`}
                  />
                )}
              </li>
            )
          })}
        </ol>

        {/* Step indicator: mobile */}
        <div className="py-5 sm:hidden">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-stone-900 dark:text-white">{STEP_LABELS[step]}</span>
            <span className="font-mono text-xs tabular-nums text-stone-500 dark:text-stone-400">
              Step {stepIndex + 1} of {steps.length}
            </span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-900 to-teal-700 transition-all duration-300 dark:from-teal-600 dark:to-teal-400"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div key={step} className="jb-rise rounded-3xl border border-stone-200 bg-white p-5 sm:p-8 dark:border-stone-800 dark:bg-stone-900">
          {step === 'cv' && (
            <CvStep
              savedCv={currentUser.savedCv}
              source={cvSource}
              file={cvFile}
              error={cvError}
              onSourceChange={(source) => {
                setCvSource(source)
                setCvError(undefined)
              }}
              onFileChange={(file, error) => {
                setCvFile(file)
                setCvError(error)
              }}
            />
          )}
          {step === 'cover-letter' && (
            <CoverLetterStep
              jobTitle={job.title}
              companyName={job.company.name}
              value={coverLetter}
              onChange={setCoverLetter}
            />
          )}
          {step === 'questions' && (
            <QuestionsStep
              questions={job.screeningQuestions}
              answers={answers}
              errors={questionErrors}
              onAnswer={(questionId, value) => {
                setAnswers((current) => ({ ...current, [questionId]: value }))
                setQuestionErrors((current) => {
                  const next = { ...current }
                  delete next[questionId]
                  return next
                })
              }}
            />
          )}
          {step === 'review' && (
            <ReviewStep
              currentUser={currentUser}
              cvLabel={cvLabel}
              cvMeta={cvMeta}
              coverLetter={coverLetter}
              questions={job.screeningQuestions}
              answers={answers}
              onEdit={handleEdit}
            />
          )}
        </div>

        {!hasQuestions && step === 'cover-letter' && (
          <p className="mt-3 text-center text-xs text-stone-500 dark:text-stone-400">
            This employer has no screening questions, so the next step is your review.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 backdrop-blur sm:static sm:mx-auto sm:mt-6 sm:max-w-3xl sm:border-0 sm:bg-transparent sm:px-6 sm:backdrop-blur-none dark:border-stone-800 dark:bg-stone-950/95 sm:dark:bg-transparent">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-0 sm:py-0">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-12 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {stepIndex === 0 ? 'Cancel' : 'Back'}
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-none sm:px-8 ${
              isLastStep
                ? 'bg-amber-400 text-teal-950 shadow-[0_10px_24px_-10px_rgba(245,158,11,0.8)] hover:bg-amber-300 focus-visible:outline-teal-900'
                : 'bg-teal-900 text-white shadow-[0_8px_20px_-8px_rgba(19,78,74,0.7)] hover:bg-teal-800 focus-visible:outline-amber-400 dark:bg-teal-600 dark:hover:bg-teal-500'
            }`}
          >
            {isLastStep ? (
              <>
                Submit application
                <Send className="h-4 w-4" />
              </>
            ) : (
              <>
                {returnToReview ? 'Back to review' : 'Continue'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
