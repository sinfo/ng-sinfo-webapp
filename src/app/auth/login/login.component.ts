import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { environment } from '../../../environments/environment'
import { AuthService } from '../auth.service'
import { MessageService, Type } from '../../message.service'
import { EventService } from '../../events/event.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

declare let FB: any
declare let gapi: any

let GoogleAuth
let GOOGLE_SCOPE = 'profile email openid'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  isFacebookActive: boolean
  isGoogleActive: boolean

  submitting = false

  fenixUrlAuth =
    `https://fenix.tecnico.ulisboa.pt/oauth/userdialog?client_id=${environment.fenix.clientId}&redirect_uri=${environment.fenix.redirectUrl}`

  // tslint:disable-next-line:max-line-length
  linkedinUrlAuth = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${environment.linkedin.clientId}&redirect_uri=${environment.linkedin.redirectUrl}&state=SINFO&scope=r_liteprofile%20r_emailaddress%20w_member_social`

  private isLoggedIn = false

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private eventService: EventService,
    public router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private titleService: Title,
    private snackBar: MatSnackBar

  ) { }

  ngOnInit() {
    this.eventService.getCurrent().subscribe(event => {
      this.titleService.setTitle(event.name + ' - Login')
    })

    this.isLoggedIn = this.authService.isLoggedIn()

    if (this.isLoggedIn) {
      this.router.navigate([`${this.authService.redirectUrl || '/user/qrcode'}`])
      return
    }

    this.route.queryParams.subscribe(params => {
      const fenixCode = params['code']
      if (fenixCode) {
        this.onFenixLogin(fenixCode)
      }
    })

    this.isFacebookActive = (typeof (FB) !== 'undefined' && FB !== null)
    this.isGoogleActive = (typeof (gapi) !== 'undefined' && gapi !== null)

    if (!this.isFacebookActive) {
      this.snackBar.open(`You need to disable any ad blocker or tracking protection mechanism to be allowed to login with Google.`, "Ok", {
        panelClass: ['mat-toolbar', 'mat-primary'],
        duration: 2000
      })
      /* this.messageService.add({
        origin: `LoginComponent: ngOnInit isFacebookActive=${this.isFacebookActive}`,
        text: `You need to disable any ad blocker or tracking protection mechanism to be
                allowed to login with Facebook.`,
        showAlert: true,
        type: Type.log,
        timeout: 4000
      }) */
    }
    if (!this.isGoogleActive) {
      this.snackBar.open(`You need to disable any ad blocker or tracking protection mechanism to be allowed to login with Facebook.`, "Ok", {
        panelClass: ['mat-toolbar', 'mat-primary'],
        duration: 2000
      })
      /* this.messageService.add({
        origin: `LoginComponent: ngOnInit isGoogleActive=${this.isGoogleActive}`,
        text: `You need to disable any ad blocker or tracking protection mechanism to be
                allowed to login with Google.`,
        type: Type.log,
        showAlert: true,
        timeout: 4000
      }) */
    }
  }

  ngAfterViewInit() {
    this.initSocialSDKs()
  }

  initSocialSDKs() {
    if (this.isGoogleActive) {

      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: environment.google.clientId,
          cookiepolicy: 'single_host_origin',
          scope: GOOGLE_SCOPE
        }).then(() => {
          try {
            GoogleAuth = gapi.auth2.getAuthInstance()

            // Listen for sign-in state changes.
            GoogleAuth.isSignedIn.listen(isSignedIn => { this.onGoogleListen(isSignedIn) })
          } catch (err) {
            console.log(err)
          }
        })
      })
    }
    if (this.isFacebookActive) {
      FB.init({
        appId: environment.facebook.appId,
        cookie: false,
        xfbml: true,
        version: 'v5.0'
      })
    }
  }

  onFenixLogin(fenixCode) {
    this.submitting = true
    this.authService.fenix(fenixCode).subscribe(cannonToken => {
      this.authService.setToken(cannonToken)
      this.zone.run(() => this.router.navigate([`${this.authService.redirectUrl || '/user/qrcode'}`]))
    })
  }

  onGoogleListen(isSignedIn: boolean) {
    if (!isSignedIn) { GoogleAuth.signIn(); return }

    let googleUser = GoogleAuth.currentUser.get()

    const profile = googleUser.getBasicProfile()
    const userId = profile.getId()
    const token = googleUser.getAuthResponse().id_token

    this.authService.google(userId, token).subscribe(
      cannonToken => {
        this.authService.setToken(cannonToken)
        this.zone.run(() => this.router.navigate([`${this.authService.redirectUrl || '/user/qrcode'}`]))
      },
      error => {
        console.error(error)
        this.zone.run(() => this.router.navigate(['/login']))
      })
  }

  onGoogleLogin() {
    this.submitting = true

    if (GoogleAuth.isSignedIn.get()) {
      this.onGoogleListen(true)
    } else {
      GoogleAuth.signIn().then(isSignedIn => { this.onGoogleListen(isSignedIn) })
    }
  }

  onFacebookLogin() {
    this.submitting = true
    FB.login(response => {
      this.facebookStatusChange(response)
    }, { scope: 'public_profile,email' })
  }

  facebookStatusChange(resp) {
    if (resp.status === 'connected') {
      // connect here with your server for facebook login by passing access token given by facebook
      this.authService.facebook(resp.authResponse.userID, resp.authResponse.accessToken)
        .subscribe(cannonToken => {
          this.authService.setToken(cannonToken)
          this.zone.run(() => this.router.navigate([`${this.authService.redirectUrl || '/user/qrcode'}`]))
        })
    } else if (resp.status === 'not_authorized') {
      this.snackBar.open(`You were not allowed to login with Facebook`, "Ok", {
        panelClass: ['mat-toolbar', 'mat-warn'],
        duration: 2000
      })
      /* this.messageService.add({
        origin: `LoginComponent: facebookStatusChange: ${resp.status}`,
        text: 'You were not allowed to login with Facebook',
        type: Type.error,
        showAlert: false,
        errorObject: resp
      }) */
    } else {
      this.snackBar.open(`An error occurred by logging with Facebook`, "Ok", {
        panelClass: ['mat-toolbar', 'mat-warn'],
        duration: 2000
      })
      /* this.messageService.add({
        origin: `LoginComponent: facebookStatusChange: ${resp.status}`,
        text: 'An error occurred by logging with Facebook',
        type: Type.error,
        showAlert: false,
        errorObject: resp
      }) */
    }
  }
}
