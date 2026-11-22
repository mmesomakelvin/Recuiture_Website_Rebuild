import { useCallback, useMemo, useState } from 'react'
import type {
  AdminJob,
  AdminPortalProps,
  AdminView,
  Application,
  ClosedReason,
  Company,
  CompanyInput,
  Enquiry,
  EnquiryStatus,
  HistoryEntry,
  JobInput,
  StaffSettableStage,
} from '@/../product/sections/admin-portal/types'
import { AdminLayout } from './AdminLayout'
import { ApplicantPanel } from './ApplicantPanel'
import { ApplicationsView } from './ApplicationsView'
import { EnquiriesView } from './EnquiriesView'
import { JobForm } from './JobForm'
import { JobsView } from './JobsView'
import { Overview } from './Overview'
import { StageDialog } from './StageDialog'
import { awaitsFirstReview, isActiveStage, isClosingSoon } from './format'
import { ADMIN_STYLES, FONT_STACK } from './styles'

type JobsMode = { mode: 'list' } | { mode: 'new' } | { mode: 'edit'; jobId: string }

const localId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/**
 * The internal EduBridge staff portal. Holds a local copy of the data so every
 * action updates the screen straight away, and reports each action through the
 * matching callback for the host app to persist.
 */
export function AdminPortal({
  currentStaff,
  today,
  companies: initialCompanies,
  jobs: initialJobs,
  applications: initialApplications,
  enquiries: initialEnquiries,
  weeklyActivity,
  stageEmailTemplates,
  formOptions,
  activeView = 'overview',
  onNavigate,
  onSignOut,
  onCreateJob,
  onUpdateJob,
  onPublishJob,
  onPauseJob,
  onResumeJob,
  onCloseJob,
  onCreateCompany,
  onOpenCv,
  onMoveApplication,
  onCompleteInterview,
  onUpdateEnquiryStatus,
  onAddEnquiryNote,
  onReplyToEnquiry,
}: AdminPortalProps) {
  const [view, setView] = useState<AdminView>(activeView)
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [jobs, setJobs] = useState<AdminJob[]>(initialJobs)
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries)

  const [jobsMode, setJobsMode] = useState<JobsMode>({ mode: 'list' })
  const [jobFilter, setJobFilter] = useState('all')
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null)
  const [pendingMove, setPendingMove] = useState<{ applicationId: string; stage: StaffSettableStage } | null>(null)

  // Follow the activeView prop when the host changes it
  const [lastActiveView, setLastActiveView] = useState<AdminView>(activeView)
  if (activeView !== lastActiveView) {
    setLastActiveView(activeView)
    setView(activeView)
  }

  const companiesById = useMemo(() => new Map(companies.map((company) => [company.id, company])), [companies])
  const jobsById = useMemo(() => new Map(jobs.map((job) => [job.id, job])), [jobs])

  const counts: Record<AdminView, number> = {
    overview: 0,
    jobs: jobs.filter((job) => isClosingSoon(job, today)).length,
    applications: applications.filter(awaitsFirstReview).length,
    enquiries: enquiries.filter((enquiry) => enquiry.status === 'new').length,
  }

  const navigate = useCallback(
    (next: AdminView) => {
      setView(next)
      setJobsMode({ mode: 'list' })
      setSelectedAppId(null)
      if (next !== 'applications') setJobFilter('all')
      if (next !== 'enquiries') setSelectedEnquiryId(null)
      onNavigate?.(next)
      if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
    },
    [onNavigate],
  )

  const nowIso = () => new Date().toISOString()

  // ---------------------------------------------------------------------------
  // Jobs
  // ---------------------------------------------------------------------------

  const patchJob = (jobId: string, patch: Partial<AdminJob>) =>
    setJobs((list) => list.map((job) => (job.id === jobId ? { ...job, ...patch, updatedAt: nowIso() } : job)))

  const submitJob = (input: JobInput, publish: boolean) => {
    if (jobsMode.mode === 'edit') {
      const existing = jobsById.get(jobsMode.jobId)
      patchJob(jobsMode.jobId, {
        ...input,
        ...(publish && existing?.status === 'draft' ? { status: 'published' as const, postedAt: nowIso() } : {}),
      })
      onUpdateJob?.(jobsMode.jobId, input)
      if (publish && existing?.status === 'draft') onPublishJob?.(jobsMode.jobId)
    } else {
      const created: AdminJob = {
        ...input,
        id: localId('job'),
        slug: slugify(`${input.title} ${companiesById.get(input.companyId)?.name ?? ''}`),
        status: publish ? 'published' : 'draft',
        closedReason: null,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        postedAt: publish ? nowIso() : null,
        isManagedByEduBridge: true,
      }
      setJobs((list) => [created, ...list])
      onCreateJob?.(input, publish)
    }
    setJobsMode({ mode: 'list' })
  }

  const addCompany = (input: CompanyInput): Company => {
    const company: Company = {
      id: localId('co'),
      name: input.name.trim(),
      logoUrl: null,
      industry: input.industry,
      size: input.size,
      location: input.location.trim(),
      about: input.about.trim(),
    }
    setCompanies((list) => [...list, company])
    onCreateCompany?.(input)
    return company
  }

  const closeJob = (jobId: string, reason: ClosedReason) => {
    const outcome = reason === 'filled' ? 'not-selected' : 'role-cancelled'
    patchJob(jobId, { status: 'closed', closedReason: reason })
    setApplications((list) =>
      list.map((app) => {
        if (app.jobId !== jobId || !isActiveStage(app.stage)) return app
        const entry: HistoryEntry = {
          id: localId('h'),
          stage: outcome,
          at: nowIso(),
          actorKind: 'system',
          actorName: 'Recruiture',
          note: reason === 'filled' ? 'This role has now been filled.' : 'The employer is no longer hiring for this role.',
          emailStatus: 'queued',
        }
        return { ...app, stage: outcome, history: [...app.history, entry] }
      }),
    )
    onCloseJob?.(jobId, reason)
  }

  const viewApplicants = (jobId: string) => {
    setView('applications')
    setJobFilter(jobId)
    setSelectedAppId(null)
    setJobsMode({ mode: 'list' })
    onNavigate?.('applications')
  }

  // ---------------------------------------------------------------------------
  // Applications
  // ---------------------------------------------------------------------------

  const openApplication = (applicationId: string) => {
    setView('applications')
    setSelectedAppId(applicationId)
  }

  const confirmMove = (note: string | null) => {
    if (!pendingMove) return
    const { applicationId, stage } = pendingMove
    setApplications((list) =>
      list.map((app) => {
        if (app.id !== applicationId) return app
        const entry: HistoryEntry = {
          id: localId('h'),
          stage,
          at: nowIso(),
          actorKind: 'staff',
          actorName: currentStaff.name,
          note,
          emailStatus: 'queued',
        }
        return {
          ...app,
          stage,
          // A new interview starts a fresh follow-up cycle
          ...(stage === 'interview' ? { interviewCompletedAt: null, nextUpdateDueDate: null } : {}),
          history: [...app.history, entry],
        }
      }),
    )
    onMoveApplication?.(applicationId, stage, note)
    setPendingMove(null)
  }

  const completeInterview = (applicationId: string, date: string) => {
    setApplications((list) =>
      list.map((app) =>
        app.id === applicationId
          ? { ...app, interviewCompletedAt: app.interviewCompletedAt ?? nowIso(), nextUpdateDueDate: date }
          : app,
      ),
    )
    onCompleteInterview?.(applicationId, date)
  }

  // ---------------------------------------------------------------------------
  // Enquiries
  // ---------------------------------------------------------------------------

  const openEnquiry = (enquiryId: string) => {
    setView('enquiries')
    setSelectedEnquiryId(enquiryId)
  }

  const updateEnquiryStatus = (enquiryId: string, status: EnquiryStatus) => {
    setEnquiries((list) => list.map((enquiry) => (enquiry.id === enquiryId ? { ...enquiry, status } : enquiry)))
    onUpdateEnquiryStatus?.(enquiryId, status)
  }

  const addEnquiryNote = (enquiryId: string, body: string) => {
    setEnquiries((list) =>
      list.map((enquiry) =>
        enquiry.id === enquiryId
          ? { ...enquiry, notes: [...enquiry.notes, { id: localId('n'), authorName: currentStaff.name, body, at: nowIso() }] }
          : enquiry,
      ),
    )
    onAddEnquiryNote?.(enquiryId, body)
  }

  const replyToEnquiry = (enquiryId: string) => {
    const enquiry = enquiries.find((item) => item.id === enquiryId)
    // Opening a reply moves a new enquiry into progress
    if (enquiry?.status === 'new') updateEnquiryStatus(enquiryId, 'in-progress')
    onReplyToEnquiry?.(enquiryId)
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const selectedApp = applications.find((app) => app.id === selectedAppId)
  const selectedAppJob = selectedApp ? jobsById.get(selectedApp.jobId) : undefined
  const pendingApp = pendingMove ? applications.find((app) => app.id === pendingMove.applicationId) : undefined
  const pendingJob = pendingApp ? jobsById.get(pendingApp.jobId) : undefined
  const editingJob = jobsMode.mode === 'edit' ? jobsById.get(jobsMode.jobId) : undefined

  return (
    <div style={FONT_STACK}>
      <style>{ADMIN_STYLES}</style>
      <AdminLayout
        currentStaff={currentStaff}
        today={today}
        activeView={view}
        counts={counts}
        onNavigate={navigate}
        onSignOut={onSignOut}
      >
        {view === 'overview' && (
          <Overview
            currentStaff={currentStaff}
            today={today}
            weeklyActivity={weeklyActivity}
            jobs={jobs}
            applications={applications}
            enquiries={enquiries}
            companiesById={companiesById}
            onNavigate={navigate}
            onOpenApplication={openApplication}
            onOpenEnquiry={openEnquiry}
            onOpenJobApplicants={viewApplicants}
          />
        )}

        {view === 'jobs' && jobsMode.mode === 'list' && (
          <JobsView
            jobs={jobs}
            applications={applications}
            companiesById={companiesById}
            today={today}
            onNewJob={() => setJobsMode({ mode: 'new' })}
            onEditJob={(jobId) => setJobsMode({ mode: 'edit', jobId })}
            onViewApplicants={viewApplicants}
            onPublishJob={(jobId) => {
              patchJob(jobId, { status: 'published', postedAt: nowIso() })
              onPublishJob?.(jobId)
            }}
            onPauseJob={(jobId) => {
              patchJob(jobId, { status: 'paused' })
              onPauseJob?.(jobId)
            }}
            onResumeJob={(jobId) => {
              patchJob(jobId, { status: 'published' })
              onResumeJob?.(jobId)
            }}
            onCloseJob={closeJob}
          />
        )}

        {view === 'jobs' && jobsMode.mode !== 'list' && (
          <JobForm
            key={jobsMode.mode === 'edit' ? jobsMode.jobId : 'new'}
            job={editingJob}
            companies={companies}
            formOptions={formOptions}
            onCancel={() => setJobsMode({ mode: 'list' })}
            onSubmit={submitJob}
            onAddCompany={addCompany}
          />
        )}

        {view === 'applications' && (
          <ApplicationsView
            applications={applications}
            jobs={jobs}
            companiesById={companiesById}
            today={today}
            jobFilter={jobFilter}
            onJobFilterChange={(jobId) => {
              setJobFilter(jobId)
              setSelectedAppId(null)
            }}
            selectedId={selectedAppId}
            onSelect={setSelectedAppId}
          />
        )}

        {view === 'enquiries' && (
          <EnquiriesView
            enquiries={enquiries}
            today={today}
            selectedId={selectedEnquiryId}
            onSelect={setSelectedEnquiryId}
            onUpdateStatus={updateEnquiryStatus}
            onAddNote={addEnquiryNote}
            onReply={replyToEnquiry}
          />
        )}
      </AdminLayout>

      {view === 'applications' && selectedApp && (
        <ApplicantPanel
          application={selectedApp}
          job={selectedAppJob}
          company={selectedAppJob ? companiesById.get(selectedAppJob.companyId) : undefined}
          today={today}
          onClose={() => setSelectedAppId(null)}
          onOpenCv={() => onOpenCv?.(selectedApp.id)}
          onRequestMove={(stage) => setPendingMove({ applicationId: selectedApp.id, stage })}
          onCompleteInterview={(date) => completeInterview(selectedApp.id, date)}
        />
      )}

      {pendingMove && pendingApp && (
        <StageDialog
          application={pendingApp}
          job={pendingJob}
          company={pendingJob ? companiesById.get(pendingJob.companyId) : undefined}
          stage={pendingMove.stage}
          template={stageEmailTemplates.find((template) => template.stage === pendingMove.stage)}
          onCancel={() => setPendingMove(null)}
          onConfirm={confirmMove}
        />
      )}
    </div>
  )
}
