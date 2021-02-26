export class Endpoint {
  company: string
  edition: string
  visited: number
  validity: {
    from: Date
    to: Date
  }
  created: Date
  updated: Date
}
