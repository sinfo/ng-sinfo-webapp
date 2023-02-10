import { Component, OnInit, AfterViewInit, NgZone, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

import { environment } from "../../../environments/environment";
import { AuthService } from "../auth.service";
import { EventService } from "../../events/event.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtService } from "../jwt.service";

declare let google: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, AfterViewInit {
  isGoogleActive: boolean;

  submitting = false;

  fenixUrlAuth = `https://fenix.tecnico.ulisboa.pt/oauth/userdialog?client_id=${environment.fenix.clientId}&redirect_uri=${environment.fenix.redirectUrl}`;

  // tslint:disable-next-line:max-line-length
  linkedinUrlAuth = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${environment.linkedin.clientId}&redirect_uri=${environment.linkedin.redirectUrl}&state=SINFO&scope=r_liteprofile%20r_emailaddress`;

  private isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    public router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private titleService: Title,
    private snackBar: MatSnackBar,
    private jwtService: JwtService
  ) {}

  ngOnInit() {
    this.eventService.getCurrent().subscribe((event) => {
      this.titleService.setTitle(event.name + " - Login");
    });

    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.router.navigate([
        `${this.authService.redirectUrl || "/user/qrcode"}`,
      ]);
      return;
    }

    this.route.queryParams.subscribe((params) => {
      const fenixCode = params["code"];
      if (fenixCode) {
        this.onFenixLogin(fenixCode);
      }
    });

    this.isGoogleActive = typeof google !== "undefined" && google !== null;

    if (!this.isGoogleActive) {
      this.snackBar.open(
        `You need to disable any ad blocker or tracking protection mechanism to be allowed to login with Google.`,
        "Ok",
        {
          panelClass: ["mat-toolbar", "mat-primary"],
          duration: 2000,
        }
      );
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.renderGoogleButton();
  }

  ngAfterViewInit() {
    this.initSocialSDKs();
  }

  initSocialSDKs() {
    if (this.isGoogleActive) {
      google.accounts.id.initialize({
        client_id: environment.google.clientId,
        callback: this.handleGoogleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: "popup",
      });
      this.renderGoogleButton();
    }
  }

  private renderGoogleButton() {
    google.accounts.id.renderButton(
      document.getElementById("google-button"),
      {
        theme: "outline",
        size: "medium",
        type: "standard",
        shape: "rectangular",
        text: "signin_with",
        logo_alignment: "left",
        width: window.innerWidth < 400 ? window.innerWidth - 16 : 400
      }
    );
  }

  async handleGoogleCredentialResponse(response: any) {
    let userInfo = this.jwtService.decodeToken(response.credential);

    let userId = userInfo.sub;
    let token = response.credential;
    this.authService.google(userId, token).subscribe(
      (cannonToken) => {
        this.authService.setToken(cannonToken);
        this.zone.run(() =>
          this.router.navigate([
            `${this.authService.redirectUrl || "/user/qrcode"}`,
          ])
        );
      },
      (error) => {
        console.error(error);
        this.zone.run(() => this.router.navigate(["/login"]));
      }
    );
  }

  onFenixLogin(fenixCode) {
    this.submitting = true;
    this.authService.fenix(fenixCode).subscribe((cannonToken) => {
      this.authService.setToken(cannonToken);
      this.zone.run(() =>
        this.router.navigate([
          `${this.authService.redirectUrl || "/user/qrcode"}`,
        ])
      );
    });
  }
}
