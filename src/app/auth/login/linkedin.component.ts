import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService } from '../auth.service'

@Component({
  selector: 'app-linkedin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LinkedInLoginComponent implements OnInit {
  private isLoggedIn = false

  constructor (
    private authService: AuthService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit () {
    this.isLoggedIn = this.authService.isLoggedIn()

    if (this.isLoggedIn) {
      this.router.navigate([`${this.authService.redirectUrl || '/qrcode'}`])
      return
    }

    this.route.queryParams.subscribe(params => {
      const linkedInCode = params['code']
      if (linkedInCode) {
        this.onLinkedInLogin(linkedInCode)
      }
    })
  }

  onLinkedInLogin (code) {
    this.authService.linkedIn(code).subscribe(cannonToken => {
      this.authService.setToken(cannonToken)
      this.router.navigate([ `${this.authService.redirectUrl || '/qrcode'}` ])
    })
  }
}
