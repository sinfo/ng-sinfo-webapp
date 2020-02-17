export class Note {
  contacts: {
    email: String
    phone: String
  }
  interestedIn: String
  degree: String
  availability: String
  otherObservations: String
}

export class Link {
  company: string
  edition: string
  attendee: string
  created: Date
  updated: Date
  user: string
  notes: Note
  cv: boolean
}
