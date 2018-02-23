import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { SpeakersComponent } from './speakers/speakers.component'

import { SpeakerService } from './speakers/speaker.service'
import { SessionService } from './session/session.service'

import { HttpClientModule } from '@angular/common/http'
import { LandingPageComponent } from './landing-page/landing-page.component'
import { MenuComponent } from './partials/menu/menu.component'
import { FooterComponent } from './partials/footer/footer.component'
import { Routing } from './app.routes'
import {
  PrivacyPolicyComponent,
  CodeOfConductComponent,
  PageNotFoundComponent
} from './static/static.component'
import { MessagesComponent } from './partials/messages/messages.component'
import { MessageService } from './partials/messages/message.service'
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
import { MyProfileComponent } from './my-profile/my-profile.component'
import { AuthGuard } from './auth/auth.guard'
import { SessionComponent } from './session/session.component'
import { FeedbackComponent } from './landing-page/feedback/feedback.component'

import { QrcodeScannerComponent } from './partials/qr-code-scanner/qr-code-scanner.component'
import { NgxQRCodeModule } from 'ngx-qrcode3' // generate qrcode
import { NgxZxingModule } from '@zxing/ngx-scanner'
import { SidebarComponent } from './partials/sidebar/sidebar.component'

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
    MessagesComponent,
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
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    NgxQRCodeModule,
    NgxZxingModule.forRoot()
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
    SessionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
