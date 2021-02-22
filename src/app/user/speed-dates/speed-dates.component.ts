import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Event } from '../../events/event.model';
import { EventService } from '../../events/event.service';
import { SpeedDate } from '../achievements/achievement.model';
import { AchievementService } from '../achievements/achievement.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-speed-dates',
  templateUrl: './speed-dates.component.html',
  styleUrls: ['./speed-dates.component.css']
})
export class SpeedDatesComponent implements OnInit {

  user: User
  myPoints: number
  event: Event


  days = []

  currentDay = 0

  achievements: SpeedDate[]

  cheat = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']


  constructor(
    private achievementService: AchievementService,
    private userService: UserService,
    private eventService: EventService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Speed Dates')
      const now = new Date()
      const diff = now.getTime() - event.begin.getTime()
      const duration = Math.ceil(new Date(event.duration).getTime() / (24 * 3600 * 1000))
      for (let i = 0; i <= duration; i++) {
        this.days.push({ achievements: [], points: 0 })
      }
      this.currentDay = diff < 0 ? 0 : Math.floor(diff / (24 * 3600 * 1000))
      this.event = event

      this.userService.getMe().subscribe(user => {
        this.user = user
        if (this.achievements === undefined) {
          this.achievements = []
        }
        this.getAchievements()
      })
    })
  }

  increaseDay() {
    if (this.currentDay >= this.days.length - 1) {
      return
    }
    this.currentDay++
  }

  decreaseDay() {
    if (this.currentDay <= 0) {
      return
    }
    this.currentDay--
  }

  getAchievements() {
    if (this.achievements === undefined || this.achievements.length === 0) {
      this.achievementService.getMySpeedDates().subscribe(result => {
        this.myPoints = result.points
        this.achievements = []
        result.achievements.forEach(v => this.achievements.push(v))

        this.achievements.forEach(element => {
          element = new SpeedDate(element)
          let from = new Date(element.achievement.validity.from)
          let day = Math.floor((from.getTime() - new Date(this.event.begin).getTime()) / (3600 * 1000 * 24))
          this.days[day].achievements.push(element)
          this.days[day].points += element.getPoints()
        })
      })
    }
  }
}
