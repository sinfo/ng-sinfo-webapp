import { RouterModule, Routes } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'

import { LandingPageComponent } from './landing-page/landing-page.component'
import {
  PrivacyPolicyComponent,
  CodeOfConductComponent,
  PageNotFoundComponent
} from './static/static.component'
import { SpeakerComponent } from './speakers/speaker/speaker.component'
import { SponsorsComponent } from './sponsors/sponsors.component'
import { QrcodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component'

import { LoginComponent } from './auth/login/login.component'
import { MyProfileComponent } from './user/my-profile/my-profile.component'
import { AuthGuard } from './auth/auth.guard'
import { UserComponent } from './user/user.component'
import { SessionsComponent } from './schedule/sessions/sessions.component'
import { PromoteComponent } from './user/promote/promote.component'

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'qrcode', component: QrcodeScannerComponent },
  { path: 'promote', component: PromoteComponent }
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent },
  { path: 'me', component: MyProfileComponent, canActivate: [ AuthGuard ] },
  { path: 'speakers/:id', component: SpeakerComponent },
  { path: 'sessions/:id', component: SessionsComponent },
  { path: 'sponsors', component: SponsorsComponent },
  { path: 'user/:id', component: UserComponent },
  { path: 'coc', component: CodeOfConductComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: '**', component: PageNotFoundComponent }
]

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes)
