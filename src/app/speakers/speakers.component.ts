import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { Router } from '@angular/router'
import { Speaker } from './speaker.model'
import { SpeakerService } from './speaker.service'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.css']
})
export class SpeakersComponent implements OnInit, OnChanges {
  @Input() event: string
  speakers: Speaker[]

  constructor (
    private router: Router,
    private speakerService: SpeakerService
  ) { }

  ngOnInit () {
    this.getSpeakers()
  }

  ngOnChanges () {
    this.getSpeakers()
  }

  getSpeakers (): void {
    if (this.event == null) {
      this.event = environment.currentEvent
    }

    this.speakerService.getSpeakers(this.event)
      .subscribe(speakers => {
        this.speakers = speakers

        if (speakers.length !== 0) { return }

        this.event = environment.previousEvent
        this.speakerService.getSpeakers(environment.previousEvent)
          .subscribe(previousSpeakers => this.speakers = previousSpeakers)
        
      })
  }

  setCompanyImg (speaker) {
    return {
      'background-image': `url('https://sinfo.ams3.cdn.digitaloceanspaces.com/static/${environment.currentEvent}/speakersCompanies/${
        speaker.id}.png')`
    }
  }

  onSelect (speaker: Speaker): void {
    this.router.navigate(['/speakers', speaker.id])
  }
}
