export class Achievement {
  constructor(
    public name: string,
    public event: string,
    public validFrom: Date,
    public validTo: Date,
    public kind: string,
    public value: number,
    public id?: string,
    public users?: [
      string
    ],
    public code?: {
      created: Date,
      expiration: Date,
      code: String
    },
    public unregisteredUsers?: number,
    public img?: File,
    public session?: string,
    public description?: string,
    public category?: string,
    public instructions?: string,
  ) {}
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
