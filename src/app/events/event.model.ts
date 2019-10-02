
export class Event {
  id: string
  name: string
  themes: string[]
  begin: string
  end: string

  // calculated fields
  beginDate: Date
  endDate: Date
  isOccurring: Boolean

  constructor (event: Event) {
    this.id = event.id
    this.name = event.name
    this.themes = event.themes
    this.begin = event.begin
    this.end = event.end

    const curr = new Date()
    this.beginDate = new Date(this.begin)
    this.endDate = new Date(this.end)
    this.isOccurring = curr >= new Date(this.begin) && curr <= new Date(this.end)
  }
}
