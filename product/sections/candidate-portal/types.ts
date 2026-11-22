// =============================================================================
// Data Types
// =============================================================================

export type WorkMode = 'on-site' | 'hybrid' | 'remote'

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship'

/** Same stages the EduBridge team uses in the Admin Portal */
export type ApplicationStage =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'not-selected'
  | 'withdrawn'
  | 'role-cancelled'

/** Who made a change in the history */
export type ActorKind = 'candidate' | 'staff' | 'system'

/** Filter tabs above the application list */
export type ApplicationFilter = 'active' | 'closed' | 'all'

/** Tabs inside the signed-in portal */
export type PortalTab = 'applications' | 'profile'

export interface Salary {
  /** Monthly amount in naira */
  min: number | null
  max: number | null
  isConfidential: boolean
}

export interface CvFile {
  fileName: string
  sizeBytes: number
  /** ISO date-time */
  uploadedAt: string
}

export interface Candidate {
  id: string
  fullName: string
  email: string
  phone: string
  /** Nigerian state, for example "Lagos" or "Abuja (FCT)" */
  location: string
  /** Null until the candidate uploads one */
  cv: CvFile | null
}

/** The job as the candidate saw it when they applied */
export interface AppliedJob {
  id: string
  slug: string
  title: string
  companyName: string
  city: string
  state: string
  workMode: WorkMode
  jobType: JobType
  salary: Salary
  /** True when the EduBridge recruiting team manages hiring for this client */
  isManagedByEduBridge: boolean
}

export interface HistoryEntry {
  id: string
  stage: ApplicationStage
  /** ISO date-time */
  at: string
  actorKind: ActorKind
  /** Optional personal note from the hiring team, also included in the email */
  note: string | null
  /** True when an email went to the candidate about this change */
  emailSent: boolean
}

export interface ScreeningAnswer {
  question: string
  answer: string
}

export interface Submission {
  cvFileName: string
  coverLetter: string | null
  answers: ScreeningAnswer[]
}

export interface Application {
  id: string
  /** Short reference, for example RC-24081 */
  reference: string
  job: AppliedJob
  stage: ApplicationStage
  /** ISO date-time the application was sent */
  submittedAt: string
  /** ISO date-time of the latest history entry */
  updatedAt: string
  /** Date (YYYY-MM-DD) by which the first review is due: 7 calendar days after applying */
  firstReviewDueDate: string
  /** Date (YYYY-MM-DD) the interview was marked completed, if it has been */
  interviewCompletedAt: string | null
  /** Date (YYYY-MM-DD) the next update is due after an interview */
  nextUpdateDueDate: string | null
  /** Every stage change, oldest first */
  history: HistoryEntry[]
  submission: Submission
}

export interface Option {
  value: string
  label: string
}

/** The job a visitor was trying to apply for when asked to sign in */
export interface ContinueToJob {
  title: string
  companyName: string
}

export interface ProfileInput {
  fullName: string
  phone: string
  location: string
}

export interface SignUpInput {
  fullName: string
  email: string
  phone: string
  password: string
}

// =============================================================================
// Component Props
// =============================================================================

/** The signed-in portal: application tracker, application detail and profile */
export interface CandidatePortalProps {
  candidate: Candidate
  /** Today's date (YYYY-MM-DD, Africa/Lagos) */
  today: string
  applications: Application[]
  /** Nigerian states for the location field */
  locationOptions: Option[]
  /** Which tab is open; defaults to My applications */
  activeTab?: PortalTab
  /** Opens this application's detail straight away */
  initialApplicationId?: string | null

  /** Called when the candidate switches portal tab */
  onTabChange?: (tab: PortalTab) => void
  /** Called when the candidate opens an application */
  onOpenApplication?: (applicationId: string) => void
  /** Called when the candidate opens the job on the Job Board */
  onViewJob?: (jobSlug: string) => void
  /** Called when the candidate opens the CV they sent with an application */
  onOpenSubmittedCv?: (applicationId: string) => void
  /** Called when the candidate confirms a withdrawal; reason may be empty */
  onWithdraw?: (applicationId: string, reason: string) => void
  /** Called from the empty state to go to the Job Board */
  onBrowseJobs?: () => void
  /** Called when the candidate saves their details */
  onUpdateProfile?: (input: ProfileInput) => void
  /** Called when the candidate opens their current CV */
  onViewCv?: () => void
  /** Called with a valid new CV (PDF or Word, 5 MB or less) */
  onReplaceCv?: (file: File) => void
  /** Called when the candidate asks for a password reset email */
  onRequestPasswordReset?: (email: string) => void
}

/** The account screens shown to visitors */
export interface AccountScreensProps {
  /** Job the visitor was applying for, shown in a banner */
  continueTo?: ContinueToJob | null
  /** Error from the last attempt, for example wrong email or password */
  errorMessage?: string | null

  /** Called when a visitor signs in */
  onSignIn?: (email: string, password: string) => void
  /** Called when a visitor creates an account */
  onSignUp?: (input: SignUpInput) => void
  /** Called when a visitor asks for a reset link */
  onRequestPasswordReset?: (email: string) => void
  /** Called when a visitor sets a new password from the reset link */
  onSetNewPassword?: (password: string) => void
  /** Called to move between account screens */
  onGoToSignIn?: () => void
  onGoToSignUp?: () => void
  onGoToForgotPassword?: () => void
  /** Called when a visitor opens the terms or privacy page */
  onOpenTerms?: () => void
}
