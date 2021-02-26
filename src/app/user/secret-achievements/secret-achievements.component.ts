import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Event } from '../../events/event.model';
import { EventService } from '../../events/event.service';
import { Achievement } from '../achievements/achievement.model';
import { AchievementService } from '../achievements/achievement.service';
import { User } from '../user.model';
import { UserService } from '../user.service';
import {ClipboardService} from "ngx-clipboard";

@Component({
  selector: 'app-secret-achievements',
  templateUrl: './secret-achievements.component.html',
  styleUrls: ['./secret-achievements.component.css']
})


export class SecretAchievementsComponent implements OnInit {

  secrets: Achievement[]
  me: User
  currentEvent: Event
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 30 }

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private achievementsService: AchievementService,
    private clipboardService: ClipboardService,
    private router: Router,
    private titleService: Title
  ) {
  }

  ngOnInit(): void {
    this.eventService.getCurrent().subscribe(event => {
      this.currentEvent = event
      this.titleService.setTitle(event.name + ' - Session Codes')
      this.getAchievements()
    })
  }

  createSecret(): void {
    const expirationDate = new Date()
    expirationDate.setFullYear(2021)
    expirationDate.setHours(this.time.hour, this.time.minute, this.time.second)
    this.achievementsService.createSecretAchievement(expirationDate)
      .subscribe(achievement => {
        this.secrets.push(achievement)
      })
  }


  getAchievements(): void {

    this.achievementsService.getAchievementsCode(
      new Date(Math.min.apply(null, [this.currentEvent.begin, new Date(0)])),
      new Date(new Date(this.currentEvent.begin).getTime() + new Date(this.currentEvent.duration).getTime()),
      'secret'
    ).subscribe(achievements => {
      this.secrets = achievements
    })
  }

  formatDate(date: string | Date): string {
    const newDate = typeof date === 'string' ? new Date(date) : date
    return newDate.toUTCString()
  }

  copyCode(code: string): void {
    this.clipboardService.copyFromContent(code)
  }

}
