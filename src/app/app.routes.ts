import { RouterModule, Routes } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'
import { LandingPageComponent } from './landing-page/landing-page.component'
import {
  PrivacyPolicyComponent,
  CodeOfConductComponent,
  PageNotFoundComponent,
  LiveComponent
} from './static/static.component'
import { SpeakerComponent } from './speakers/speaker/speaker.component'
import { SponsorsComponent } from './landing-page/sponsors/sponsors.component'
import { LoginComponent } from './auth/login/login.component'
import { LinkedinLoginComponent } from './auth/login/linkedin.component'
import { AuthGuard } from './auth/auth.guard'
import { IsTeamGuard } from './auth/is-team.guard'
import { UserComponent } from './user/user.component'
import { LinkComponent } from './user/link/link.component'
import { PromoteComponent } from './user/promote/promote.component'
import { AchievementsComponent } from './user/achievements/achievements.component'
import { AchievementComponent } from './user/achievements/achievement/achievement.component'
import { SessionComponent } from './session/session.component'
import { MyLinksComponent } from './user/link/my-links/my-links.component'
import { MyProfileComponent } from './user/my-profile/my-profile.component'
import { SignatureComponent } from './user/signature/signature.component'
import { CardComponent } from './user/card/card.component'
import { WorkshopsComponent } from './user/workshops/workshops.component'
import { WorkshopsStatusComponent } from './user/workshops/workshops-status.component'
import { ScoreboardComponent } from './user/scoreboard/scoreboard.component'
import { CheckinComponent } from './user/checkin/checkin.component'
import { SelfcheckinComponent } from './user/selfcheckin/selfcheckin.component'
import { ValidateCardComponent } from './user/validate-card/validate-card.component'
import { DownloadsComponent } from './user/downloads/downloads.component'
import { ManageDownloadsComponent } from './user/downloads/manage-downloads/manage-downloads.component'
import { DownloadsStatusComponent } from './user/downloads/downloads-status/downloads-status.component'
import { PickWinnerComponent } from './user/pick-winner/pick-winner.component'
import { EventComponent } from './events/event/event.component'
import { CvComponent } from './user/cv/cv.component'
import { RedeemComponent } from './user/redeem/redeem.component'
import { PromocodesComponent } from './user/promocodes/promocodes.component'
import { SessionsComponent } from './user/sessions/sessions.component'

const routes: Routes = [
  { path: '', component: LoginComponent },

  { path: 'live', component: LiveComponent },

  { path: 'login', component: LoginComponent },
  { path: 'login/linkedin', component: LinkedinLoginComponent },

  { path: 'speakers/:id', component: SpeakerComponent },
  { path: 'sessions/:id', component: SessionComponent },

  { path: 'sponsors', component: SponsorsComponent },

  /* user homepage */
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: '', redirectTo: '/user/qrcode', pathMatch: 'full' },

      { path: 'qrcode', component: MyProfileComponent, canActivate: [AuthGuard] },
      { path: 'cv', component: CvComponent, canActivate: [AuthGuard] },

      { path: 'workshops', component: WorkshopsComponent, canActivate: [AuthGuard] },
      { path: 'downloads/download', component: DownloadsComponent, canActivate: [AuthGuard] },
      { path: 'achievements', component: AchievementsComponent, canActivate: [AuthGuard] },
      { path: 'achievement/:id', component: AchievementComponent, canActivate: [AuthGuard] },
      { path: 'signature', component: SignatureComponent, canActivate: [AuthGuard] },
      { path: 'promocodes', component: PromocodesComponent, canActivate: [AuthGuard] },
      { path: 'redeem', component: RedeemComponent, canActivate: [AuthGuard] },
      { path: 'scoreboard', component: ScoreboardComponent, canActivate: [AuthGuard] },
      { path: 'card', component: CardComponent, canActivate: [AuthGuard] },

      { path: 'links/link', component: LinkComponent, canActivate: [AuthGuard] },
      { path: 'links/my-links', component: MyLinksComponent, canActivate: [AuthGuard] },

      { path: 'checkin', component: CheckinComponent, canActivate: [IsTeamGuard] },
      { path: 'selfcheckin', component: SelfcheckinComponent, canActivate: [AuthGuard] },
      { path: 'pick-winner', component: PickWinnerComponent, canActivate: [IsTeamGuard] },
      { path: 'downloads/manage', component: ManageDownloadsComponent, canActivate: [IsTeamGuard] },
      { path: 'downloads/status', component: DownloadsStatusComponent, canActivate: [IsTeamGuard] },
      { path: 'workshops/workshops-status', component: WorkshopsStatusComponent, canActivate: [IsTeamGuard] },
      { path: 'validate-card', component: ValidateCardComponent, canActivate: [IsTeamGuard] },
      { path: 'promote', component: PromoteComponent, canActivate: [IsTeamGuard] },
      { path: 'sessions', component: SessionsComponent, canActivate: [IsTeamGuard] }
    ]
  },

  { path: 'coc', component: CodeOfConductComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'event/:id', component: EventComponent },
  { path: '**', component: PageNotFoundComponent }
]

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes)
