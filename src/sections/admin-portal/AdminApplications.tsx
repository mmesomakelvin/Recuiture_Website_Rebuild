import { AdminPortal } from './components/AdminPortal'
import { previewProps } from './preview-props'

export default function AdminApplicationsPreview() {
  return <AdminPortal {...previewProps} activeView="applications" />
}
