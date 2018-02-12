import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Member } from './member.model'
import { MemberService } from './member.service'

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  private team: Member[]

  constructor (
    private router: Router,
    private memberService: MemberService
  ) { }

  ngOnInit () {
    const team = this.memberService.getLocalTeam()
    if (team) {
      this.team = team
    } else {
      // If team does not exist in MemberService memory we need to get it from the API
      this.getTeam()
    }
  }

  getTeam (): void {
    this.memberService.getTeam()
      .subscribe(team => this.team = team)
  }

}
