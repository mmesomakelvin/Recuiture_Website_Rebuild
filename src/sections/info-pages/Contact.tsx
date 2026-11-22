import { InfoPages } from './components/InfoPages'
import { infoProps } from './preview-props'

export default function ContactPreview() {
  return <InfoPages {...infoProps} page="contact" />
}
