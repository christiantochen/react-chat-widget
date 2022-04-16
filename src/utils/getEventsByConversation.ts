import moment from 'moment'
import { Conversation } from '../lib/types'

const getEventsByConversation = (conversation: Conversation) => {
  const events = [] as Array<{
    id: number
    type: 'event' | 'date'
    event_date: moment.Moment
    text: string
  }>

  if (conversation.created_at) {
    const created_at = moment(conversation.created_at)
    events.push({
      id: events.length + 1,
      type: 'date',
      event_date: created_at,
      text: moment().isSame(created_at, 'day')
        ? 'Today'
        : created_at.format('ddd, D MMM YYYY'),
    })
    events.push({
      id: events.length + 1,
      type: 'event',
      event_date: created_at,
      text: `Started ${`By 
      ${conversation.initiated_by.contact.first_name || 'You'} 
      ${conversation.initiated_by.contact.last_name || ''}
      `} at ${moment(conversation.created_at).format('LLLL')}`,
    })
  }
  if (conversation.queued_at) {
    const queued_at = moment(conversation.queued_at)
    events.push({
      id: events.length + 1,
      type: 'event',
      event_date: queued_at,
      text: `Transfered to ${conversation.queue.name} at ${queued_at.format(
        'LLLL'
      )}`,
    })
  }
  if (conversation.assigned_at) {
    const assigned_at = moment(conversation.assigned_at)
    const assigned_to = `${conversation.assigned_to.first_name} ${
      conversation.assigned_to.last_name || ''
    }`
    events.push({
      id: events.length + 1,
      type: 'event',
      event_date: assigned_at,
      text: `Assigned to ${assigned_to} at ${assigned_at.format('LLLL')}`,
    })
  }
  if (conversation.closed_at) {
    const closed_at = moment(conversation.closed_at)
    const closed_by = conversation.closed_by
      ? `${conversation.closed_by.first_name} ${
          conversation.closed_by.last_name || ''
        }`
      : 'System'
    events.push({
      id: events.length + 1,
      type: 'event',
      event_date: closed_at,
      text: `Ended by ${closed_by} at ${closed_at.format('LLLL')}}`,
    })
  }
  if (conversation.last_message) {
    const created_at = moment(conversation.last_message.created_at).startOf(
      'day'
    )
    const different_in_day = created_at.diff(
      moment(conversation.created_at).startOf('day'),
      'days'
    )

    Array(different_in_day)
      .fill(different_in_day)
      .forEach((_, index) => {
        const day_at = moment(conversation.created_at)
          .startOf('day')
          .add(index + 1, 'day')

        events.push({
          id: events.length + 1,
          type: 'date',
          event_date: day_at,
          text: moment().isSame(day_at, 'day')
            ? 'Today'
            : day_at.format('ddd, D MMM YYYY'),
        })
      })
  }

  return events
}

export default getEventsByConversation
