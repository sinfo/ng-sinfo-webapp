export class Event {
  id: string
  name: string
  kind: string
  date: string
  updated: string
  duration: string
  begin: Date
  end: Date
  isOcurring: Boolean

  constructor (event: Event) {
    this.id = event.id
    this.name = event.name
    this.kind = event.kind
    this.date = event.date
    this.updated = event.updated
    this.duration = event.duration

    this.begin = new Date(this.date)
    this.end = new Date(new Date(this.date).getTime() + new Date(this.duration).getTime())
    this.isOcurring = new Date() >= this.begin && new Date() <= this.end
  }
}
