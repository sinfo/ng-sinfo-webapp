import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { SpeakersComponent } from "./speakers/speakers.component";
import { SpeakerService } from "./speakers/speaker.service";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { MenuComponent } from "./partials/menu/menu.component";
import { FooterComponent } from "./partials/footer/footer.component";
import { Routing } from "./app.routes";
import {
  PrivacyPolicyComponent,
  CodeOfConductComponent,
  PageNotFoundComponent,
  LiveComponent,
} from "./static/static.component";
import { SpeakerComponent } from "./speakers/speaker/speaker.component";
import { SponsorsComponent } from "./landing-page/sponsors/sponsors.component";
import { SponsorService } from "./landing-page/sponsors/sponsor.service";
import { TeamComponent } from "./team/team.component";
import { TeamService } from "./team/team.service";
import { LoadingComponent } from "./partials/loading/loading.component";
import { UserComponent } from "./user/user.component";
import { UserService } from "./user/user.service";
import { ScheduleComponent } from "./landing-page/schedule/schedule.component";
import { LoginComponent } from "./auth/login/login.component";
import { LinkedinLoginComponent } from "./auth/login/linkedin.component";
import { AuthService } from "./auth/auth.service";
import { StorageService } from "./storage.service";
import { AuthGuard } from "./auth/auth.guard";
import { SessionComponent } from "./session/session.component";
import { FeedbackComponent } from "./landing-page/feedback/feedback.component";
import { MessageService } from "./message.service";
import { JwtService } from "./auth/jwt.service";
import { SidebarComponent } from "./partials/sidebar/sidebar.component";
import { AchievementsComponent } from "./user/achievements/achievements.component";
import { AchievementComponent } from "./user/achievements/achievement/achievement.component";
import { AchievementService } from "./user/achievements/achievement.service";
import { SessionService } from "./session/session.service";
import { ScoreboardComponent } from "./user/scoreboard/scoreboard.component";
import { ScoreboardService } from "./user/scoreboard/scoreboard.service";
import { QrcodeScannerComponent } from "./partials/qr-code-scanner/qr-code-scanner.component";
import { QRCodeModule } from "angularx-qrcode";
import { ZXingScannerModule } from "@zxing/ngx-scanner"; // scan qrcode
import { PromoteComponent } from "./user/promote/promote.component";
import { CompanyService } from "./company/company.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LinkComponent } from "./user/link/link.component";
import { MyLinksComponent } from "./user/link/my-links/my-links.component";
import { MyProfileComponent } from "./user/my-profile/my-profile.component";
import { SignatureComponent } from "./user/signature/signature.component";
import { CompanyCannonService } from "./company/company-cannon.service";
import { MyCardComponent } from "./user/my-card/my-card.component";
import { CardComponent } from "./user/card/card.component";
import { WorkshopsComponent } from "./user/workshops/workshops.component";
import { WorkshopComponent } from "./user/workshops/workshop/workshop.component";
import { TicketService } from "./user/workshops/ticket.service";
import { WorkshopRegisterButtonComponent } from "./user/workshops/workshop/register-button.component";
import { IsTeamGuard } from "./auth/is-team.guard";
import { WorkshopsStatusComponent } from "./user/workshops/workshops-status.component";
import { WorkshopStatusElementComponent } from "./user/workshops/workshop-status-element.component";
import { SurveyComponent } from "./user/survey/survey.component";
import { SurveyService } from "./user/survey/survey.service";
import { SignatureService } from "./user/signature/signature.service";
import { CheckinComponent } from "./user/checkin/checkin.component";
import { SessionCannonService } from "./session/session-cannon.service";
import { ValidateCardComponent } from "./user/validate-card/validate-card.component";
import { EndpointService } from "./endpoints/endpoint.service";
import { DownloadsComponent } from "./user/downloads/downloads.component";
import { ManageDownloadsComponent } from "./user/downloads/manage-downloads/manage-downloads.component";
import { DownloadsStatusComponent } from "./user/downloads/downloads-status/downloads-status.component";
import { EventService } from "./events/event.service";
import { EventComponent } from "./events/event/event.component";
import { CvComponent } from "./user/cv/cv.component";
import { PickWinnerComponent } from "./user/pick-winner/pick-winner.component";
import { PickBestRestComponent } from "./user/pick-best-rest/pick-best-rest.component";
import { RedeemComponent } from "./user/redeem/redeem.component";
import { RedeemService } from "./user/redeem/redeem.service";
import { LivestreamComponent } from "./landing-page/livestream/livestream.component";
import { PromocodesComponent } from "./user/promocodes/promocodes.component";
import { StandsComponent } from "./landing-page/stands/stands.component";
import { ImageDirective } from "./partials/image.directive";
import { PartnersComponent } from "./landing-page/partners/partners.component";
import { SessionsComponent } from "./user/sessions/sessions.component";
import { SelfcheckinComponent } from "./user/selfcheckin/selfcheckin.component";
import { SpeedDatesComponent } from "./user/speed-dates/speed-dates.component";
import { SpeedDateSignComponent } from "./user/speed-date-sign/speed-date-sign.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ClipboardModule } from "ngx-clipboard";
import { SecretAchievementsComponent } from "./user/secret-achievements/secret-achievements.component";
import { NumberPickerModule } from "ng-number-picker";
import { MarkdownModule } from "ngx-markdown";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { CommonModule } from "@angular/common";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDialogModule } from "@angular/material/dialog";
import { GdprDialogComponent } from "./user/cv/gdpr-dialog/gdpr-dialog.component";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatBadgeModule } from "@angular/material/badge";

library.add(fas);

@NgModule({
  declarations: [
    AppComponent,
    SpeakersComponent,
    LandingPageComponent,
    MenuComponent,
    FooterComponent,
    PrivacyPolicyComponent,
    CodeOfConductComponent,
    PageNotFoundComponent,
    SpeakerComponent,
    SponsorsComponent,
    TeamComponent,
    ScheduleComponent,
    QrcodeScannerComponent,
    LoadingComponent,
    LoginComponent,
    LinkedinLoginComponent,
    MyProfileComponent,
    UserComponent,
    SessionComponent,
    FeedbackComponent,
    PromoteComponent,
    SessionsComponent,
    SidebarComponent,
    LinkComponent,
    MyLinksComponent,
    AchievementsComponent,
    AchievementComponent,
    SignatureComponent,
    MyCardComponent,
    CardComponent,
    SidebarComponent,
    WorkshopsComponent,
    WorkshopsStatusComponent,
    WorkshopRegisterButtonComponent,
    WorkshopComponent,
    WorkshopStatusElementComponent,
    SurveyComponent,
    ScoreboardComponent,
    CheckinComponent,
    LiveComponent,
    ValidateCardComponent,
    DownloadsComponent,
    ManageDownloadsComponent,
    DownloadsStatusComponent,
    PickWinnerComponent,
    PickBestRestComponent,
    EventComponent,
    CvComponent,
    RedeemComponent,
    LivestreamComponent,
    PromocodesComponent,
    StandsComponent,
    ImageDirective,
    PartnersComponent,
    SelfcheckinComponent,
    SpeedDatesComponent,
    SpeedDateSignComponent,
    SecretAchievementsComponent,
    GdprDialogComponent,
  ],
  imports: [
    MatSlideToggleModule,
    CommonModule,
    MatDialogModule,
    BrowserModule,
    HttpClientModule,
    Routing,
    QRCodeModule,
    ZXingScannerModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule,
    ClipboardModule,
    NumberPickerModule,
    MarkdownModule.forRoot(),
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
  ],
  providers: [
    SpeakerService,
    MessageService,
    SponsorService,
    TeamService,
    AuthService,
    AuthGuard,
    IsTeamGuard,
    StorageService,
    UserService,
    SessionService,
    CompanyService,
    CompanyCannonService,
    JwtService,
    AchievementService,
    TicketService,
    SurveyService,
    SignatureService,
    ScoreboardService,
    SessionCannonService,
    EndpointService,
    EventService,
    RedeemService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
