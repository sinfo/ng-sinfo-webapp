import { Component } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private router: Router
  ) {

    /**
     * At time of writing this, there is no way to scroll to fragments, natively.
     * Issue: https://github.com/angular/angular/issues/6595
     */
    // this.router.events.subscribe(s => {
    //   if (s instanceof NavigationEnd) {
    //     const tree = this.router.parseUrl(this.router.url)
    //     if (tree.fragment) {
    //       const element = document.querySelector('#' + tree.fragment)
    //       if (element) { element.scrollIntoView(true) }
    //     } else {
    //       window.scrollTo(0, 0)
    //     }
    //   }
    // })
  }
}
