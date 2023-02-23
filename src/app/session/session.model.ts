import { Speaker } from "../speakers/speaker.model"
import { Company } from "../company/company.model"

export class Session {
  id: string
  name: string
  kind: string
  img: string
  place: string
  description: string
  speakers: Array<Speaker>
  companies: Array<Company>
  date: string
  duration: string
  updated: string
  event: string
  tickets: {
    needed: boolean,
    start: string,
    end: string,
    max: number
  }
  surveyNeeded: boolean
}
