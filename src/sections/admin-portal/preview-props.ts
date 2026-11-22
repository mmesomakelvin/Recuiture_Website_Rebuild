// Shared sample data and logging callbacks for the Admin Portal previews.
// Used only by the Design OS preview wrappers in this folder; not exported.
import data from '@/../product/sections/admin-portal/data.json'
import type { AdminPortalProps } from '@/../product/sections/admin-portal/types'

export const previewProps: AdminPortalProps = {
  currentStaff: data.currentStaff,
  today: data.today,
  companies: data.companies as unknown as AdminPortalProps['companies'],
  jobs: data.jobs as unknown as AdminPortalProps['jobs'],
  applications: data.applications as unknown as AdminPortalProps['applications'],
  enquiries: data.enquiries as unknown as AdminPortalProps['enquiries'],
  weeklyActivity: data.weeklyActivity,
  stageEmailTemplates: data.stageEmailTemplates as unknown as AdminPortalProps['stageEmailTemplates'],
  formOptions: data.formOptions as unknown as AdminPortalProps['formOptions'],
  onNavigate: (view) => console.log('Navigate:', view),
  onSignOut: () => console.log('Sign out'),
  onCreateJob: (input, publish) => console.log('Create job:', { input, publish }),
  onUpdateJob: (jobId, input) => console.log('Update job:', jobId, input),
  onPublishJob: (jobId) => console.log('Publish job:', jobId),
  onPauseJob: (jobId) => console.log('Pause job:', jobId),
  onResumeJob: (jobId) => console.log('Resume job:', jobId),
  onCloseJob: (jobId, reason) => console.log('Close job:', jobId, reason),
  onCreateCompany: (input) => console.log('Create company:', input),
  onOpenCv: (applicationId) => console.log('Open CV:', applicationId),
  onMoveApplication: (applicationId, stage, note) => console.log('Move application:', { applicationId, stage, note }),
  onCompleteInterview: (applicationId, date) => console.log('Complete interview:', applicationId, date),
  onUpdateEnquiryStatus: (enquiryId, status) => console.log('Enquiry status:', enquiryId, status),
  onAddEnquiryNote: (enquiryId, body) => console.log('Enquiry note:', enquiryId, body),
  onReplyToEnquiry: (enquiryId) => console.log('Reply to enquiry:', enquiryId),
}
