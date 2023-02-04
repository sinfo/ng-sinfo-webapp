import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService } from '../auth.service'

@Component({
  selector: 'app-microsoft-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class MicrosoftLoginComponent implements OnInit {
  private isLoggedIn = false
  submitting = true

  constructor (
    private authService: AuthService,
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit () {
    this.isLoggedIn = this.authService.isLoggedIn()

    if (this.isLoggedIn) {
      this.router.navigate([`${this.authService.redirectUrl || '/user/qrcode'}`])
      return
    }

    this.route.queryParams.subscribe(params => {
      console.log(params);
    })
  }

  onMicrosoftLogin (code) {
    /*this.authService.linkedin(code).subscribe(cannonToken => {
      this.authService.setToken(cannonToken)
      this.router.navigate([`${this.authService.redirectUrl || '/user/qrcode'}`])
    })*/
  }
}
