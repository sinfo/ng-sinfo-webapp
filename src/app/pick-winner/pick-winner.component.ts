import { Component, OnInit } from '@angular/core'
import { Router, Params, RouterStateSnapshot } from '@angular/router'
import { UserService } from '../user/user.service'
import { User } from '../user/user.model'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'

@Component({
  selector: 'app-pick-winner',
  templateUrl: './pick-winner.component.html',
  styleUrls: ['./pick-winner.component.css']
})
export class PickWinnerComponent implements OnInit {
  numberOfParticipants: string
  me: User
  link: SafeUrl

  constructor (
    private router: Router,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit () {
    let randomLink = `https://www.random.org/widgets/integers/iframe.php?title=True+Random+Number+Generator&amp;buttontxt=Generate&amp;width=160&amp;height=200&amp;border=off&amp;bgcolor=%23FFFFFF&amp;txtcolor=%23777777&amp;altbgcolor=%23CCCCFF&amp;alttxtcolor=%23000000&amp;defaultmin=0&amp;defaultmax=50&amp;fixed=off`
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(randomLink)

    this.userService.getMe().subscribe(user => {
      this.me = user

      if (user.role !== 'team') {
        this.router.navigate(['/qrcode'])
      }
    })

    console.log(this.link)

  }

}
