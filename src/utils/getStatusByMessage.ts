import { Message } from '../lib/types'

const getStatusByMessage = (message: Message) => {
  if (message.read_at) return 'read'
  else if (message.delivered_at) return 'delivered'
  else if (message.dispatched_at) return 'sent'
  else return 'pending'
}

export default getStatusByMessage
