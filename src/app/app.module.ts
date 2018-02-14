import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { SpeakersComponent } from './speakers/speakers.component'

import { SpeakerService } from './speakers/speaker.service'
import { SessionService } from './schedule/session.service'

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
import { ScheduleComponent } from './schedule/schedule.component';
import { LoadingComponent } from './loading/loading.component'

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
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing
  ],
  providers: [
    SpeakerService,
    MessageService,
    SponsorService,
    TeamService,
    SessionService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
