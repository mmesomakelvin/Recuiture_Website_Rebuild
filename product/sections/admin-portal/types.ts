// =============================================================================
// Data Types
// =============================================================================

export type WorkMode = 'on-site' | 'hybrid' | 'remote'

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship'

export type ExperienceLevel = 'entry' | 'mid' | 'senior'

export type ScreeningQuestionType = 'short-text' | 'number' | 'yes-no' | 'multiple-choice'

/** Draft: not public. Published: in public search. Paused: hidden from search, applicants kept. Closed: finished. */
export type JobStatus = 'draft' | 'published' | 'paused' | 'closed'

/** Filled moves remaining active applicants to Not selected; Cancelled moves them to Role cancelled */
export type ClosedReason = 'filled' | 'cancelled'

export type ApplicationStage =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'not-selected'
  | 'withdrawn'
  | 'role-cancelled'

/** The stages staff can move an applicant to. Withdrawn is set by the candidate; Role cancelled by closing a job as cancelled. */
export type StaffSettableStage = 'screening' | 'interview' | 'offer' | 'hired' | 'not-selected'

export type ActorKind = 'candidate' | 'staff' | 'system'

export type EmailStatus = 'sent' | 'queued' | 'failed'

export type EnquirySource = 'contact' | 'for-employers'

export type EnquiryStatus = 'new' | 'in-progress' | 'closed'

export type AdminView = 'overview' | 'jobs' | 'applications' | 'enquiries'

export interface StaffUser {
  id: string
  name: string
  email: string
}

export interface Company {
  id: string
  name: string
  /** Null when the company has no logo; show initials instead */
  logoUrl: string | null
  industry: string
  size: string
  location: string
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

export interface AdminJob {
  id: string
  slug: string
  title: string
  companyId: string
  status: JobStatus
  /** Set only when status is 'closed' */
  closedReason: ClosedReason | null
  location: JobLocation
  workMode: WorkMode
  jobType: JobType
  experienceLevel: ExperienceLevel
  salary: Salary
  /** ISO date-time */
  createdAt: string
  /** ISO date-time */
  updatedAt: string
  /** ISO date-time the job was first published; null for drafts */
  postedAt: string | null
  /** ISO date (YYYY-MM-DD) applications close */
  deadline: string
  isGraduateFriendly: boolean
  /** Shows the "Hiring through EduBridge" badge on the public job board */
  isManagedByEduBridge: boolean
  summary: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  skills: string[]
  screeningQuestions: ScreeningQuestion[]
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  location: string
  isVerifiedGraduate: boolean
  /** Program name when the candidate is a verified graduate; otherwise null */
  graduateProgram: string | null
}

export interface ApplicationCv {
  fileName: string
  fileSizeKb: number
}

export interface ScreeningAnswer {
  questionId: string
  question: string
  answer: string
}

export interface HistoryEntry {
  id: string
  stage: ApplicationStage
  /** ISO date-time */
  at: string
  actorKind: ActorKind
  actorName: string
  /** Optional personal note included in the candidate email */
  note: string | null
  emailStatus: EmailStatus
}

export interface Application {
  id: string
  /** Short reference shown in mono, for example RC-24081 */
  reference: string
  jobId: string
  candidate: Candidate
  cv: ApplicationCv
  /** Empty string when the candidate wrote no cover letter */
  coverLetter: string
  /** Empty when the job has no screening questions */
  answers: ScreeningAnswer[]
  stage: ApplicationStage
  /** ISO date-time */
  submittedAt: string
  /** ISO date (YYYY-MM-DD), seven calendar days after submission. Overdue while the stage is still 'applied' after this date. */
  firstReviewDueDate: string
  /** ISO date-time staff marked the interview as completed; null until then */
  interviewCompletedAt: string | null
  /** ISO date (YYYY-MM-DD) staff confirmed for the next update after an interview; null until set */
  nextUpdateDueDate: string | null
  /** Oldest entry first */
  history: HistoryEntry[]
}

export interface EmployerDetails {
  companyName: string
  contactRole: string
  rolesToFill: number
  hiringTimeline: string
}

export interface EnquiryNote {
  id: string
  authorName: string
  body: string
  /** ISO date-time */
  at: string
}

export interface Enquiry {
  id: string
  /** Short reference shown in mono, for example EQ-1042 */
  reference: string
  source: EnquirySource
  status: EnquiryStatus
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  /** ISO date-time */
  receivedAt: string
  /** Present only for For Employers enquiries */
  employerDetails: EmployerDetails | null
  /** Oldest first; may be empty */
  notes: EnquiryNote[]
}

/** Email preview for a stage move. Placeholders: {candidateName}, {jobTitle}, {companyName} */
export interface StageEmailTemplate {
  stage: StaffSettableStage
  subject: string
  body: string
}

export interface Option<T extends string = string> {
  value: T
  label: string
}

export interface FormOptions {
  jobTypes: Option<JobType>[]
  workModes: Option<WorkMode>[]
  experienceLevels: Option<ExperienceLevel>[]
  states: string[]
  industries: string[]
  companySizes: string[]
  screeningQuestionTypes: Option<ScreeningQuestionType>[]
}

/** What the job form submits when creating or editing a job */
export interface JobInput {
  title: string
  companyId: string
  location: JobLocation
  workMode: WorkMode
  jobType: JobType
  experienceLevel: ExperienceLevel
  salary: Salary
  deadline: string
  isGraduateFriendly: boolean
  summary: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  skills: string[]
  screeningQuestions: ScreeningQuestion[]
}

/** What the inline company form submits */
export interface CompanyInput {
  name: string
  logoFile?: File
  industry: string
  size: string
  location: string
  about: string
}

// =============================================================================
// Component Props
// =============================================================================

/** One week of activity for the Overview chart */
export interface WeeklyActivity {
  /** Monday the week starts on (YYYY-MM-DD) */
  weekStart: string
  /** Applications received that week */
  applications: number
  /** Candidates moved to Interview that week */
  interviews: number
}

export interface AdminPortalProps {
  currentStaff: StaffUser
  /** Today's date (YYYY-MM-DD, Africa/Lagos) used for due, overdue and closing-soon calculations */
  today: string
  companies: Company[]
  jobs: AdminJob[]
  applications: Application[]
  enquiries: Enquiry[]
  /** Last eight weeks of activity, oldest first, for the Overview chart */
  weeklyActivity: WeeklyActivity[]
  stageEmailTemplates: StageEmailTemplate[]
  formOptions: FormOptions
  /** Which area is open; defaults to the Overview */
  activeView?: AdminView

  /** Called when staff switch area from the sidebar or an Overview link */
  onNavigate?: (view: AdminView) => void
  /** Called when staff sign out from the account menu */
  onSignOut?: () => void

  /** Called when staff save a new job; publish is false for Save as draft */
  onCreateJob?: (input: JobInput, publish: boolean) => void
  /** Called when staff save changes to an existing job */
  onUpdateJob?: (jobId: string, input: JobInput) => void
  /** Called when staff publish a draft */
  onPublishJob?: (jobId: string) => void
  /** Called when staff pause a published job; it leaves public search but keeps its applicants */
  onPauseJob?: (jobId: string) => void
  /** Called when staff resume a paused job */
  onResumeJob?: (jobId: string) => void
  /** Called when staff confirm closing a job; resolves its active applicants and emails them */
  onCloseJob?: (jobId: string, reason: ClosedReason) => void
  /** Called when staff add a new client company inline from the job form */
  onCreateCompany?: (input: CompanyInput) => void

  /** Called when staff open a candidate's CV */
  onOpenCv?: (applicationId: string) => void
  /** Called when staff confirm a stage move in the email preview dialog */
  onMoveApplication?: (applicationId: string, stage: StaffSettableStage, note: string | null) => void
  /** Called when staff mark an interview completed and confirm the next update date (YYYY-MM-DD) */
  onCompleteInterview?: (applicationId: string, nextUpdateDueDate: string) => void

  /** Called when staff change an enquiry's status */
  onUpdateEnquiryStatus?: (enquiryId: string, status: EnquiryStatus) => void
  /** Called when staff add an internal note to an enquiry */
  onAddEnquiryNote?: (enquiryId: string, body: string) => void
  /** Called when staff choose Reply by email; opens their email client addressed to the sender */
  onReplyToEnquiry?: (enquiryId: string) => void
}
