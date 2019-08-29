import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'

import { Achievement } from './achievement.model'
import { AchievementService } from './achievement.service'
import { EventService } from '../events/event.service'
import { UserService } from '../user/user.service'
import { User } from '../user/user.model'

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit {
  activeAchievements: {
    workshops: Achievement[],
    presentations: Achievement[],
    keynotes: Achievement[],
    stands: Achievement[],
    cv: Achievement,
    other: Achievement[]
    total: {
      number: number,
      value: number
    }
  }

  achievements: Achievement[]
  myAchievements: number
  myPoints: number

  user: User
  show: Boolean
  show_hide: String
  days: {
    monday: Achievement[],
    tuesday: Achievement[],
    wednesday: Achievement[],
    thursday: Achievement[],
    friday: Achievement[],
    others: Achievement[]
  }

  cheat = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Others' ]

  constructor (
    private achievementService: AchievementService,
    private userService: UserService,
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit () {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Achievements')
    })

    this.days = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      others: []
    }
    this.show = false
    this.show_hide = 'Show all achievements'

    this.userService.getMe().subscribe(user => {
      this.user = user
      this.updateActiveAchievements()
      this.updateAchievements()
    })
  }

  updateActiveAchievements () {
    this.myPoints = 0
    this.myAchievements = 0

    this.achievementService.getActiveAchievements().subscribe(achievements => {
      this.activeAchievements = achievements
      .filter((a) => { return a.id !== undefined }) // Filter any empty achievements
      .sort((a, b) => { return a.id.localeCompare(b.id) }) // sort by id
      .reduce((acc, curr) => {
        switch (curr.kind) {
          case 'stand':
            acc.stands.push(curr)
            break
          case 'presentation':
            acc.presentations.push(curr)
            break
          case 'workshop':
            acc.workshops.push(curr)
            break
          case 'keynote':
            acc.keynotes.push(curr)
            break
          case 'cv':
            acc.cv = curr
            break
          default:
            acc.other.push(curr)
            break
        }

        acc.total.value += curr.value
        acc.total.number += 1

        if (curr.value !== undefined && curr.value > 0 &&
          curr.users.filter(userId => userId === this.user.id).length > 0) {
          this.myPoints += curr.value
          this.myAchievements += 1
        }

        return acc
      }, {
        workshops: [],
        presentations: [],
        keynotes: [],
        stands: [],
        cv: null,
        other: [],
        total: {
          number: 0,
          value: 0
        }
      })

    })
  }

  updateAchievements () {
    this.achievementService.getAchievements().subscribe(achievements => {
      this.achievements = achievements
      .filter((a) => { return a.id })
      .filter((a) => {
        return a.validity.to || a.validity.from
       })
      .sort((a, b) => { return a.id.localeCompare(b.id) }) // sort by id

      this.achievements.forEach(element => {
        let from = new Date(element.validity.from)
        let to = new Date(element.validity.to)
        let day = from.getUTCDay()
        if (day === to.getUTCDay()) {
          switch (day) {
            case(1):
              this.days.monday.push(element)
              break
            case(2):
              this.days.tuesday.push(element)
              break
            case(3):
              this.days.wednesday.push(element)
              break
            case(4):
              this.days.thursday.push(element)
              break
            case(5):
              this.days.friday.push(element)
              break
            default:
              break
          }
        } else {
          this.days.others.push(element)
        }
      })
    })
  }

  isUnlocked (achievement: Achievement): boolean {
    return this.user && achievement.users ? achievement.users.indexOf(this.user.id) !== -1 : false
  }

  changeButton () {
    this.show_hide = this.show ? 'Hide all achievements' : 'Show all achievements'
  }

  showPrev () {
    this.show = !this.show
    this.changeButton()
  }

  deleteAchievements () {
    this.achievementService.deleteMyAchievements()
      .subscribe(() => this.updateActiveAchievements())
  }
}
