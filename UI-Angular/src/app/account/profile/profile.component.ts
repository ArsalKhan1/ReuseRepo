import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserData } from '../../services/authentication.service';

/**
 * A component to render basic user data.
 * Currently this is not used for anything.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  details: UserData;

  /**
  * Constructor that imports the appropriate services
  *
  * @param {Object} auth authentication service to check if the user is logged in
  */
  constructor(private auth: AuthenticationService) { }

  /**
   * Initialization function that gets user data to render
   */
  ngOnInit(): void {
    this.auth.profile().subscribe(user => {
      this.details = user;
    }, (err) => {
      console.error(err);
    });
  }
}