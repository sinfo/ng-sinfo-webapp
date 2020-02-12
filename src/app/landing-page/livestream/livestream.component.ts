import { Component, OnInit } from '@angular/core';
import { LivestreamService } from './livestream.service';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.css']
})
export class LivestreamComponent implements OnInit {

  constructor(private liveStreamService: LivestreamService) { }

  ngOnInit() {

  }

  goToLivestream() {
    this.liveStreamService.getLivestreamInformation().subscribe(
      data => {
        if (data["url"])
          window.open(data["url"], "_blank");
      }
    );
  }

}
