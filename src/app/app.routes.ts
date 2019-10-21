import { RouterModule, Routes } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import { LandingPageComponent } from './landing-page/landing-page.component'
import {
  PrivacyPolicyComponent,
  CodeOfConductComponent,
  PageNotFoundComponent,
  LiveComponent
} from './static/static.component'
import { AchievementComponent } from './achievements/achievement/achievement.component'
import { AchievementsComponent } from './achievements/achievements.component'
import { AuthGuard } from './auth/auth.guard'
import { CardComponent } from './user/card/card.component'
import { CheckinComponent } from './user/checkin/checkin.component'
import { CvComponent } from './user/cv/cv.component'
import { DownloadsComponent } from './user/downloads/downloads.component'
import { DownloadsStatusComponent } from './user/downloads/downloads-status/downloads-status.component'
import { EventComponent } from './events/event/event.component'
import { LinkComponent } from './user/link/link.component'
import { LinkedInLoginComponent } from './auth/login/linkedin.component'
import { LoginComponent } from './auth/login/login.component'
import { ManageDownloadsComponent } from './user/downloads/manage-downloads/manage-downloads.component'
import { MyLinksComponent } from './user/link/my-links/my-links.component'
import { MyProfileComponent } from './user/my-profile/my-profile.component'
import { PickWinnerComponent } from './pick-winner/pick-winner.component'
import { PromoteComponent } from './user/promote/promote.component'
import { RedeemComponent } from './user/redeem/redeem.component'
import { ScoreboardComponent } from './scoreboard/scoreboard.component'
import { SessionComponent } from './session/session.component'
import { SignatureComponent } from './user/signature/signature.component'
import { SpeakerComponent } from './speakers/speaker/speaker.component'
import { SponsorComponent } from './sponsors/sponsor/sponsor.component'
import { SponsorsComponent } from './sponsors/sponsors.component'
import { SurveyComponent } from './user/survey/survey.component'
import { UserComponent } from './user/user.component'
import { ValidateCardComponent } from './user/validate-card/validate-card.component'
import { WorkshopsComponent } from './session/workshops/workshops.component'
import { WorkshopsStatusComponent } from './session/workshops/workshops-status.component'

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'achievement/:id', component: AchievementComponent },
  { path: 'achievements', component: AchievementsComponent },
  { path: 'card', component: CardComponent, canActivate: [AuthGuard] },
  { path: 'checkin', component: CheckinComponent, canActivate: [AuthGuard] },
  { path: 'coc', component: CodeOfConductComponent },
  { path: 'cv', component: CvComponent, canActivate: [AuthGuard] },
  { path: 'downloads/download', component: DownloadsComponent, canActivate: [AuthGuard] },
  { path: 'downloads/manage', component: ManageDownloadsComponent, canActivate: [AuthGuard] },
  { path: 'downloads/status', component: DownloadsStatusComponent, canActivate: [AuthGuard] },
  { path: 'event/:id', component: EventComponent },
  { path: 'links/link', component: LinkComponent, canActivate: [AuthGuard] },
  { path: 'links/my-links', component: MyLinksComponent, canActivate: [AuthGuard] },
  { path: 'live', component: LiveComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/linkedIn', component: LinkedInLoginComponent },
  { path: 'pick-winner', component: PickWinnerComponent, canActivate: [AuthGuard] },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'promote', component: PromoteComponent, canActivate: [AuthGuard] },
  { path: 'qrcode', component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: 'redeem', component: RedeemComponent },
  { path: 'scoreboard', component: ScoreboardComponent },
  { path: 'sessions/:id', component: SessionComponent },
  { path: 'signature', component: SignatureComponent, canActivate: [AuthGuard] },
  { path: 'speakers/:id', component: SpeakerComponent },
  { path: 'sponsors', component: SponsorsComponent },
  { path: 'sponsors/:id', component: SponsorComponent },
  { path: 'survey/:redeemCode', component: SurveyComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: UserComponent },
  { path: 'validate-card', component: ValidateCardComponent, canActivate: [AuthGuard] },
  { path: 'workshops', component: WorkshopsComponent },
  { path: 'workshops/workshops-status', component: WorkshopsStatusComponent },
  { path: '**', component: PageNotFoundComponent }
]

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes)
