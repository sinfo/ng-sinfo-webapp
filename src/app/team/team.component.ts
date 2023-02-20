import { Component, OnInit, OnChanges, Input } from '@angular/core'
import { Router } from '@angular/router'
import { Member } from './member.model'
import { TeamService } from './team.service'
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AUTO_STYLE
} from '@angular/animations';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),
  ]
})
export class TeamComponent implements OnInit, OnChanges {
  @Input() eventId: string
  team: Member[]
  isCollapsed = false

  constructor(
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.getTeam()
  }

  ngOnChanges() {
    this.getTeam()
  }

  getTeam(): void {
    this.teamService.getTeam(this.eventId)
      .subscribe(team => {
        this.team = team.filter(member => member.name !== 'ToolBot!')
        console.log(this.team)
      })
  }
}
