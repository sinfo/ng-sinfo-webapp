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
    const team = this.teamService.getLocalTeam()
    if (team) {
      this.team = team
    } else {
      // If team does not exist in MemberService memory we need to get it from the API
      this.getTeam()
    }
  }

  getTeam (): void {
    this.teamService.getTeam()
      .subscribe(team => this.team = team)
  }

}
