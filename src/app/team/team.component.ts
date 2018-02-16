import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Member } from './member.model'
import { TeamService } from './team.service'

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  private team: Member[]

  constructor (
    private router: Router,
    private teamService: TeamService
  ) { }

  ngOnInit () {
    this.getTeam()
  }

  getTeam (): void {
    this.teamService.getTeam()
      .subscribe(team => this.team = team)
  }

}
