export class Speaker {
  id: string
  name: string
  title: string
  img: {
    speaker: string
    company: string
  }
  participation: {
    event: number
    feedback: string
  }

  // TODO this is required
  // description: string
}
