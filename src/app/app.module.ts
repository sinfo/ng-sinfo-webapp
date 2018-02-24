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
  PageNotFoundComponent
} from './static/static.component'
import { SpeakerComponent } from './speakers/speaker/speaker.component'
import { SponsorsComponent } from './sponsors/sponsors.component'
import { SponsorService } from './sponsors/sponsor.service'
import { TeamComponent } from './team/team.component'
import { Member } from './team/member.model'
import { TeamService } from './team/team.service'
import { LoadingComponent } from './partials/loading/loading.component'
import { UserComponent } from './user/user.component'
import { UserService } from './user/user.service'
import { ScheduleComponent } from './landing-page/schedule/schedule.component'
import { LoginComponent } from './auth/login/login.component'
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

import { QrcodeScannerComponent } from './partials/qr-code-scanner/qr-code-scanner.component'
import { NgxQRCodeModule } from 'ngx-qrcode3' // generate qrcode
import { NgxZxingModule } from '@zxing/ngx-scanner' // scan qrcode

import { PromoteComponent } from './user/promote/promote.component'

import { CompanyService } from './company/company.service'

import { NgModel } from '@angular/forms/src/directives/ng_model'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { LinkComponent } from './user/link/link.component'

import { MyLinksComponent } from './user/link/my-links/my-links.component'
import { MyProfileComponent } from './user/my-profile/my-profile.component'
import { SignatureComponent } from './user/signature/signature.component'
import { CompanyCannonService } from './company/company-cannon.service';
import { CardComponent } from './user/card/card.component'

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
    CardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    NgxQRCodeModule,
    NgxZxingModule.forRoot(),
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [
    SpeakerService,
    MessageService,
    SponsorService,
    TeamService,
    SessionService,
    AuthService,
    AuthGuard,
    StorageService,
    UserService,
    SessionService,
    CompanyService,
    CompanyCannonService,
    JwtService,
    AchievementService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
