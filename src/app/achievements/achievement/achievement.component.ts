import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'

import { Achievement } from '../achievement.model'
import { AchievementService } from '../achievement.service'

@Component({
  selector: 'app-achievement',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css']
})
export class AchievementComponent implements OnInit {
  achievement: Achievement

  constructor (
    private achievementService: AchievementService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit () {
    this.activatedRoute.params.forEach((params: Params) => {
      const id = params['id']
      this.getAchievement(id)
    })
  }

  getAchievement (id: string): void {
    this.achievementService.getAchievement(id)
      .subscribe(achievement => this.achievement = achievement)
  }
}
