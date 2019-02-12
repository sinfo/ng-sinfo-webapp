export class Event {
  id: string
  name: string
  kind: string
  date: Date
  updated: Date
  duration: Date
  begin: Date
  end: Date
  isOcurring: Boolean

  constructor (event: Event) {
    this.id = event.id
    this.name = event.name
    this.kind = event.kind
    this.date = new Date(event.date)
    this.updated = new Date(event.updated)
    this.duration = new Date(event.duration)

    const curr = new Date()
    this.begin = this.date
    this.end = new Date(this.date.getTime() + this.duration.getTime())
    this.isOcurring = curr >= this.begin && curr <= this.end
  }
}
