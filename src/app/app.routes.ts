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
import { LoginComponent } from './auth/login/login.component'
import { MyProfileComponent } from './user/my-profile/my-profile.component'
import { AuthGuard } from './auth/auth.guard'

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent },
  { path: 'me', component: MyProfileComponent, canActivate: [ AuthGuard ] },
  { path: 'speakers/:id', component: SpeakerComponent },
  { path: 'sponsors', component: SponsorsComponent },
  { path: 'coc', component: CodeOfConductComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: '**', component: PageNotFoundComponent }
]

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes)
