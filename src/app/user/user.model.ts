
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
      redeemed: boolean,
      signatures: {
        companyId: string,
        date: Date
      }[]
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
  }
  linkedin: {
    id: string
  }
  google: {
    id: string
  }
  fenix: {
    id: string
  }
  points: number
  registered: string
  updated: string
}
