import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../services/authentication.service';
import { Router } from '@angular/router';

/**
 * A component to let new users register for an account
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../account.component.scss']
})
export class RegisterComponent implements OnInit {
  credentials: TokenPayload = {
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  };

  /**
  * Constructor that imports the appropriate services
  *
  * @param {Object} auth authentication service to handle user registration
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
   * Handle a register request
   */
  register() {
    this.auth.register(this.credentials).subscribe(() => {
      this.auth.login(this.credentials).subscribe(() => {
        this.router.navigateByUrl('/article/list');
      });
    }, (err) => {
      console.error(err);
    });
  }
}