export class User {
  id: string
  name: string
  img: string
  role: string
  company: [
    {
      edition: string
      company: string
    }
  ]
  signatures: [
    {
      day: string,
      edition: string,
      signatures: [string]
    }
  ]
  mail: string
  bearer: [
    {
      token: string
      refreshToken: string
      ttl: number
      date: string
    }
  ]
  facebook: {
    id: string
    token: string
  }
  google: {
    id: string
    token: string
  }
  fenix: {
    id: string
    token: string
    refreshToken: string
    ttl: number
    created: string
  }
  points: {
    available: number
    total: number
  }
  achievements: [
    {
      id: string
      session: string
      name: string
      img: string
    }
  ]
  area: string
  skills: [
    string
  ]
  job: {
    startup: boolean
    internship: boolean
    start: string
  }
  registered: string
  updated: string
}
