// =============================================================================
// Data Types
// =============================================================================

export type WorkMode = 'on-site' | 'hybrid' | 'remote'

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship'

export type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected' | 'withdrawn'

/** Filter tabs on the Applications screen */
export type ApplicationFilter = 'all' | 'active' | 'interviewing' | 'offers' | 'closed'

/** The four portal screens reachable from the portal tabs */
export type PortalTab = 'dashboard' | 'applications' | 'saved-jobs' | 'profile'

export type ActivityType = 'status-change' | 'application-submitted' | 'profile-view'

/** Profile cards that can be edited in place */
export type ProfileCardKey = 'about' | 'experience' | 'education' | 'skills' | 'preferences' | 'links' | 'cv'

/** Monthly salary in naira. min and max are null when the salary is confidential. */
export interface Salary {
  min: number | null
  max: number | null
  isConfidential: boolean
}

export interface ExperienceEntry {
  id: string
  title: string
  company: string
  location: string
  /** YYYY-MM */
  startDate: string
  /** YYYY-MM, or null while current */
  endDate: string | null
  isCurrent: boolean
  description: string
}

export interface EducationEntry {
  id: string
  qualification: string
  institution: string
  startYear: number
  endYear: number | null
  grade: string | null
}

export interface JobPreferences {
  locations: string[]
  jobTypes: JobType[]
  workModes: WorkMode[]
  /** Minimum monthly salary in naira, or null for no minimum */
  minMonthlySalary: number | null
}

export interface ProfileLinks {
  linkedin: string | null
  portfolio: string | null
  github: string | null
}

export interface CvFile {
  fileName: string
  fileSizeKb: number
  /** ISO date (YYYY-MM-DD) */
  uploadedAt: string
}

/** Staff-confirmed record that the candidate completed an EduBridge program */
export interface GraduateVerification {
  programName: string
  /** ISO date (YYYY-MM-DD) */
  completedAt: string
  /** ISO date (YYYY-MM-DD) */
  verifiedAt: string
}

export interface CandidateProfile {
  id: string
  fullName: string
  email: string
  phone: string | null
  avatarUrl: string | null
  headline: string
  location: string
  bio: string
  isOpenToWork: boolean
  links: ProfileLinks
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  preferences: JobPreferences
  /** Null when no CV has been uploaded yet */
  cv: CvFile | null
  /** Null when the candidate is not a verified EduBridge graduate */
  graduateVerification: GraduateVerification | null
}

export interface MissingProfileItem {
  /** 'photo' or the profile card that fixes this item */
  key: ProfileCardKey | 'photo'
  label: string
}

export interface ProfileCompleteness {
  percent: number
  missing: MissingProfileItem[]
}

export interface ApplicationJob {
  id: string
  title: string
  companyName: string
  companyId: string
  location: string
  workMode: WorkMode
  jobType: JobType
  salary: Salary
  /** Client role recruited by EduBridge; shows the "Hiring through EduBridge" badge */
  isManagedByEduBridge: boolean
}

export interface TimelineEvent {
  status: ApplicationStatus
  /** ISO date-time */
  date: string
  note: string | null
}

export interface SubmittedAnswer {
  question: string
  answer: string
}

export interface ApplicationSubmission {
  cvFileName: string
  /** Empty string when no cover letter was sent */
  coverLetter: string
  answers: SubmittedAnswer[]
}

export interface Application {
  id: string
  job: ApplicationJob
  status: ApplicationStatus
  /** ISO date-time */
  appliedAt: string
  /** ISO date-time of the latest status change */
  updatedAt: string
  /** Oldest first */
  timeline: TimelineEvent[]
  submission: ApplicationSubmission
}

export interface SavedJobSummary {
  id: string
  title: string
  companyName: string
  companyId: string
  location: string
  workMode: WorkMode
  jobType: JobType
  salary: Salary
  /** ISO date (YYYY-MM-DD) */
  deadline: string
  isGraduateFriendly: boolean
}

export interface SavedJob {
  id: string
  /** ISO date-time */
  savedAt: string
  hasApplied: boolean
  job: SavedJobSummary
}

export interface RecommendedJob {
  id: string
  title: string
  companyName: string
  companyId: string
  location: string
  workMode: WorkMode
  jobType: JobType
  salary: Salary
  /** ISO date-time */
  postedAt: string
  isGraduateFriendly: boolean
  isSaved: boolean
  matchReason: string
}

export interface ActivityItem {
  id: string
  type: ActivityType
  message: string
  /** ISO date-time */
  date: string
  applicationId: string | null
}

export interface Option<T extends string = string> {
  value: T
  label: string
}

/** Choices for the Job preferences form */
export interface PreferenceOptions {
  locations: string[]
  jobTypes: Option<JobType>[]
  workModes: Option<WorkMode>[]
}

/** Fields edited in the About card */
export interface AboutUpdate {
  headline: string
  location: string
  phone: string | null
  bio: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface PortalNavigationProps {
  /** Called when the candidate picks a portal tab */
  onNavigate?: (tab: PortalTab) => void
}

export interface CandidateDashboardProps extends PortalNavigationProps {
  profile: CandidateProfile
  completeness: ProfileCompleteness
  applications: Application[]
  savedJobs: SavedJob[]
  recommendedJobs: RecommendedJob[]
  activity: ActivityItem[]

  /** Called when the candidate opens an application */
  onViewApplication?: (applicationId: string) => void
  /** Called when the candidate picks a missing profile item; opens the profile at that card */
  onFixProfileItem?: (key: MissingProfileItem['key']) => void
  /** Called when the candidate opens a job on the Job Board */
  onViewJob?: (jobId: string) => void
  /** Called when the candidate saves a recommended job */
  onSaveJob?: (jobId: string) => void
  /** Called when the candidate removes a recommended job from saved jobs */
  onUnsaveJob?: (jobId: string) => void
  /** Called when the candidate starts applying to a saved job that is closing soon */
  onApply?: (jobId: string) => void
  /** Called from the graduate card to open the Job Board filtered to graduate-friendly roles */
  onBrowseGraduateJobs?: () => void
}

export interface ApplicationsProps extends PortalNavigationProps {
  applications: Application[]
  /** Initial filter tab */
  initialFilter?: ApplicationFilter
  /** Application to open in the detail view */
  selectedApplicationId?: string

  /** Called when the candidate opens an application */
  onViewApplication?: (applicationId: string) => void
  /** Called when the candidate returns from the detail view to the list */
  onBackToList?: () => void
  /** Called when the candidate opens the job behind an application */
  onViewJob?: (jobId: string) => void
  /** Called when the candidate confirms withdrawing an application */
  onWithdraw?: (applicationId: string, reason: string) => void
  /** Called when the candidate opens the CV they submitted */
  onViewSubmittedCv?: (applicationId: string) => void
  /** Called from an empty state to go to the Job Board */
  onBrowseJobs?: () => void
}

export interface SavedJobsProps extends PortalNavigationProps {
  savedJobs: SavedJob[]

  /** Called when the candidate starts applying to a saved job */
  onApply?: (jobId: string) => void
  /** Called when the candidate opens a saved job on the Job Board */
  onViewJob?: (jobId: string) => void
  /** Called when the candidate removes a job from saved jobs */
  onRemove?: (savedJobId: string) => void
  /** Called from the empty state to go to the Job Board */
  onBrowseJobs?: () => void
}

export interface ProfileProps extends PortalNavigationProps {
  profile: CandidateProfile
  completeness: ProfileCompleteness
  preferenceOptions: PreferenceOptions
  /** Card to scroll to and open for editing when the page loads */
  focusCard?: ProfileCardKey

  /** Called when the Open to work switch changes */
  onToggleOpenToWork?: (isOpenToWork: boolean) => void
  /** Called when the candidate chooses a new profile photo */
  onUploadPhoto?: (file: File) => void
  /** Called when the About card is saved */
  onUpdateAbout?: (about: AboutUpdate) => void
  /** Called when the Experience card is saved with the full updated list */
  onUpdateExperience?: (experience: ExperienceEntry[]) => void
  /** Called when the Education card is saved with the full updated list */
  onUpdateEducation?: (education: EducationEntry[]) => void
  /** Called when the Skills card is saved */
  onUpdateSkills?: (skills: string[]) => void
  /** Called when the Job preferences card is saved */
  onUpdatePreferences?: (preferences: JobPreferences) => void
  /** Called when the Links card is saved */
  onUpdateLinks?: (links: ProfileLinks) => void
  /** Called when the candidate picks a new CV file (PDF or Word, up to 5MB) */
  onReplaceCv?: (file: File) => void
  /** Called when the candidate opens their current CV */
  onViewCv?: () => void
  /** Called from the graduate badge to open graduate-friendly roles */
  onBrowseGraduateJobs?: () => void
}

/** All data and callbacks for the Candidate Portal section */
export type CandidatePortalProps = CandidateDashboardProps & ApplicationsProps & SavedJobsProps & ProfileProps
