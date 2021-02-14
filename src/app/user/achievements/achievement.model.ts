export class Achievement {
  id: string
  name: string
  code: {
    created: Date,
    expiration: Date,
    code: String
  }
  validity: {
    from: Date,
    to: Date
  }
  session: string
  img: string
  kind: string
  description: string
  category: string
  users: [
    string
  ]
  instructions: string
  value: number
}
