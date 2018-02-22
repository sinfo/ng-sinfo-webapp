import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  selectedAboutText: string
  displayAboutDropdown: boolean

  ngOnInit () {
    this.selectedAboutText = 'About Us'
    this.showOrHideDropdown()
  }

  /* Beggining of Dropdown tabs actions */
  showOrHideDropdown(): void {
    this.displayAboutDropdown = window.innerWidth > 768 ? true : false
  }

  toggleDropdown(): void {
    this.displayAboutDropdown = !this.displayAboutDropdown
  }

  updatedSelectedText(text: string): void {
    this.selectedAboutText = text
  }
  /* End of Dropdown tabs actions */
}
