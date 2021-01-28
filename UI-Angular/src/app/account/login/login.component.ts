import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../services/authentication.service';
import { Router } from '@angular/router';

/**
 * A component to let the user login
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../account.component.scss']
})
export class LoginComponent implements OnInit {
  credentials: TokenPayload = {
    email: '',
    password: '',
  };

  /**
  * Constructor that imports the appropriate services
  *
  * @param {Object} auth authentication service to handle user sign in
  * @param {Object} router Angular router service to navigate the app
  */
  constructor(private auth: AuthenticationService, private router: Router) { }

  /**
   * Initialization function that checks if the user is already logged in and redirects
   */
  ngOnInit() {
    this.auth.profile().subscribe(() => {
      this.router.navigateByUrl('/article/list');
    }, (err) => {
    });
  }

  /**
   * Handle a login request
   */
  login() {
    this.auth.login(this.credentials).subscribe((data) => {
      this.router.navigateByUrl('/article/list');
    }, (err) => {
      console.error(err);
    });
  }
}