import { AdminPortal } from './components/AdminPortal'
import { previewProps } from './preview-props'

export default function AdminOverviewPreview() {
  return <AdminPortal {...previewProps} activeView="overview" />
}
