import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Speaker } from './speaker.model'
import { SpeakerService } from './speaker.service'

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.css']
})
export class SpeakersComponent implements OnInit {
  speakers: Speaker[]

  constructor (
    private router: Router,
    private speakerService: SpeakerService
  ) { }

  ngOnInit () {
    this.getSpeakers()
  }

  getSpeakers (): void {
    this.speakerService.getSpeakers()
      .subscribe(speakers => this.speakers = speakers)
  }

  setCompanyImg (speaker) {
    return {
      'background-image': `url('https://static.sinfo.org/SINFO_25/speakersCompanies/${ speaker.name.replace(/\s/g, '')}.png')`
    }
  }

  onSelect (speaker: Speaker): void {
    this.router.navigate(['/speakers', speaker.id])
  }
}
