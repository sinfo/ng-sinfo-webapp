import { RouterModule, Routes } from '@angular/router'
import { ModuleWithProviders } from '@angular/core'

import { LandingPageComponent } from './landing-page/landing-page.component'
import {
  PrivacyPolicyComponent,
  CodeOfConductComponent,
  PageNotFoundComponent
} from './static/static.component'
import { SpeakerComponent } from './speakers/speaker/speaker.component'

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'speakers/:id', component: SpeakerComponent },
  { path: 'coc', component: CodeOfConductComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: '**', component: PageNotFoundComponent }
]

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes)
