import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { Achievement } from './achievement.model'
import { AchievementService } from './achievement.service'

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit {
  
  achievements: Achievement[]

  constructor(
    private achievementService: AchievementService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAchievements()
  }

  getAchievements (): void {
    this.achievementService.getAchievements()
      .subscribe(achievements => this.achievements = achievements)
  }

  onSelect (achievement: Achievement): void {
    this.router.navigate(['/achievement', achievement.id])
  }

}
