export class Achievement {
  id: string
  name: string
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
