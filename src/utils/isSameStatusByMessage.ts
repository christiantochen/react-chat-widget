import { Message } from '../lib/types'
import getStatusByMessage from './getStatusByMessage'

const isSameStatusByMessage = (message1: Message, message2: Message) => {
  return getStatusByMessage(message1) === getStatusByMessage(message2)
}

export default isSameStatusByMessage
