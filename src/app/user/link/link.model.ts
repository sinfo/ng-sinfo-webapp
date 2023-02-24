import { Company } from '../../company/company.model'
import { User } from '../user.model'

export class Note {
  contacts: {
    email: String
    phone: String
  }
  otherObservations: String

  //company links
  interestedIn: String
  degree: String
  availability: String

  //attendee links
  internships: String
}

export class Link {
  author: string
  company: string
  edition: string
  attendee: string
  created: Date
  updated: Date
  user: string
  notes: Note
  cv: boolean
}

export class ProcessedLink {
  author: string
  attendee: User
  company: Company
  user: User
  notes: Note
  noteEmpty: boolean
  cv: boolean
}