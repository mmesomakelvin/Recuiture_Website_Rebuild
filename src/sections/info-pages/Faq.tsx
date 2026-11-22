import { InfoPages } from './components/InfoPages'
import { infoProps } from './preview-props'

export default function FaqPreview() {
  return <InfoPages {...infoProps} page="faq" />
}
