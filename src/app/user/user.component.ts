import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { UserService } from "./user.service";
import { User } from "./user.model";
import { Achievement } from "./achievements/achievement.model";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer, Title } from "@angular/platform-browser";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  user: User;
  achievements: Achievement[];
  opened = true;
  isLoggedIn = false;
  // screenWidth: number;
  isCvUpdated: Boolean = false;
  messages = ['message1'];


  screenHeight = window.innerHeight;
  screenWidth = window.innerWidth;

  mobile = this.screenHeight > this.screenWidth;


  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private titleService: Title,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.userService.getMe().subscribe((me) => {
      this.user = me;
      this.userService.isCvUpdated().subscribe(
        (isCvUpdated) => {
          this.isCvUpdated = isCvUpdated;
        },
        () => {
          this.isCvUpdated = false;
        }
      );
    });
    this.isLoggedIn = this.authService.isLoggedIn();
    this.screenWidth = window.innerWidth;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      // true for mobile device
      console.log("mobile device");
    }else{
      // false for not mobile device
      console.log("not mobile device");
    }

    console.log("window width " + this.screenWidth); 
  }

  reloadApp() {
    window.location.reload();
    this.mobile = this.screenHeight > this.screenWidth;
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
  }

  getUserAchievements(id: string): void {
    this.userService
      .getUserAchievements(id)
      .subscribe((achievements) => (this.achievements = achievements));
  }

  onLogout(): void {
    this.authService.logout();
    this.userService.deleteMe();

    this.router.url === "/"
      ? window.location.reload()
      : this.router.navigate(["/"]);
  }
}
