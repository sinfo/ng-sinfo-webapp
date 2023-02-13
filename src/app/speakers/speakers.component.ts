import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { Router } from '@angular/router'
import { Speaker } from './speaker.model'
import { SpeakerService } from './speaker.service'
import { EventService } from '../events/event.service'

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.css']
})
export class SpeakersComponent implements OnInit, OnChanges {
  @Input() eventId: string
  speakers: Speaker[]
  previousSpeakers: Boolean

  constructor(
    private router: Router,
    private speakerService: SpeakerService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.getSpeakers()
  }

  ngOnChanges() {
    this.getSpeakers()
  }

  getSpeakers(): void {
    this.speakerService.getSpeakers(this.eventId)
      .subscribe(speakers => {
        if (speakers.length !== 0) {
          this.speakers = speakers
          this.previousSpeakers = false
        } else {
          this.eventService.getPrevious().subscribe(event => {
            this.eventId = event.id
            this.speakerService.getSpeakers(this.eventId)
              .subscribe(previousSpeakers => this.speakers = previousSpeakers)
            this.previousSpeakers = true
          })
        }
      })
  }

  setCompanyImg(speaker) {
    return {
      'background-image': `url('https://sinfo.ams3.cdn.digitaloceanspaces.com/static/${this.eventId}/speakersPhotos/${speaker.id}.png')`
    }
  }

  onSelect(speaker: Speaker): void {
    this.router.navigate(['/speakers', speaker.id])
  }
}
