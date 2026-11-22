import { useState } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CircleCheck,
  FilePlus2,
  Inbox,
  MapPin,
  MoveRight,
  Undo2,
  Users,
  XCircle,
} from 'lucide-react'
import type {
  AdminJob,
  AdminView,
  Application,
  Company,
  Enquiry,
  StaffUser,
  WeeklyActivity,
} from '@/../product/sections/admin-portal/types'
import { ActivityChart } from './ActivityChart'
import { Avatar, CompanyLogo, DueTag, EmptyState, GraduateMarker, SourceTag } from './Bits'
import {
  STAGE_LABELS,
  awaitsFirstReview,
  daysUntil,
  formatDate,
  formatLocation,
  formatSalary,
  isClosingSoon,
  isFirstReviewOverdue,
  needsInterviewUpdate,
  pluralise,
  relativeDay,
} from './format'
import { CARD } from './styles'

interface OverviewProps {
  currentStaff: StaffUser
  today: string
  weeklyActivity: WeeklyActivity[]
  jobs: AdminJob[]
  applications: Application[]
  enquiries: Enquiry[]
  companiesById: Map<string, Company>
  onNavigate: (view: AdminView) => void
  onOpenApplication: (applicationId: string) => void
  onOpenEnquiry: (enquiryId: string) => void
  onOpenJobApplicants: (jobId: string) => void
}

/** "Today" becomes "today" mid-sentence; dates like "10 Nov" are left alone */
function lowerFirstWord(text: string) {
  return text === 'Today' || text === 'Yesterday' ? text.toLowerCase() : text
}

const percent = (part: number, whole: number) => (whole === 0 ? 0 : Math.round((part / whole) * 100))

// -----------------------------------------------------------------------------
// Stat tiles
// -----------------------------------------------------------------------------

function StatTile({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  onClick,
  delay,
}: {
  label: string
  value: number
  detail: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  tone: 'teal' | 'amber' | 'emerald' | 'rose'
  onClick: () => void
  delay: number
}) {
  const tones = {
    teal: 'bg-teal-800 text-white dark:bg-teal-700',
    amber: 'bg-amber-400 text-teal-950',
    emerald: 'bg-emerald-700 text-white dark:bg-emerald-700',
    rose: 'bg-rose-600 text-white dark:bg-rose-700',
  }
  const iconBox = tone === 'amber' ? 'bg-teal-950/10' : 'bg-white/15'
  const divider = tone === 'amber' ? 'border-teal-950/15' : 'border-white/20'
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`ap-rise group relative overflow-hidden rounded-2xl p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-5 ${tones[tone]}`}
    >
      {/* Soft circle in the corner for depth */}
      <span className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" aria-hidden="true" />
      <div className="relative flex items-center gap-3 sm:gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${iconBox}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1 text-right">
          <p className="text-xs font-medium opacity-90 sm:text-sm">{label}</p>
          <p className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">{value}</p>
        </div>
      </div>
      <div className={`relative mt-4 flex items-center justify-between gap-2 border-t pt-3 text-xs ${divider}`}>
        <span className="truncate opacity-90">{detail}</span>
        <ArrowRight className="h-4 w-4 shrink-0 opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
      </div>
    </button>
  )
}

// -----------------------------------------------------------------------------
// Staff card with progress rings
// -----------------------------------------------------------------------------

function Ring({ value, label, tone }: { value: number; label: string; tone: string }) {
  const radius = 26
  const circumference = 2 * Math.PI * radius
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative h-[68px] w-[68px]">
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="6" className="stroke-stone-100 dark:stroke-stone-800" />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - value / 100)}
            className={tone}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums text-stone-900 dark:text-white">
          {value}%
        </span>
      </div>
      <span className="text-xs leading-tight text-stone-500 dark:text-stone-400">{label}</span>
    </div>
  )
}

function StaffCard({ staff, applications, today }: { staff: StaffUser; applications: Application[]; today: string }) {
  const reviewed = applications.flatMap((app) => {
    const firstMove = app.history.find((entry) => entry.actorKind === 'staff')
    return firstMove ? [{ app, firstMove }] : []
  })
  const onTime = reviewed.filter(({ app, firstMove }) => firstMove.at.slice(0, 10) <= app.firstReviewDueDate).length
  const reachedInterview = applications.filter((app) => app.history.some((entry) => entry.stage === 'interview')).length
  const reachedOffer = applications.filter((app) => app.history.some((entry) => entry.stage === 'offer'))
  const accepted = reachedOffer.filter((app) => app.stage === 'hired').length
  const movedToday = applications.filter((app) =>
    app.history.some((entry) => entry.actorKind === 'staff' && entry.at.slice(0, 10) === today),
  ).length

  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full p-1 ring-2 ring-teal-600 dark:ring-teal-400">
          <Avatar id={staff.id} name={staff.name} size="xl" />
        </div>
        <p className="mt-4 text-lg font-semibold text-stone-900 dark:text-white">{staff.name}</p>
        <p className="text-sm text-stone-500 dark:text-stone-400">EduBridge recruitment team</p>
        <p className="mt-3 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 dark:bg-teal-400/10 dark:text-teal-200">
          {movedToday > 0 ? `${pluralise(movedToday, 'candidate')} moved today` : 'No candidates moved yet today'}
        </p>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 border-t border-stone-100 pt-5 dark:border-stone-800">
        <Ring value={percent(onTime, reviewed.length)} label="Reviews on time" tone="stroke-teal-600" />
        <Ring value={percent(reachedInterview, applications.length)} label="Reached interview" tone="stroke-amber-500" />
        <Ring value={percent(accepted, reachedOffer.length)} label="Offers accepted" tone="stroke-emerald-600" />
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Recent activity
// -----------------------------------------------------------------------------

function RecentActivity({ applications, jobsById, today }: { applications: Application[]; jobsById: Map<string, AdminJob>; today: string }) {
  const entries = applications
    .flatMap((app) => app.history.map((entry) => ({ entry, app })))
    .sort((a, b) => b.entry.at.localeCompare(a.entry.at))
    .slice(0, 5)

  const describe = ({ entry, app }: (typeof entries)[number]) => {
    const firstName = app.candidate.name.split(' ')[0]
    const job = jobsById.get(app.jobId)?.title ?? 'a role'
    if (entry.stage === 'applied')
      return { icon: FilePlus2, tone: 'bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300', text: `${app.candidate.name} applied for ${job}` }
    if (entry.stage === 'withdrawn')
      return { icon: Undo2, tone: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300', text: `${app.candidate.name} withdrew from ${job}` }
    if (entry.stage === 'not-selected' || entry.stage === 'role-cancelled')
      return {
        icon: XCircle,
        tone: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300',
        text: `${firstName} marked ${STAGE_LABELS[entry.stage]} for ${job}`,
      }
    return {
      icon: MoveRight,
      tone: 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
      text: `${entry.actorKind === 'staff' ? entry.actorName.split(' ')[0] : 'Recruiture'} moved ${firstName} to ${STAGE_LABELS[entry.stage]}`,
    }
  }

  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <h2 className="text-base font-semibold text-stone-900 dark:text-white">Recent activity</h2>
      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">Nothing has happened yet.</p>
      ) : (
        <ol className="mt-4 space-y-4">
          {entries.map((item) => {
            const { icon: Icon, tone, text } = describe(item)
            return (
              <li key={item.entry.id} className="flex gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm leading-snug text-stone-700 dark:text-stone-200">{text}</p>
                  <p className="mt-0.5 text-xs text-stone-400 dark:text-stone-500">{relativeDay(item.entry.at, today)}</p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

// -----------------------------------------------------------------------------
// Needs attention
// -----------------------------------------------------------------------------

type AttentionTab = 'reviews' | 'followups' | 'enquiries'

const ROW = 'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-stone-50 sm:gap-4 dark:hover:bg-stone-800/60'
const ROW_ACTION =
  'hidden shrink-0 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 transition group-hover:bg-teal-800 group-hover:text-white sm:inline-block dark:bg-teal-400/10 dark:text-teal-200 dark:group-hover:bg-teal-600'

function NeedsAttention({
  today,
  firstReviews,
  interviewUpdates,
  newEnquiries,
  jobsById,
  onOpenApplication,
  onOpenEnquiry,
  onNavigate,
}: {
  today: string
  firstReviews: Application[]
  interviewUpdates: Application[]
  newEnquiries: Enquiry[]
  jobsById: Map<string, AdminJob>
  onOpenApplication: (id: string) => void
  onOpenEnquiry: (id: string) => void
  onNavigate: (view: AdminView) => void
}) {
  const [tab, setTab] = useState<AttentionTab>('reviews')
  const tabs: { value: AttentionTab; label: string; count: number }[] = [
    { value: 'reviews', label: 'First reviews', count: firstReviews.length },
    { value: 'followups', label: 'Interview follow-ups', count: interviewUpdates.length },
    { value: 'enquiries', label: 'New enquiries', count: newEnquiries.length },
  ]

  const empty = {
    reviews: 'No applications waiting for a first review.',
    followups: 'Every completed interview has a next step on time.',
    enquiries: 'No new enquiries. You are all caught up.',
  }[tab]
  const isEmpty = (tab === 'reviews' ? firstReviews : tab === 'followups' ? interviewUpdates : newEnquiries).length === 0

  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-stone-900 dark:text-white">Needs attention</h2>
        <button
          type="button"
          onClick={() => onNavigate(tab === 'enquiries' ? 'enquiries' : 'applications')}
          className="text-sm font-semibold text-teal-700 hover:text-teal-900 dark:text-teal-300 dark:hover:text-teal-200"
        >
          View all
        </button>
      </div>

      <div role="tablist" aria-label="Needs attention" className="mt-4 flex gap-1 overflow-x-auto rounded-xl bg-stone-100 p-1 dark:bg-stone-800">
        {tabs.map((option) => {
          const isActive = option.value === tab
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(option.value)}
              className={`flex shrink-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-white text-teal-900 shadow-sm dark:bg-stone-900 dark:text-white'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
              }`}
            >
              {option.label}
              <span
                className={`rounded-full px-2 text-xs font-semibold tabular-nums ${
                  isActive && option.count > 0 ? 'bg-amber-400 text-teal-950' : 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-300'
                }`}
              >
                {option.count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="-mx-3 mt-3">
        {isEmpty ? (
          <div className="flex items-center gap-3 px-3 py-8 text-sm text-stone-500 dark:text-stone-400">
            <CircleCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            {empty}
          </div>
        ) : (
          <ul>
            {tab === 'reviews' &&
              firstReviews.slice(0, 5).map((app) => (
                <li key={app.id}>
                  <button type="button" onClick={() => onOpenApplication(app.id)} className={`group ${ROW}`}>
                    <Avatar id={app.candidate.id} name={app.candidate.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="truncate text-sm font-semibold text-stone-900 dark:text-white">{app.candidate.name}</span>
                        {app.candidate.isVerifiedGraduate && <GraduateMarker program={app.candidate.graduateProgram} />}
                      </div>
                      <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                        {jobsById.get(app.jobId)?.title} · applied {lowerFirstWord(relativeDay(app.submittedAt, today))}
                      </p>
                      <div className="mt-1 sm:hidden">
                        <DueTag date={app.firstReviewDueDate} today={today} />
                      </div>
                    </div>
                    <span className="hidden sm:block">
                      <DueTag date={app.firstReviewDueDate} today={today} />
                    </span>
                    <span className={ROW_ACTION}>Review</span>
                  </button>
                </li>
              ))}

            {tab === 'followups' &&
              interviewUpdates.slice(0, 5).map((app) => (
                <li key={app.id}>
                  <button type="button" onClick={() => onOpenApplication(app.id)} className={`group ${ROW}`}>
                    <Avatar id={app.candidate.id} name={app.candidate.name} />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-stone-900 dark:text-white">{app.candidate.name}</span>
                      <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                        {jobsById.get(app.jobId)?.title} · interviewed {app.interviewCompletedAt ? formatDate(app.interviewCompletedAt) : ''}
                      </p>
                      <div className="mt-1">
                        {app.nextUpdateDueDate ? (
                          <DueTag date={app.nextUpdateDueDate} today={today} prefix="Next update" />
                        ) : (
                          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">No next update date set</span>
                        )}
                      </div>
                    </div>
                    <span className={ROW_ACTION}>Update</span>
                  </button>
                </li>
              ))}

            {tab === 'enquiries' &&
              newEnquiries.slice(0, 5).map((enquiry) => (
                <li key={enquiry.id}>
                  <button type="button" onClick={() => onOpenEnquiry(enquiry.id)} className={`group ${ROW}`}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200">
                      <Inbox className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-stone-900 dark:text-white">{enquiry.subject}</span>
                      <p className="flex items-center gap-2 truncate text-xs text-stone-500 dark:text-stone-400">
                        <SourceTag source={enquiry.source} />
                        <span className="truncate">
                          {enquiry.employerDetails?.companyName ?? enquiry.name} · {relativeDay(enquiry.receivedAt, today)}
                        </span>
                      </p>
                    </div>
                    <span className={ROW_ACTION}>Open</span>
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// Live jobs
// -----------------------------------------------------------------------------

function JobCard({
  job,
  company,
  applicantCount,
  today,
  onOpen,
}: {
  job: AdminJob
  company: Company | undefined
  applicantCount: number
  today: string
  onOpen: () => void
}) {
  const days = daysUntil(job.deadline, today)
  const closingSoon = isClosingSoon(job, today)
  return (
    <article className={`${CARD} flex flex-col p-5`}>
      <div className="flex items-start justify-between gap-3">
        <p className="truncate text-xs text-stone-500 dark:text-stone-400">{company?.name}</p>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            closingSoon
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200'
              : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
          }`}
        >
          {days <= 0 ? 'Closes today' : `${pluralise(days, 'day')} left`}
        </span>
      </div>
      <div className="mt-3 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-snug text-stone-900 dark:text-white">{job.title}</h3>
          <p className="mt-1 text-sm font-medium text-teal-700 dark:text-teal-300">{formatSalary(job.salary)}</p>
        </div>
        <CompanyLogo company={company} size="md" />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">
          {formatLocation(job)} · closes {formatDate(job.deadline)}
        </span>
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="whitespace-nowrap rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
          {pluralise(applicantCount, 'applicant')}
        </span>
        <button
          type="button"
          onClick={onOpen}
          className="whitespace-nowrap rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 transition hover:bg-teal-800 hover:text-white dark:bg-teal-400/10 dark:text-teal-200 dark:hover:bg-teal-600"
        >
          View applicants
        </button>
      </div>
    </article>
  )
}

// -----------------------------------------------------------------------------
// Overview
// -----------------------------------------------------------------------------

export function Overview({
  currentStaff,
  today,
  weeklyActivity,
  jobs,
  applications,
  enquiries,
  companiesById,
  onNavigate,
  onOpenApplication,
  onOpenEnquiry,
  onOpenJobApplicants,
}: OverviewProps) {
  const jobsById = new Map(jobs.map((job) => [job.id, job]))

  const firstReviews = applications
    .filter(awaitsFirstReview)
    .sort((a, b) => a.firstReviewDueDate.localeCompare(b.firstReviewDueDate))
  const overdueReviews = firstReviews.filter((app) => isFirstReviewOverdue(app, today))
  const interviewUpdates = applications
    .filter((app) => needsInterviewUpdate(app, today))
    .sort((a, b) => (a.nextUpdateDueDate ?? '').localeCompare(b.nextUpdateDueDate ?? ''))
  const newEnquiries = enquiries
    .filter((enquiry) => enquiry.status === 'new')
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
  const closingSoon = jobs.filter((job) => isClosingSoon(job, today))
  const liveJobs = jobs.filter((job) => job.status === 'published').sort((a, b) => a.deadline.localeCompare(b.deadline))
  const thisWeek = weeklyActivity[weeklyActivity.length - 1]
  const lastWeek = weeklyActivity[weeklyActivity.length - 2]
  const weekChange = thisWeek && lastWeek ? thisWeek.applications - lastWeek.applications : null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        <StatTile
          delay={0}
          tone="teal"
          icon={Users}
          label="Awaiting first review"
          value={firstReviews.length}
          detail={overdueReviews.length > 0 ? `${overdueReviews.length} past the 7-day target` : 'All within 7 days'}
          onClick={() => onNavigate('applications')}
        />
        <StatTile
          delay={50}
          tone="amber"
          icon={CalendarClock}
          label="Interview follow-ups"
          value={interviewUpdates.length}
          detail="Next update due or overdue"
          onClick={() => onNavigate('applications')}
        />
        <StatTile
          delay={100}
          tone="emerald"
          icon={Inbox}
          label="New enquiries"
          value={newEnquiries.length}
          detail="Contact and For Employers"
          onClick={() => onNavigate('enquiries')}
        />
        <StatTile
          delay={150}
          tone="rose"
          icon={BriefcaseBusiness}
          label="Closing this week"
          value={closingSoon.length}
          detail={`${pluralise(liveJobs.length, 'job')} live on the board`}
          onClick={() => onNavigate('jobs')}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="min-w-0 space-y-6 xl:col-span-4">
          <StaffCard staff={currentStaff} applications={applications} today={today} />
          <RecentActivity applications={applications} jobsById={jobsById} today={today} />
        </div>

        <div className="min-w-0 space-y-6 xl:col-span-8">
          <section className={`${CARD} p-5 sm:p-6`}>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-stone-900 dark:text-white">Applications and interviews</h2>
                <p className="text-sm text-stone-500 dark:text-stone-400">Last {weeklyActivity.length} weeks, by week</p>
              </div>
              {weekChange !== null && (
                <span
                  className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${
                    weekChange >= 0
                      ? 'bg-teal-50 text-teal-800 dark:bg-teal-400/10 dark:text-teal-200'
                      : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                  }`}
                >
                  {weekChange >= 0 ? `Up ${weekChange}` : `Down ${Math.abs(weekChange)}`} applications on last week
                </span>
              )}
            </div>
            <ActivityChart weeks={weeklyActivity} />
          </section>

          <NeedsAttention
            today={today}
            firstReviews={firstReviews}
            interviewUpdates={interviewUpdates}
            newEnquiries={newEnquiries}
            jobsById={jobsById}
            onOpenApplication={onOpenApplication}
            onOpenEnquiry={onOpenEnquiry}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white">Live jobs</h2>
          <button
            type="button"
            onClick={() => onNavigate('jobs')}
            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-900 dark:text-teal-300 dark:hover:text-teal-200"
          >
            All jobs
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {liveJobs.length === 0 ? (
          <div className={CARD}>
            <EmptyState
              icon={BriefcaseBusiness}
              title="No live jobs"
              body="Publish a job for a client company and it will show here and on the public job board."
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {liveJobs.slice(0, 3).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                company={companiesById.get(job.companyId)}
                applicantCount={applications.filter((app) => app.jobId === job.id).length}
                today={today}
                onOpen={() => onOpenJobApplicants(job.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
