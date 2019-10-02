import { Company } from '../company/company.model'
import { Speaker } from '../speakers/speaker.model'

export class Session {
  id: string
  begin: string
  company: Company
  description: string
  end: string
  kind: string
  place: string
  speakers: Speaker[]

  tickets: {
    start: string,
    end: string,
    max: number
  }
  title: string
  videoURL: string

  // calculated fields
  beginDate: Date
  endDate: Date
  isOccurring: Boolean

  constructor (session: Session) {
    this.begin = session.begin
    this.company = session.company
    this.description = session.description
    this.end = session.end
    this.kind = session.kind
    this.place = session.place
    this.speakers = session.speakers
    this.tickets = session.tickets
    this.title = session.title
    this.videoURL = session.videoURL

    const curr = new Date()
    this.beginDate = new Date(this.begin)
    this.endDate = new Date(this.end)
    this.isOccurring = curr >= new Date(this.begin) && curr <= new Date(this.end)
  }
}
