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
import { SpeakerComponent } from './speakers/speaker/speaker.component'
import { SponsorsComponent } from './sponsors/sponsors.component'
import { SponsorService } from './sponsors/sponsor.service'
import { TeamComponent } from './team/team.component'
import { TeamService } from './team/team.service'
import { LoadingComponent } from './partials/loading/loading.component'
import { UserComponent } from './user/user.component'
import { UserService } from './user/user.service'
import { ScheduleComponent } from './landing-page/schedule/schedule.component'
import { LoginComponent } from './auth/login/login.component'
import { LinkedInLoginComponent } from './auth/login/linkedin.component'
import { AuthService } from './auth/auth.service'
import { StorageService } from './storage.service'
import { AuthGuard } from './auth/auth.guard'
import { SessionComponent } from './session/session.component'
import { FeedbackComponent } from './landing-page/feedback/feedback.component'
import { MessageService } from './message.service'
import { JwtService } from './auth/jwt.service'
import { SidebarComponent } from './partials/sidebar/sidebar.component'
import { AchievementsComponent } from './achievements/achievements.component'
import { AchievementComponent } from './achievements/achievement/achievement.component'
import { AchievementService } from './achievements/achievement.service'
import { SessionService } from './session/session.service'
import { ScoreboardComponent } from './scoreboard/scoreboard.component'
import { ScoreboardService } from './scoreboard/scoreboard.service'
import { QrcodeScannerComponent } from './partials/qr-code-scanner/qr-code-scanner.component'
import { QRCodeModule } from 'angularx-qrcode'
import { ZXingScannerModule } from '@zxing/ngx-scanner' // scan qrcode
import { PromoteComponent } from './user/promote/promote.component'
import { CompanyService } from './company/company.service'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { LinkComponent } from './user/link/link.component'
import { MyLinksComponent } from './user/link/my-links/my-links.component'
import { MyProfileComponent } from './user/my-profile/my-profile.component'
import { SignatureComponent } from './user/signature/signature.component'
import { CompanyCannonService } from './company/company-cannon.service'
import { CardComponent } from './user/card/card.component'
import { WorkshopsComponent } from './session/workshops/workshops.component'
import { WorkshopComponent } from './session/workshops/workshop/workshop.component'
import { TicketService } from './session/workshops/ticket.service'
import { WorkshopRegisterButtonComponent } from './session/workshops/workshop/register-button.component'
import { IsTeamGuard } from './auth/is-team.guard'
import { WorkshopsStatusComponent } from './session/workshops/workshops-status.component'
import { WorkshopStatusElementComponent } from './session/workshops/workshop-status-element.component'
import { SurveyComponent } from './user/survey/survey.component'
import { SurveyService } from './user/survey/survey.service'
import { SignatureService } from './user/signature/signature.service'
import { CheckinComponent } from './user/checkin/checkin.component'
import { SessionCannonService } from './session/session-cannon.service'
import { ValidateCardComponent } from './user/validate-card/validate-card.component'
import { EndpointService } from './endpoints/endpoint.service'
import { DownloadsComponent } from './user/downloads/downloads.component'
import { ManageDownloadsComponent } from './user/downloads/manage-downloads/manage-downloads.component'
import { DownloadsStatusComponent } from './user/downloads/downloads-status/downloads-status.component'
import { EventService } from './events/event.service'
import { EventComponent } from './events/event/event.component'
import { CvComponent } from './user/cv/cv.component'
import { PickWinnerComponent } from './pick-winner/pick-winner.component'
import { RedeemComponent } from './user/redeem/redeem.component'
import { RedeemService } from './user/redeem/redeem.service';
import { PartnersComponent } from './partners/partners.component'

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
    LinkedInLoginComponent,
    MyProfileComponent,
    UserComponent,
    SessionComponent,
    FeedbackComponent,
    PromoteComponent,
    SidebarComponent,
    LinkComponent,
    MyLinksComponent,
    AchievementsComponent,
    AchievementComponent,
    SignatureComponent,
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
    EventComponent,
    CvComponent,
    RedeemComponent,
    PartnersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    QRCodeModule,
    ZXingScannerModule,
    FormsModule,
    NgbModule.forRoot()
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
    RedeemService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
