import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'

import { SpeakerService } from '../speaker.service'
import { Speaker } from '../speaker.model'

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.css']
})
export class SpeakerComponent implements OnInit {
  private speaker: Speaker

  constructor (
    private speakerService: SpeakerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit () {
    this.route.params.forEach((params: Params) => {
      const id = params['id']
      this.getSpeaker(id)
    })
  }

  getSpeaker (id: string): void {
    this.speakerService.getSpeaker(id)
      .subscribe(speaker => this.speaker = speaker)
  }

}
