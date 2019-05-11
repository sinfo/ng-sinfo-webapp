import { Component } from '@angular/core'
import { Meta } from '@angular/platform-browser'
import { EventService } from './events/event.service'

import { Router, NavigationEnd } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor (
    private router: Router,
    private meta: Meta,
    private eventService: EventService
  ) {

    const DESCRIPTION = 'SINFO is a non-profit, college student, organization responsible \
    for organizing one of the biggest Tech conferences in Portugal.'
    const IMAGE = 'https://sinfo.org/assets/img/savethedate26.png'

    // meta data tags
    eventService.getCurrent().subscribe(event => {
      // Common tags
      this.meta.addTags([
        { name: 'description', content: DESCRIPTION },
        { name: 'author', content: 'The SINFO Organization' },
        { name: 'image', content: IMAGE }
      ])

      // Twitter
      this.meta.addTags([
        { name: 'twitter:site', content: '@sinfoist' },
        { name: 'twitter:title', content: event.name },
        { name: 'twitter:description', content: DESCRIPTION },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:image:src', content: IMAGE }
      ])

      // Schema.org for Google
      this.meta.addTags([
        { itemprop: 'name', content: event.name },
        { itemprop: 'description', content: DESCRIPTION },
        { itemprop: 'image', content: IMAGE }
      ])

      // Open Graph general (Facebook, Pinterest & Google+)
      this.meta.addTags([
        { name: 'og:site_name', content: event.name },
        { name: 'og:title', content: event.name },
        { name: 'og:description', content: DESCRIPTION },
        { name: 'og:image', content: IMAGE },
        { name: 'og:url', content: 'https://sinfo.org' },
        { name: 'og:locale', content: 'en_US' },
        { name: 'og:admins', content: '134758406571284' },
        { name: 'og:type', content: 'website' }
      ])
    })

    /**
     * At time of writing this, there is no way to scroll to fragments, natively.
     * Issue: https://github.com/angular/angular/issues/6595
     */
    this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = this.router.parseUrl(this.router.url)
        if (tree.fragment) {
          const element = document.querySelector('#' + tree.fragment)
          if (element) { element.scrollIntoView(true) }
        } else {
          window.scrollTo(0, 0)
        }
      }
    })
  }
}
