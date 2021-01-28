import { Component, OnInit, HostListener } from '@angular/core';

/**
 * The navbar component that gets rendered on the top of every page
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

  constructor() {}

  /**
  * Listens for a click event
  */
  @HostListener('click', ['$event']) onClick() {
      document
      .querySelector('#mobile-menu')
        .classList.toggle('is-active');
      document
      .querySelector('.navbar__menu')
        .classList.toggle('active')
  }
}
