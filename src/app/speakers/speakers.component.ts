import { Component, OnInit } from '@angular/core'
import { Speaker } from './speaker.model'
import { SpeakerService } from './speaker.service'

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.css']
})
export class SpeakersComponent implements OnInit {
  gettingSpeakers = false
  speakers: Speaker[]
  speaker: Speaker

  constructor (private speakerService: SpeakerService) { }

  ngOnInit () {
    this.getSpeakers()
    this.getSpeaker('greg-street')
  }

  getSpeakers (): void {
    this.speakerService.getSpeakers()
      .subscribe(speakers => {
        this.speakers = speakers
        this.gettingSpeakers = true
      })
  }

  setCompanyImg (speaker) {
    return {
      'background-image': `url('https://static.sinfo.org/SINFO_25/speakersCompanies/${ speaker.name.replace(/\s/g, '')}.png')`
    }
  }

  getSpeaker (id: string): void {
    this.speakerService.getSpeaker(id)
      .subscribe(speaker => this.speaker = speaker)
  }

}
