import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component'
import { SpeakersComponent } from './speakers/speakers.component'
import { SpeakerService } from './speakers/speaker.service'
import { LandingPageComponent } from './landing-page/landing-page.component'
import { MenuComponent } from './partials/menu/menu.component'
import { FooterComponent } from './partials/footer/footer.component'
import { Routing } from './app.routes'
import {
  PrivacyPolicyComponent,
  CodeOfConductComponent,
  PageNotFoundComponent,
  LiveComponent
} from './static/static.component'
import { AchievementComponent } from './achievements/achievement/achievement.component'
import { AchievementsComponent } from './achievements/achievements.component'
import { AchievementService } from './achievements/achievement.service'
import { AuthGuard } from './auth/auth.guard'
import { AuthService } from './auth/auth.service'
import { CardComponent } from './user/card/card.component'
import { CheckinComponent } from './user/checkin/checkin.component'
import { CompanyCannonService } from './company/company-cannon.service'
import { CompanyService } from './company/company.service'
import { CvComponent } from './user/cv/cv.component'
import { DownloadsComponent } from './user/downloads/downloads.component'
import { DownloadsStatusComponent } from './user/downloads/downloads-status/downloads-status.component'
import { EndpointService } from './endpoints/endpoint.service'
import { EventComponent } from './events/event/event.component'
import { EventService } from './events/event.service'
import { FeedbackComponent } from './landing-page/feedback/feedback.component'
import { IsTeamGuard } from './auth/is-team.guard'
import { JwtService } from './auth/jwt.service'
import { LinkComponent } from './user/link/link.component'
import { LinkedInLoginComponent } from './auth/login/linkedin.component'
import { LoadingComponent } from './partials/loading/loading.component'
import { LoginComponent } from './auth/login/login.component'
import { ManageDownloadsComponent } from './user/downloads/manage-downloads/manage-downloads.component'
import { MessageService } from './message.service'
import { MyLinksComponent } from './user/link/my-links/my-links.component'
import { MyProfileComponent } from './user/my-profile/my-profile.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NgxQRCodeModule } from 'ngx-qrcode3' // generate qrcode
import { PickWinnerComponent } from './pick-winner/pick-winner.component'
import { PromoteComponent } from './user/promote/promote.component'
import { QrcodeScannerComponent } from './partials/qr-code-scanner/qr-code-scanner.component'
import { RedeemComponent } from './user/redeem/redeem.component'
import { RedeemService } from './user/redeem/redeem.service'
import { ScheduleComponent } from './landing-page/schedule/schedule.component'
import { ScoreboardComponent } from './scoreboard/scoreboard.component'
import { ScoreboardService } from './scoreboard/scoreboard.service'
import { SessionCannonService } from './session/session-cannon.service'
import { SessionComponent } from './session/session.component'
import { SessionService } from './session/session.service'
import { SidebarComponent } from './partials/sidebar/sidebar.component'
import { SignatureComponent } from './user/signature/signature.component'
import { SignatureService } from './user/signature/signature.service'
import { SpeakerComponent } from './speakers/speaker/speaker.component'
import { SponsorComponent } from './sponsors/sponsor/sponsor.component'
import { SponsorsComponent } from './sponsors/sponsors.component'
import { SponsorService } from './sponsors/sponsor.service'
import { StorageService } from './storage.service'
import { SurveyComponent } from './user/survey/survey.component'
import { SurveyService } from './user/survey/survey.service'
import { TeamComponent } from './team/team.component'
import { TeamService } from './team/team.service'
import { TicketService } from './session/workshops/ticket.service'
import { UserComponent } from './user/user.component'
import { UserService } from './user/user.service'
import { ValidateCardComponent } from './user/validate-card/validate-card.component'
import { WorkshopComponent } from './session/workshops/workshop/workshop.component'
import { WorkshopRegisterButtonComponent } from './session/workshops/workshop/register-button.component'
import { WorkshopsComponent } from './session/workshops/workshops.component'
import { WorkshopsStatusComponent } from './session/workshops/workshops-status.component'
import { WorkshopStatusElementComponent } from './session/workshops/workshop-status-element.component'
import { ZXingScannerModule } from '@zxing/ngx-scanner' // scan qrcode

@NgModule({
  declarations: [
    AchievementComponent,
    AchievementsComponent,
    AppComponent,
    CardComponent,
    CheckinComponent,
    CodeOfConductComponent,
    CvComponent,
    DownloadsComponent,
    DownloadsStatusComponent,
    EventComponent,
    FeedbackComponent,
    FooterComponent,
    LandingPageComponent,
    LinkComponent,
    LinkedInLoginComponent,
    LiveComponent,
    LoadingComponent,
    LoginComponent,
    ManageDownloadsComponent,
    MenuComponent,
    MyLinksComponent,
    MyProfileComponent,
    PageNotFoundComponent,
    PickWinnerComponent,
    PrivacyPolicyComponent,
    PromoteComponent,
    QrcodeScannerComponent,
    RedeemComponent,
    ScheduleComponent,
    ScoreboardComponent,
    SessionComponent,
    SidebarComponent,
    SidebarComponent,
    SignatureComponent,
    SpeakerComponent,
    SpeakersComponent,
    SponsorsComponent,
    SponsorComponent,
    SurveyComponent,
    TeamComponent,
    UserComponent,
    ValidateCardComponent,
    WorkshopComponent,
    WorkshopRegisterButtonComponent,
    WorkshopsComponent,
    WorkshopsStatusComponent,
    WorkshopStatusElementComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    NgxQRCodeModule,
    ZXingScannerModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [
    AchievementService,
    AuthGuard,
    AuthService,
    CompanyCannonService,
    CompanyService,
    EndpointService,
    EventService,
    IsTeamGuard,
    JwtService,
    MessageService,
    RedeemService,
    ScoreboardService,
    SessionCannonService,
    SessionService,
    SignatureService,
    SpeakerService,
    SponsorService,
    StorageService,
    SurveyService,
    TeamService,
    TicketService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
