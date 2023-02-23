import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { Router } from '@angular/router'
import { Speaker } from './speaker.model'
import { SpeakerService } from './speaker.service'
import { EventService } from '../events/event.service'
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.css'],
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
export class SpeakersComponent implements OnInit, OnChanges {
  @Input() eventId: string
  speakers: Speaker[]
  previousSpeakers: Boolean

  constructor(
    private router: Router,
    private speakerService: SpeakerService,
  ) { }

  ngOnInit() {
    this.getSpeakers()
  }

  ngOnChanges() {
    this.getSpeakers()
  }

  getSpeakers(): void {
    this.speakerService.getSpeakers()
      .subscribe(speakerData => {
        this.eventId = speakerData.eventId
        this.previousSpeakers = speakerData.previousEdition,
        this.speakers = speakerData.speakers
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
