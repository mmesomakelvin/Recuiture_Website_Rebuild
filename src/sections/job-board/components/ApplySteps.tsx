import { useRef, useState } from 'react'
import { AlertCircle, Check, FileText, Pencil, UploadCloud, X } from 'lucide-react'
import type { CurrentUser, SavedCv, ScreeningQuestion } from '@/../product/sections/job-board/types'
import { formatDate } from './format'

const COVER_LETTER_LIMIT = 2000
const MAX_CV_BYTES = 5 * 1024 * 1024
const CV_EXTENSIONS = ['pdf', 'doc', 'docx']

function formatFileSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`
}

function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl dark:text-white">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{description}</p>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-700 dark:text-red-400">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {message}
    </p>
  )
}

function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        checked ? 'border-teal-900 dark:border-teal-400' : 'border-stone-300 dark:border-stone-600'
      }`}
    >
      {checked && <span className="h-2.5 w-2.5 rounded-full bg-teal-900 dark:bg-teal-400" />}
    </span>
  )
}

function optionCardClass(checked: boolean) {
  return `flex w-full cursor-pointer items-start gap-4 rounded-2xl border p-4 text-left transition-all sm:p-5 ${
    checked
      ? 'border-teal-900 bg-teal-50/60 ring-1 ring-teal-900 dark:border-teal-400 dark:bg-teal-400/5 dark:ring-teal-400'
      : 'border-stone-200 bg-white hover:border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-stone-600'
  }`
}

// -----------------------------------------------------------------------------
// Step 1: CV
// -----------------------------------------------------------------------------

interface CvStepProps {
  savedCv: SavedCv | null
  source: 'saved' | 'upload'
  file: File | null
  error?: string
  onSourceChange: (source: 'saved' | 'upload') => void
  onFileChange: (file: File | null, error?: string) => void
}

export function CvStep({ savedCv, source, file, error, onSourceChange, onFileChange }: CvStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const pickFile = (picked: File | undefined) => {
    if (!picked) return
    const extension = picked.name.split('.').pop()?.toLowerCase() ?? ''
    if (!CV_EXTENSIONS.includes(extension)) {
      onFileChange(null, 'Please choose a PDF or Word document.')
      return
    }
    if (picked.size > MAX_CV_BYTES) {
      onFileChange(null, 'That file is larger than 5MB. Please choose a smaller file.')
      return
    }
    onSourceChange('upload')
    onFileChange(picked)
  }

  return (
    <div className="space-y-6">
      <StepHeading
        title="Choose your CV"
        description="The employer will see the CV you choose here. You can use the one on your profile or upload a version for this role."
      />

      <div role="radiogroup" aria-label="CV" className="space-y-3">
        {savedCv && (
          <button
            type="button"
            role="radio"
            aria-checked={source === 'saved'}
            onClick={() => onSourceChange('saved')}
            className={optionCardClass(source === 'saved')}
          >
            <RadioDot checked={source === 'saved'} />
            <span className="flex min-w-0 flex-1 items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-900 text-amber-300 dark:bg-teal-700">
                <FileText className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                  From your profile
                </span>
                <span className="mt-0.5 block truncate text-[15px] font-semibold text-stone-900 dark:text-white">
                  {savedCv.fileName}
                </span>
                <span className="mt-0.5 block text-xs text-stone-500 dark:text-stone-400">
                  {formatFileSize(savedCv.fileSizeKb)} · Uploaded {formatDate(savedCv.uploadedAt)}
                </span>
              </span>
            </span>
          </button>
        )}

        <div
          role="radio"
          aria-checked={source === 'upload'}
          tabIndex={0}
          onClick={() => onSourceChange('upload')}
          onKeyDown={(event) => {
            if (event.key === ' ' || event.key === 'Enter') {
              event.preventDefault()
              onSourceChange('upload')
            }
          }}
          className={optionCardClass(source === 'upload')}
        >
          <RadioDot checked={source === 'upload'} />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-stone-900 dark:text-white">Upload a new CV</p>
            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">PDF or Word document, up to 5MB</p>

            {source === 'upload' && (
              <div className="mt-4">
                {file ? (
                  <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-stone-950">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-900 dark:bg-teal-400/10 dark:text-teal-200">
                      <Check className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-stone-900 dark:text-white">{file.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{formatFileSize(file.size / 1024)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onFileChange(null)
                      }}
                      aria-label="Remove file"
                      className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    onDragOver={(event) => {
                      event.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(event) => {
                      event.preventDefault()
                      setIsDragging(false)
                      pickFile(event.dataTransfer.files[0])
                    }}
                    className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors ${
                      isDragging
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-400/10'
                        : 'border-stone-300 hover:border-teal-800 hover:bg-white dark:border-stone-600 dark:hover:border-teal-400 dark:hover:bg-stone-950'
                    }`}
                  >
                    <UploadCloud className="h-8 w-8 text-teal-800 dark:text-teal-300" />
                    <span className="mt-2 text-sm font-semibold text-stone-900 dark:text-white">
                      Drag your CV here or <span className="text-teal-800 underline underline-offset-4 dark:text-teal-300">browse</span>
                    </span>
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="sr-only"
                      onChange={(event) => {
                        pickFile(event.target.files?.[0])
                        event.target.value = ''
                      }}
                    />
                  </label>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <FieldError message={error} />
    </div>
  )
}

// -----------------------------------------------------------------------------
// Step 2: Cover letter
// -----------------------------------------------------------------------------

interface CoverLetterStepProps {
  jobTitle: string
  companyName: string
  value: string
  onChange: (value: string) => void
}

export function CoverLetterStep({ jobTitle, companyName, value, onChange }: CoverLetterStepProps) {
  const remaining = COVER_LETTER_LIMIT - value.length
  return (
    <div className="space-y-6">
      <StepHeading
        title="Add a cover letter"
        description={`Optional. A few lines on why you want to join ${companyName} as ${jobTitle} can help you stand out.`}
      />
      <div>
        <label htmlFor="apply-cover-letter" className="sr-only">
          Cover letter
        </label>
        <textarea
          id="apply-cover-letter"
          value={value}
          maxLength={COVER_LETTER_LIMIT}
          onChange={(event) => onChange(event.target.value)}
          rows={10}
          placeholder={`Dear ${companyName} hiring team,`}
          className="block w-full resize-y rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-[15px] leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-800/10 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400/10"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span>You can skip this step.</span>
          <span className={`font-mono tabular-nums ${remaining < 100 ? 'text-amber-700 dark:text-amber-300' : ''}`}>
            {value.length.toLocaleString('en-NG')} / {COVER_LETTER_LIMIT.toLocaleString('en-NG')}
          </span>
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Step 3: Screening questions
// -----------------------------------------------------------------------------

interface QuestionsStepProps {
  questions: ScreeningQuestion[]
  answers: Record<string, string>
  errors: Record<string, string>
  onAnswer: (questionId: string, value: string) => void
}

function QuestionField({
  question,
  value,
  error,
  onAnswer,
}: {
  question: ScreeningQuestion
  value: string
  error?: string
  onAnswer: (value: string) => void
}) {
  const inputId = `apply-q-${question.id}`
  const inputClass = `block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-4 dark:bg-stone-900 dark:text-white ${
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
      : 'border-stone-300 focus:border-teal-800 focus:ring-teal-800/10 dark:border-stone-700 dark:focus:border-teal-400 dark:focus:ring-teal-400/10'
  }`

  const choiceClass = (selected: boolean) =>
    `rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
      selected
        ? 'border-teal-900 bg-teal-900 text-white dark:border-teal-500 dark:bg-teal-600'
        : 'border-stone-300 bg-white text-stone-700 hover:border-teal-800 hover:text-teal-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-teal-400 dark:hover:text-teal-200'
    }`

  return (
    <fieldset>
      <legend className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-stone-900 dark:text-white">
        <label htmlFor={question.type === 'short-text' || question.type === 'number' ? inputId : undefined}>
          {question.question}
        </label>
        {question.required ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-900 dark:bg-amber-400/15 dark:text-amber-200">
            Required
          </span>
        ) : (
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">Optional</span>
        )}
      </legend>

      <div className="mt-3">
        {question.type === 'short-text' && (
          <input id={inputId} type="text" value={value} onChange={(event) => onAnswer(event.target.value)} className={inputClass} />
        )}
        {question.type === 'number' && (
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(event) => onAnswer(event.target.value.replace(/[^\d]/g, ''))}
            className={`${inputClass} font-mono tabular-nums sm:max-w-xs`}
          />
        )}
        {question.type === 'yes-no' && (
          <div role="radiogroup" className="flex gap-2">
            {['Yes', 'No'].map((choice) => (
              <button
                key={choice}
                type="button"
                role="radio"
                aria-checked={value === choice}
                onClick={() => onAnswer(choice)}
                className={`${choiceClass(value === choice)} min-w-24`}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
        {question.type === 'multiple-choice' && (
          <div role="radiogroup" className="flex flex-wrap gap-2">
            {question.options.map((choice) => (
              <button
                key={choice}
                type="button"
                role="radio"
                aria-checked={value === choice}
                onClick={() => onAnswer(choice)}
                className={choiceClass(value === choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>
      <FieldError message={error} />
    </fieldset>
  )
}

export function QuestionsStep({ questions, answers, errors, onAnswer }: QuestionsStepProps) {
  return (
    <div className="space-y-6">
      <StepHeading
        title="Answer a few questions"
        description="The employer added these questions to help them review applications quickly."
      />
      <div className="space-y-7">
        {questions.map((question, index) => (
          <div key={question.id} className="flex gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-200 font-mono text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <QuestionField
                question={question}
                value={answers[question.id] ?? ''}
                error={errors[question.id]}
                onAnswer={(value) => onAnswer(question.id, value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Step 4: Review
// -----------------------------------------------------------------------------

interface ReviewStepProps {
  currentUser: CurrentUser
  cvLabel: string
  cvMeta: string
  coverLetter: string
  questions: ScreeningQuestion[]
  answers: Record<string, string>
  onEdit: (step: 'cv' | 'cover-letter' | 'questions') => void
}

function ReviewBlock({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-teal-800 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-400/10"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}

export function ReviewStep({ currentUser, cvLabel, cvMeta, coverLetter, questions, answers, onEdit }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <StepHeading
        title="Review your application"
        description={`Applying as ${currentUser.name} (${currentUser.email}). Check everything below, then send it.`}
      />
      <div className="space-y-3">
        <ReviewBlock title="CV" onEdit={() => onEdit('cv')}>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-900 text-amber-300 dark:bg-teal-700">
              <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-stone-900 dark:text-white">{cvLabel}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{cvMeta}</p>
            </div>
          </div>
        </ReviewBlock>

        <ReviewBlock title="Cover letter" onEdit={() => onEdit('cover-letter')}>
          {coverLetter.trim() ? (
            <p className="line-clamp-6 whitespace-pre-line text-[15px] leading-relaxed text-stone-700 dark:text-stone-300">
              {coverLetter}
            </p>
          ) : (
            <p className="text-sm italic text-stone-500 dark:text-stone-400">No cover letter added</p>
          )}
        </ReviewBlock>

        {questions.length > 0 && (
          <ReviewBlock title="Screening questions" onEdit={() => onEdit('questions')}>
            <dl className="divide-y divide-stone-200 dark:divide-stone-800">
              {questions.map((question) => (
                <div key={question.id} className="py-3 first:pt-0 last:pb-0">
                  <dt className="text-sm text-stone-600 dark:text-stone-400">{question.question}</dt>
                  <dd className="mt-1 text-[15px] font-semibold text-stone-900 dark:text-white">
                    {answers[question.id]?.trim() ? (
                      question.type === 'number' ? (
                        <span className="font-mono tabular-nums">{Number(answers[question.id]).toLocaleString('en-NG')}</span>
                      ) : (
                        answers[question.id]
                      )
                    ) : (
                      <span className="font-normal italic text-stone-500 dark:text-stone-400">Not answered</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </ReviewBlock>
        )}
      </div>
    </div>
  )
}
