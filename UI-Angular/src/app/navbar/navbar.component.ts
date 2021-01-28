import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor() {}

  // listens for a click
  @HostListener('click', ['$event']) onClick() {
      document
      .querySelector('#mobile-menu')
        .classList.toggle('is-active');
      document
      .querySelector('.navbar__menu')
        .classList.toggle('active')
  }

  ngOnInit(): void {}
}
