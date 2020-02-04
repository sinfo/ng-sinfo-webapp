import { Component, OnInit } from '@angular/core';
import { LivestreamService } from './livestream.service';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.css']
})
export class LivestreamComponent implements OnInit {

  constructor(private livestreamService: LivestreamService) { }

  ngOnInit() {

  }

  goToLivestream() {
    var livestreamId = this.livestreamService.getLivestreamId();
    if (livestreamId)
      window.location.href = 'https://www.youtube.com/watch?v=' + livestreamId;
  }

}
