import { useMemo, useState } from 'react'
import { ArrowLeft, Building2, Check, Circle, GraduationCap, Plus, Search, Trash2, X } from 'lucide-react'
import type {
  AdminJob,
  Company,
  CompanyInput,
  ExperienceLevel,
  FormOptions,
  JobInput,
  JobType,
  ScreeningQuestion,
  ScreeningQuestionType,
  WorkMode,
} from '@/../product/sections/admin-portal/types'
import { CompanyLogo, JobStatusBadge } from './Bits'
import { formatSalary } from './format'
import { BTN_GHOST, BTN_PRIMARY, BTN_SECONDARY, CARD, HINT, INPUT, LABEL, MONO, SECTION_TITLE } from './styles'

interface JobFormProps {
  /** The job being edited; leave undefined to create a new job */
  job?: AdminJob
  companies: Company[]
  formOptions: FormOptions
  onCancel: () => void
  /** publish is false for Save as draft or Save changes on a live job */
  onSubmit: (input: JobInput, publish: boolean) => void
  /** Adds a company from the inline form and returns it so it can be selected */
  onAddCompany: (input: CompanyInput) => Company
}

const toLines = (items: string[]) => items.join('\n')
const fromLines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <h2 className="text-base font-semibold text-stone-900">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-stone-500">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  )
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex w-full rounded-lg bg-stone-100 p-1">
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? 'bg-white text-teal-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Company picker with inline add
// -----------------------------------------------------------------------------

function CompanyPicker({
  companies,
  formOptions,
  selectedId,
  onSelect,
  onAddCompany,
}: {
  companies: Company[]
  formOptions: FormOptions
  selectedId: string
  onSelect: (id: string) => void
  onAddCompany: (input: CompanyInput) => Company
}) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(!selectedId)
  const [isAdding, setIsAdding] = useState(false)
  const [draft, setDraft] = useState<CompanyInput>({ name: '', industry: '', size: '', location: '', about: '' })

  const selected = companies.find((company) => company.id === selectedId)
  const matches = companies.filter((company) => company.name.toLowerCase().includes(query.trim().toLowerCase()))
  const canSaveCompany = draft.name.trim() && draft.industry && draft.size && draft.location.trim()

  if (selected && !isSearching && !isAdding) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
        <CompanyLogo company={selected} size="md" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-stone-900">{selected.name}</p>
          <p className="truncate text-xs text-stone-500">
            {selected.industry} · {selected.size} · {selected.location}
          </p>
        </div>
        <button type="button" onClick={() => setIsSearching(true)} className={BTN_GHOST}>
          Change
        </button>
      </div>
    )
  }

  if (isAdding) {
    return (
      <div className="ap-rise rounded-xl border border-teal-200 bg-teal-50/50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-teal-900">
            <Building2 className="h-4 w-4" />
            New client company
          </p>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            aria-label="Cancel adding company"
            className="rounded-lg p-1 text-stone-500 hover:bg-white hover:text-stone-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="co-name" className={LABEL}>
              Company name
            </label>
            <input id="co-name" className={INPUT} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div>
            <label htmlFor="co-industry" className={LABEL}>
              Industry
            </label>
            <select id="co-industry" className={INPUT} value={draft.industry} onChange={(e) => setDraft({ ...draft, industry: e.target.value })}>
              <option value="">Choose an industry</option>
              {formOptions.industries.map((industry) => (
                <option key={industry}>{industry}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="co-size" className={LABEL}>
              Company size
            </label>
            <select id="co-size" className={INPUT} value={draft.size} onChange={(e) => setDraft({ ...draft, size: e.target.value })}>
              <option value="">Choose a size</option>
              {formOptions.companySizes.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="co-location" className={LABEL}>
              Location
            </label>
            <input
              id="co-location"
              className={INPUT}
              placeholder="For example, Ikeja, Lagos"
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="co-logo" className={LABEL}>
              Logo <span className="font-normal text-stone-400">(optional)</span>
            </label>
            <input
              id="co-logo"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={(e) => setDraft({ ...draft, logoFile: e.target.files?.[0] })}
              className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-stone-800 file:shadow-sm file:ring-1 file:ring-stone-300"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="co-about" className={LABEL}>
              About
            </label>
            <textarea
              id="co-about"
              rows={3}
              className={INPUT}
              placeholder="One or two sentences candidates will see on the job page"
              value={draft.about}
              onChange={(e) => setDraft({ ...draft, about: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setIsAdding(false)} className={BTN_SECONDARY}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSaveCompany}
            onClick={() => {
              const company = onAddCompany(draft)
              onSelect(company.id)
              setIsAdding(false)
              setIsSearching(false)
              setDraft({ name: '', industry: '', size: '', location: '', about: '' })
            }}
            className={BTN_PRIMARY}
          >
            Add company
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-300">
      <div className="relative border-b border-stone-200">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          autoFocus={Boolean(selectedId)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search client companies"
          aria-label="Search client companies"
          className="w-full bg-transparent py-2.5 pl-9 pr-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
        />
      </div>
      <ul className="max-h-56 overflow-y-auto py-1" role="listbox" aria-label="Client companies">
        {matches.map((company) => (
          <li key={company.id}>
            <button
              type="button"
              role="option"
              aria-selected={company.id === selectedId}
              onClick={() => {
                onSelect(company.id)
                setIsSearching(false)
                setQuery('')
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-stone-50"
            >
              <CompanyLogo company={company} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-stone-900">{company.name}</span>
                <span className="block truncate text-xs text-stone-500">
                  {company.industry} · {company.location}
                </span>
              </span>
              {company.id === selectedId && <Check className="h-4 w-4 text-teal-700" />}
            </button>
          </li>
        ))}
        {matches.length === 0 && <li className="px-3 py-3 text-sm text-stone-500">No company called "{query}" yet.</li>}
      </ul>
      <div className="flex items-center justify-between gap-2 border-t border-stone-200 bg-stone-50 px-3 py-2">
        <button
          type="button"
          onClick={() => {
            setDraft((current) => ({ ...current, name: query }))
            setIsAdding(true)
          }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:text-teal-950"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add new company
        </button>
        {selected && (
          <button type="button" onClick={() => setIsSearching(false)} className="text-sm text-stone-500 hover:text-stone-800">
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Screening questions
// -----------------------------------------------------------------------------

function QuestionsEditor({
  questions,
  types,
  onChange,
}: {
  questions: ScreeningQuestion[]
  types: FormOptions['screeningQuestionTypes']
  onChange: (questions: ScreeningQuestion[]) => void
}) {
  const update = (id: string, patch: Partial<ScreeningQuestion>) =>
    onChange(questions.map((question) => (question.id === id ? { ...question, ...patch } : question)))

  return (
    <div className="space-y-3">
      {questions.length === 0 && (
        <p className="rounded-xl border border-dashed border-stone-300 px-4 py-5 text-center text-sm text-stone-500">
          No screening questions. Candidates go straight from cover letter to review.
        </p>
      )}
      {questions.map((question, index) => (
        <div key={question.id} className="rounded-xl border border-stone-200 p-4">
          <div className="flex items-start gap-3">
            <span style={MONO} className="mt-2 text-xs font-medium text-stone-400">
              Q{index + 1}
            </span>
            <div className="min-w-0 flex-1 space-y-3">
              <input
                className={INPUT}
                placeholder="Question for candidates"
                aria-label={`Question ${index + 1}`}
                value={question.question}
                onChange={(e) => update(question.id, { question: e.target.value })}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  className={`${INPUT} sm:w-48`}
                  aria-label={`Answer type for question ${index + 1}`}
                  value={question.type}
                  onChange={(e) => update(question.id, { type: e.target.value as ScreeningQuestionType })}
                >
                  {types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <label className="inline-flex items-center gap-2 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => update(question.id, { required: e.target.checked })}
                    className="h-4 w-4 rounded border-stone-300 text-teal-700 focus:ring-teal-600"
                  />
                  Required
                </label>
              </div>
              {question.type === 'multiple-choice' && (
                <div>
                  <input
                    className={INPUT}
                    placeholder="Choices, separated by commas"
                    aria-label={`Choices for question ${index + 1}`}
                    value={question.options.join(', ')}
                    onChange={(e) =>
                      update(question.id, {
                        options: e.target.value.split(',').map((option) => option.trimStart()),
                      })
                    }
                  />
                  <p className={HINT}>For example: Morning, Afternoon, Either</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => onChange(questions.filter((item) => item.id !== question.id))}
              aria-label={`Remove question ${index + 1}`}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...questions,
            { id: `q-new-${Date.now()}`, question: '', type: 'short-text', required: true, options: [] },
          ])
        }
        className={BTN_SECONDARY}
      >
        <Plus className="h-4 w-4" />
        Add question
      </button>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Skills
// -----------------------------------------------------------------------------

function SkillsInput({ skills, onChange }: { skills: string[]; onChange: (skills: string[]) => void }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const value = draft.trim().replace(/,$/, '')
    if (value && !skills.includes(value)) onChange([...skills, value])
    setDraft('')
  }
  return (
    <div className="rounded-lg border border-stone-300 bg-white p-2 shadow-sm focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20">
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 rounded-md bg-teal-50 py-0.5 pl-2 pr-1 text-sm text-teal-900 ring-1 ring-inset ring-teal-200"
          >
            {skill}
            <button
              type="button"
              onClick={() => onChange(skills.filter((item) => item !== skill))}
              aria-label={`Remove ${skill}`}
              className="rounded p-0.5 hover:bg-teal-100"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id="job-skills"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              add()
            } else if (e.key === 'Backspace' && !draft && skills.length > 0) {
              onChange(skills.slice(0, -1))
            }
          }}
          onBlur={add}
          placeholder={skills.length === 0 ? 'Type a skill and press Enter' : 'Add another'}
          className="min-w-32 flex-1 bg-transparent px-1 py-0.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
        />
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Form
// -----------------------------------------------------------------------------

export function JobForm({ job, companies, formOptions, onCancel, onSubmit, onAddCompany }: JobFormProps) {
  const isEdit = Boolean(job)
  const [title, setTitle] = useState(job?.title ?? '')
  const [companyId, setCompanyId] = useState(job?.companyId ?? '')
  const [city, setCity] = useState(job?.location.city ?? '')
  const [state, setState] = useState(job?.location.state ?? '')
  const [workMode, setWorkMode] = useState<WorkMode>(job?.workMode ?? 'on-site')
  const [jobType, setJobType] = useState<JobType>(job?.jobType ?? 'full-time')
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(job?.experienceLevel ?? 'entry')
  const [salaryMin, setSalaryMin] = useState(job?.salary.min?.toString() ?? '')
  const [salaryMax, setSalaryMax] = useState(job?.salary.max?.toString() ?? '')
  const [isConfidential, setIsConfidential] = useState(job?.salary.isConfidential ?? false)
  const [deadline, setDeadline] = useState(job?.deadline ?? '')
  const [isGraduateFriendly, setIsGraduateFriendly] = useState(job?.isGraduateFriendly ?? false)
  const [summary, setSummary] = useState(job?.summary ?? '')
  const [description, setDescription] = useState(job?.description ?? '')
  const [responsibilities, setResponsibilities] = useState(toLines(job?.responsibilities ?? []))
  const [requirements, setRequirements] = useState(toLines(job?.requirements ?? []))
  const [benefits, setBenefits] = useState(toLines(job?.benefits ?? []))
  const [skills, setSkills] = useState<string[]>(job?.skills ?? [])
  const [questions, setQuestions] = useState<ScreeningQuestion[]>(job?.screeningQuestions ?? [])
  const [showErrors, setShowErrors] = useState(false)

  const isRemote = workMode === 'remote'
  const minNumber = salaryMin ? Number(salaryMin) : null
  const maxNumber = salaryMax ? Number(salaryMax) : null
  const salaryValid = isConfidential || (minNumber !== null && (maxNumber === null || maxNumber >= minNumber))

  const checklist = useMemo(
    () => [
      { label: 'Title and company', done: Boolean(title.trim() && companyId) },
      { label: 'Location', done: isRemote || Boolean(city.trim() && state) },
      { label: 'Salary or confidential', done: salaryValid },
      { label: 'Application deadline', done: Boolean(deadline) },
      { label: 'Summary and description', done: Boolean(summary.trim() && description.trim()) },
      { label: 'Responsibilities and requirements', done: fromLines(responsibilities).length > 0 && fromLines(requirements).length > 0 },
      {
        label: 'Screening questions complete',
        done: questions.every((q) => q.question.trim() && (q.type !== 'multiple-choice' || q.options.filter((o) => o.trim()).length >= 2)),
      },
    ],
    [title, companyId, isRemote, city, state, salaryValid, deadline, summary, description, responsibilities, requirements, questions],
  )
  const readyToPublish = checklist.every((item) => item.done)
  const canSaveDraft = Boolean(title.trim() && companyId)
  const isLive = job?.status === 'published' || job?.status === 'paused'

  const buildInput = (): JobInput => ({
    title: title.trim(),
    companyId,
    location: isRemote ? { city: 'Remote', state: 'Nigeria (Remote)' } : { city: city.trim(), state },
    workMode,
    jobType,
    experienceLevel,
    salary: isConfidential ? { min: null, max: null, isConfidential: true } : { min: minNumber, max: maxNumber, isConfidential: false },
    deadline,
    isGraduateFriendly,
    summary: summary.trim(),
    description: description.trim(),
    responsibilities: fromLines(responsibilities),
    requirements: fromLines(requirements),
    benefits: fromLines(benefits),
    skills,
    screeningQuestions: questions.map((q) => ({ ...q, question: q.question.trim(), options: q.options.map((o) => o.trim()).filter(Boolean) })),
  })

  const submit = (publish: boolean) => {
    const allowed = publish || isLive ? readyToPublish : canSaveDraft
    if (!allowed) {
      setShowErrors(true)
      return
    }
    onSubmit(buildInput(), publish)
  }

  const fieldError = (condition: boolean, message: string) =>
    showErrors && condition ? <p className="mt-1 text-xs font-medium text-rose-700">{message}</p> : null

  const primaryLabel = !isEdit ? 'Publish job' : job?.status === 'draft' ? 'Save and publish' : 'Save changes'
  const primaryPublishes = !isEdit || job?.status === 'draft'

  return (
    <div>
      <button type="button" onClick={onCancel} className={`${BTN_GHOST} -ml-3 mb-3`}>
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </button>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">{isEdit ? 'Edit job' : 'New job'}</h1>
          <p className="mt-1 text-sm text-stone-500">
            {isEdit
              ? 'Changes to a published job show on the job board as soon as you save.'
              : 'Save as a draft to finish later, or publish to put it on the job board straight away.'}
          </p>
        </div>
        {job && <JobStatusBadge status={job.status} closedReason={job.closedReason} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <FormSection title="Role basics">
            <div>
              <label htmlFor="job-title" className={LABEL}>
                Job title
              </label>
              <input
                id="job-title"
                className={INPUT}
                placeholder="For example, Data Analyst"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {fieldError(!title.trim(), 'Add a job title.')}
            </div>
            <div>
              <span className={LABEL}>Hiring company</span>
              <CompanyPicker
                companies={companies}
                formOptions={formOptions}
                selectedId={companyId}
                onSelect={setCompanyId}
                onAddCompany={onAddCompany}
              />
              {fieldError(!companyId, 'Choose or add the client company.')}
            </div>
            <div>
              <span className={LABEL}>Work mode</span>
              <Segmented label="Work mode" options={formOptions.workModes} value={workMode} onChange={setWorkMode} />
            </div>
            {!isRemote && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="job-city" className={LABEL}>
                    City or area
                  </label>
                  <input id="job-city" className={INPUT} placeholder="For example, Ikeja" value={city} onChange={(e) => setCity(e.target.value)} />
                  {fieldError(!city.trim(), 'Add the city or area.')}
                </div>
                <div>
                  <label htmlFor="job-state" className={LABEL}>
                    State
                  </label>
                  <select id="job-state" className={INPUT} value={state} onChange={(e) => setState(e.target.value)}>
                    <option value="">Choose a state</option>
                    {formOptions.states
                      .filter((option) => !option.includes('Remote'))
                      .map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                  </select>
                  {fieldError(!state, 'Choose a state.')}
                </div>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="job-type" className={LABEL}>
                  Job type
                </label>
                <select id="job-type" className={INPUT} value={jobType} onChange={(e) => setJobType(e.target.value as JobType)}>
                  {formOptions.jobTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="job-experience" className={LABEL}>
                  Experience level
                </label>
                <select
                  id="job-experience"
                  className={INPUT}
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                >
                  {formOptions.experienceLevels.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </FormSection>

          <FormSection title="Pay and deadline" description="Monthly salary in naira. Ranges get more applicants than confidential pay.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="job-min" className={LABEL}>
                  Minimum per month
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400">₦</span>
                  <input
                    id="job-min"
                    inputMode="numeric"
                    disabled={isConfidential}
                    style={MONO}
                    className={`${INPUT} pl-7`}
                    placeholder="250000"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="job-max" className={LABEL}>
                  Maximum per month <span className="font-normal text-stone-400">(optional)</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400">₦</span>
                  <input
                    id="job-max"
                    inputMode="numeric"
                    disabled={isConfidential}
                    style={MONO}
                    className={`${INPUT} pl-7`}
                    placeholder="400000"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            </div>
            {fieldError(!salaryValid, 'Add a minimum salary (and a maximum that is not lower), or mark it confidential.')}
            <label className="inline-flex items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={isConfidential}
                onChange={(e) => setIsConfidential(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-teal-700 focus:ring-teal-600"
              />
              Salary is confidential
            </label>
            <div className="sm:w-1/2">
              <label htmlFor="job-deadline" className={LABEL}>
                Application deadline
              </label>
              <input id="job-deadline" type="date" style={MONO} className={INPUT} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              {fieldError(!deadline, 'Choose the date applications close.')}
            </div>
          </FormSection>

          <FormSection title="Description" description="What candidates read on the job page.">
            <div>
              <label htmlFor="job-summary" className={LABEL}>
                Summary
              </label>
              <input
                id="job-summary"
                className={INPUT}
                maxLength={140}
                placeholder="One sentence shown on the job card"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <p className={HINT}>
                <span style={MONO}>{summary.length}</span>/140 characters
              </p>
              {fieldError(!summary.trim(), 'Add a one-sentence summary.')}
            </div>
            <div>
              <label htmlFor="job-description" className={LABEL}>
                About the role
              </label>
              <textarea id="job-description" rows={5} className={INPUT} value={description} onChange={(e) => setDescription(e.target.value)} />
              {fieldError(!description.trim(), 'Describe the role.')}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="job-responsibilities" className={LABEL}>
                  Responsibilities
                </label>
                <textarea
                  id="job-responsibilities"
                  rows={5}
                  className={INPUT}
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                />
                <p className={HINT}>One per line</p>
                {fieldError(fromLines(responsibilities).length === 0, 'Add at least one responsibility.')}
              </div>
              <div>
                <label htmlFor="job-requirements" className={LABEL}>
                  Requirements
                </label>
                <textarea id="job-requirements" rows={5} className={INPUT} value={requirements} onChange={(e) => setRequirements(e.target.value)} />
                <p className={HINT}>One per line</p>
                {fieldError(fromLines(requirements).length === 0, 'Add at least one requirement.')}
              </div>
            </div>
            <div>
              <label htmlFor="job-benefits" className={LABEL}>
                Benefits <span className="font-normal text-stone-400">(optional)</span>
              </label>
              <textarea id="job-benefits" rows={3} className={INPUT} value={benefits} onChange={(e) => setBenefits(e.target.value)} />
              <p className={HINT}>One per line</p>
            </div>
            <div>
              <label htmlFor="job-skills" className={LABEL}>
                Skills
              </label>
              <SkillsInput skills={skills} onChange={setSkills} />
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <input
                type="checkbox"
                checked={isGraduateFriendly}
                onChange={(e) => setIsGraduateFriendly(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
              />
              <span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-950">
                  <GraduationCap className="h-4 w-4" />
                  Graduate-friendly
                </span>
                <span className="mt-0.5 block text-xs text-amber-900/80">
                  Shows the Graduate-friendly badge and invites EduBridge graduates to apply.
                </span>
              </span>
            </label>
          </FormSection>

          <FormSection title="Screening questions" description="Optional. Candidates answer these as part of applying.">
            <QuestionsEditor questions={questions} types={formOptions.screeningQuestionTypes} onChange={setQuestions} />
          </FormSection>
        </div>

        {/* Sticky action card */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className={`${CARD} p-5`}>
            <p className={SECTION_TITLE}>{readyToPublish ? 'Ready to publish' : 'Before publishing'}</p>
            <ul className="mt-3 space-y-2">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm">
                  {item.done ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-700 text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  ) : (
                    <Circle className="h-4 w-4 text-stone-300" />
                  )}
                  <span className={item.done ? 'text-stone-700' : 'text-stone-500'}>{item.label}</span>
                </li>
              ))}
            </ul>

            {(title || companyId) && (
              <div className="mt-5 rounded-lg bg-stone-50 p-3">
                <p className="text-xs font-semibold text-stone-500">On the job board</p>
                <p className="mt-1 truncate text-sm font-semibold text-stone-900">{title || 'Untitled job'}</p>
                <p className="truncate text-xs text-stone-500">
                  {companies.find((c) => c.id === companyId)?.name ?? 'No company yet'}
                </p>
                <p style={MONO} className="mt-1 text-xs text-teal-800">
                  {formatSalary({
                    min: minNumber,
                    max: maxNumber,
                    isConfidential: isConfidential || (minNumber === null && maxNumber === null),
                  })}
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => submit(primaryPublishes)}
                className={`${BTN_PRIMARY} w-full ${!readyToPublish ? 'opacity-60' : ''}`}
              >
                {primaryLabel}
              </button>
              {(!isEdit || job?.status === 'draft') && (
                <button type="button" onClick={() => submit(false)} className={`${BTN_SECONDARY} w-full`}>
                  {isEdit ? 'Save draft' : 'Save as draft'}
                </button>
              )}
              <button type="button" onClick={onCancel} className={`${BTN_GHOST} w-full`}>
                Cancel
              </button>
            </div>
            {showErrors && !readyToPublish && (
              <p className="mt-3 text-xs font-medium text-rose-700">Some details are missing. Check the highlighted fields.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
