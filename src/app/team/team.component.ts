import { Component, OnInit, OnChanges, Input } from '@angular/core'
import { Router } from '@angular/router'
import { Member } from './member.model'
import { TeamService } from './team.service'

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, OnChanges {
  @Input() eventId: string
  team: Member[]

  constructor (
    private router: Router,
    private teamService: TeamService
  ) { }

  ngOnInit () {
    this.getTeam()
  }

  ngOnChanges () {
    this.getTeam()
  }

  getTeam (): void {
    this.teamService.getTeam(this.eventId)
      .subscribe(team => {
        this.team = team
      })
  }
}
