import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { Member } from './member.model'
import { TeamService } from './team.service'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  @Input() event: string
  team: Member[]

  constructor (
    private router: Router,
    private teamService: TeamService
  ) { }

  ngOnInit () {
    this.getTeam()
  }

  getTeam (): void {
    if (this.event == null) {
      this.event = environment.currentEvent
    }
    this.teamService.getTeam(this.event)
      .subscribe(team => {
        this.team = team
      })
  }
}
