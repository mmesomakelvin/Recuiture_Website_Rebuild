import { CreateAccountScreen } from './components/AccountScreens'
import { accountProps, continueTo } from './preview-props'

export default function CreateAccountPreview() {
  return <CreateAccountScreen {...accountProps} continueTo={continueTo} />
}
