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

  constructor () {
    this.begin = new Date(this.date)
    this.end = new Date(new Date(this.date).getTime() + new Date(this.duration).getTime())
    this.isOcurring = new Date() >= this.begin && new Date() <= this.end
  }
}
