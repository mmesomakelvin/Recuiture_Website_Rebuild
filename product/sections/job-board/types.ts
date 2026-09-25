// =============================================================================
// Data Types
// =============================================================================

export type WorkMode = 'on-site' | 'hybrid' | 'remote'

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship'

export type ExperienceLevel = 'entry' | 'mid' | 'senior'

export type SortOption = 'relevance' | 'newest' | 'salary-high'

export type ScreeningQuestionType = 'short-text' | 'number' | 'yes-no' | 'multiple-choice'

export interface Company {
  id: string
  name: string
  /** Null when the company has no logo; show initials instead */
  logoUrl: string | null
  industry: string
  size: string
  location: string
  isVerified: boolean
  about: string
}

export interface JobLocation {
  city: string
  state: string
}

/** Monthly salary in naira. min and max are null when the salary is confidential. */
export interface Salary {
  min: number | null
  max: number | null
  isConfidential: boolean
}

export interface ScreeningQuestion {
  id: string
  question: string
  type: ScreeningQuestionType
  required: boolean
  /** Choices for multiple-choice questions; empty for other types */
  options: string[]
}

export interface Job {
  id: string
  slug: string
  title: string
  company: Company
  location: JobLocation
  workMode: WorkMode
  jobType: JobType
  experienceLevel: ExperienceLevel
  salary: Salary
  /** ISO date-time the job was published */
  postedAt: string
  /** ISO date (YYYY-MM-DD) applications close */
  deadline: string
  applicantCount: number
  /** Open to EduBridge graduates; shows the amber "Graduate-friendly" badge */
  isGraduateFriendly: boolean
  /** Client role recruited by EduBridge; shows the "Hiring through EduBridge" badge */
  isManagedByEduBridge: boolean
  summary: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  skills: string[]
  /** Empty when the employer added no questions; the Questions step is then skipped */
  screeningQuestions: ScreeningQuestion[]
}

export interface SavedCv {
  fileName: string
  fileSizeKb: number
  /** ISO date (YYYY-MM-DD) */
  uploadedAt: string
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  isVerifiedGraduate: boolean
  graduateProgram?: string
  /** Null when the candidate has not uploaded a CV to their profile yet */
  savedCv: SavedCv | null
  savedJobIds: string[]
  appliedJobIds: string[]
}

export interface Option<T extends string = string> {
  value: T
  label: string
}

export interface SalaryRangeOption extends Option {
  min: number
  /** Null for the open-ended top band */
  max: number | null
}

export interface FilterOptions {
  locations: string[]
  jobTypes: Option<JobType>[]
  workModes: Option<WorkMode>[]
  experienceLevels: Option<ExperienceLevel>[]
  salaryRanges: SalaryRangeOption[]
  sortOptions: Option<SortOption>[]
}

/** The current search, filter and sort state of the board */
export interface JobSearchState {
  keyword: string
  location: string
  locations: string[]
  jobTypes: JobType[]
  workModes: WorkMode[]
  experienceLevels: ExperienceLevel[]
  /** Value of the selected SalaryRangeOption, or null for any salary */
  salaryRange: string | null
  graduateFriendlyOnly: boolean
  sort: SortOption
}

export type ShareChannel = 'copy-link' | 'whatsapp' | 'linkedin'

/** Everything the candidate submits at the end of the apply flow */
export interface ApplicationSubmission {
  jobId: string
  /** 'saved' uses the profile CV; 'upload' uses the newly chosen file */
  cvSource: 'saved' | 'upload'
  uploadedCvFile?: File
  coverLetter: string
  /** Answers keyed by screening question id */
  answers: Record<string, string>
}

// =============================================================================
// Component Props
// =============================================================================

export interface JobBoardProps {
  /** Live jobs. The board applies search, filters and sort to these locally and reports every change through the callbacks */
  jobs: Job[]
  /** Signed-in candidate, or null when a guest is browsing */
  currentUser: CurrentUser | null
  filterOptions: FilterOptions
  /** Initial search, filter and sort state */
  searchState?: JobSearchState
  /** Id of the job shown in the detail panel; defaults to the first job */
  selectedJobId?: string

  /** Called when the user submits the keyword and location search */
  onSearch?: (keyword: string, location: string) => void
  /** Called whenever a filter or the sort order changes */
  onSearchStateChange?: (state: JobSearchState) => void
  /** Called when the user clears all filters, including from the empty state */
  onClearFilters?: () => void
  /** Called when the user selects a job in the list (on mobile this opens the full detail page) */
  onSelectJob?: (jobId: string) => void
  /** Called when a signed-in candidate saves a job */
  onSaveJob?: (jobId: string) => void
  /** Called when a signed-in candidate removes a saved job */
  onUnsaveJob?: (jobId: string) => void
  /** Called when the user shares a job through a channel */
  onShareJob?: (jobId: string, channel: ShareChannel) => void
  /** Called when a signed-in candidate clicks Apply; starts the apply flow */
  onApply?: (jobId: string) => void
  /** Called when a guest chooses Sign in from the sign in prompt */
  onSignIn?: () => void
  /** Called when a guest chooses Create account from the sign in prompt */
  onCreateAccount?: () => void
}

export interface ApplyFlowProps {
  /** The job being applied to */
  job: Job
  /** The signed-in candidate applying */
  currentUser: CurrentUser

  /** Called when the candidate submits the application from the review step */
  onSubmit?: (submission: ApplicationSubmission) => void
  /** Called when the candidate leaves the flow before submitting */
  onCancel?: () => void
  /** Called from the success state to open the candidate's applications */
  onViewApplications?: () => void
  /** Called from the success state to return to the job board */
  onKeepBrowsing?: () => void
}
