import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

/**
 * A component that logs a user out and redirects immediately
 */
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  /**
  * Constructor that imports the appropriate services
  *
  * @param {Object} auth authentication service to log the user out
  * @param {Object} router Angular router service to navigate the app
  */
  constructor(private auth: AuthenticationService, private router: Router) { }

  /**
  * Initialization function that logs the user out and redirects to home
  */
  ngOnInit(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
