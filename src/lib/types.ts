export type Conversation = {
  accept_reply: boolean
  answered_at: Date
  assigned_at: Date
  assigned_to: User
  // business: {uid: 62124827269192}
  // channel: {uid: 61839488196680, name: 'In App', channel_type: 'inapp', account_type: null, address: null}
  closed_at: Date
  closed_by: User
  created_at: Date
  custom_data: null
  groups: Array<string>
  initiated_by: Sender
  last_active: Date
  last_message: Message
  message_count: number
  new_count: number
  open_until: Date
  operator: null
  parties: Array<any>
  pending_until: Date
  queue: Queue
  queued_at: Date
  spam_tag: null
  spam_tag_name: null
  subject: null
  uid: number
  unread_count: number
}

export type Queue = {
  uid: number
  name: string
  email: string
  //  business: {…}
}

export type Party = {}

export type Message = {
  //   app: { uid: 61103364768840; name: 'CashPop Shop Dev'; app_type: 'customer' }
  attachments: Array<any>
  attachments_count: number
  body: string
  conversation: Conversation
  created_at: Date
  delivered_at: Date
  dispatched_at: Date
  failed_at: Date
  html_body: string
  id: number
  is_internal: boolean
  read_at: Date
  sender: Sender
  sent_at: Date
}

export type Sender = {
  //   address: null
  agent: Agent
  contact: Contact
  id: number
  removed_at: Date
  typing_at: Date
}

export type Agent = {
  // directory: { uid: 61839430433352; name: 'CashPop' }
  email: string
  first_name: string
  is_service_user: boolean
  last_name: string
  mobile_no: string
  uid: number
}

export type Contact = {
  // business: { uid: 62124827269192 }
  external_app: string
  external_id: string
  first_name: string
  is_registered: true
  last_name: string
  uid: number
  user: User
}

export type User = {
  business_name: string
  business_uid: number
  companies: Array<any>
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
  mobile_no: string
  permission: any
  uid: number
  username: string
}
