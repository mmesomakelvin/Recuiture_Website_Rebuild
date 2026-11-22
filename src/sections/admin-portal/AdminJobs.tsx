import { AdminPortal } from './components/AdminPortal'
import { previewProps } from './preview-props'

export default function AdminJobsPreview() {
  return <AdminPortal {...previewProps} activeView="jobs" />
}
