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

export class SpeedDate {
  achievement: Achievement
  frequence: number

  getPoints() {
    if (this.frequence === 0) { return 0 }
    const pow = this.frequence > 3 ? 3 : this.frequence

    return this.achievement.value / (Math.pow(2, pow - 1))
  }

  constructor(s: SpeedDate) {
    this.achievement = Object.assign({}, s.achievement)
    this.frequence = s.frequence
  }
}
