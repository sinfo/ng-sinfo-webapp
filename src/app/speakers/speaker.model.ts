export class Speaker {
  id: string
  name: string
  description: string
  title: string
  img: string
  updated: string
}

export class SpeakerData {
  speakers: Speaker[]
  previousEdition: boolean
  eventId: string
}
