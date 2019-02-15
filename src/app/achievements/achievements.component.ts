import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { Achievement } from './achievement.model'
import { AchievementService } from './achievement.service'
import { AuthService } from '../auth/auth.service'
import { UserService } from '../user/user.service'
import { User } from '../user/user.model'

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit {
  activeAchievements: Achievement[]
  achievements: Achievement[]
  myAchievements: Achievement[]
  user: User
  show: Boolean
  show_hide: String
  days: {
    monday : Achievement[],
    tuesday : Achievement[],
    wednesday : Achievement[],
    thursday : Achievement[],
    friday : Achievement[],
    others : Achievement[]
  }

  cheat = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Others" ]

  constructor (
    private achievementService: AchievementService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit () {
    this.days = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      others: []
    }
    this.show=false
    this.show_hide = "Show all achievements"
    this.achievementService.getActiveAchievements().subscribe(achievements => {
      console.log(achievements)
      this.activeAchievements = achievements
      .filter((a) => { return a.id !== undefined }) // Filter any empty achievements
      .sort((a, b) => { return a.id.localeCompare(b.id) }) // sort by id
    })

    this.achievementService.getAchievements().subscribe(achievements => {
      this.achievements = achievements
      .filter((a) => {return a.id})
      .filter((a) => {
        return  a.validity.to || a.validity.from
       })
      .sort((a, b) => { return a.id.localeCompare(b.id) }) // sort by id

      this.achievements.forEach(element => {
        let from = new Date(element.validity.from)
        let to = new Date(element.validity.to)
        let day = from.getUTCDay()
        if(day === to.getUTCDay()){
          switch(day){
            case(1):
              this.days.monday.push(element)
              break;
            case(2):
              this.days.tuesday.push(element)
              break;
            case(3):
              this.days.wednesday.push(element)
              break;
            case(4):
              this.days.thursday.push(element)
              break;
            case(5):
              this.days.friday.push(element)
              break
            default:
              break;
          }
        }
        else{
          this.days.others.push(element)
        }
      });
    })

    if (this.authService.isLoggedIn()) {
      this.userService.getMe().subscribe(user => {
        this.user = user
        this.userService.getUserAchievements(user.id).subscribe(achievements => {
          this.myAchievements = achievements
        })
      })
    }
  }

  isUnlocked (achievement: Achievement): boolean {
    return this.user && achievement.users ? achievement.users.indexOf(this.user.id) !== -1 : false
  }

  numUserAchievements () {
    return this.myAchievements && this.myAchievements.length ? this.myAchievements.length : 0
  }

  changeButton() {
    this.show_hide = this.show? "Hide all achievements" : "Show all achievements" 
  }

  showPrev() {
    this.show = !this.show
    this.changeButton()
  }
}
