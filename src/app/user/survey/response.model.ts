export class SurveyResponse {
  age: string
  gender: string
  area: string
  areaOther: string
  isIST: boolean
  satisfaction: string
  suggestions: string
  logistics: {
    location: number
    installations: number
    organization: number
    communication: number
  }
  session: {
    organization: number
    content: number
    speaker: number
    duration: number
    recommend: number
  }
}
