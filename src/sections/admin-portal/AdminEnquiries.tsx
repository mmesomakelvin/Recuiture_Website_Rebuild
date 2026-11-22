import { AdminPortal } from './components/AdminPortal'
import { previewProps } from './preview-props'

export default function AdminEnquiriesPreview() {
  return <AdminPortal {...previewProps} activeView="enquiries" />
}
