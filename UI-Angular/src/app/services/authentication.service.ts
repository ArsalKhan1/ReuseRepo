import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment'
import { Token } from '@angular/compiler/src/ml_parser/lexer';

/**
 * A data structure for sending and returning user data predictably
 */
export interface UserData {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  permission: number;
}

/**
 * A data structure to hold JWTs from the API
 */
export interface AuthToken {
  accessToken: string;
  username: string;
}

/**
 * A data structure to contain data extracted from a user JWT
 */
export interface TokenPayload {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  permission?: number;
}

/**
 * A service to handle API requests assosciated with authenticating
 * users and getting data from local browser storage 
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // Properties
  private authToken: string;
  private username: string;

  /**
   * Constructor that imports the appropriate services
   * 
   * @param {Object} http Angular http client to make API requests
   */
  constructor(private http: HttpClient) { }

  // Public methods
  /**
   * Register a new user
   * 
   * @param {TokenPayload} user data for the new user to register
   * @return {Promise} an http request promise that will register the user and store their data
   */
  public register(user: TokenPayload): Observable<any> {
    user.permission = 1;
    let url = this.http.post(`${environment.apiURL}users/register`, user);

    const request = url.pipe(
      map((data: AuthToken) => {
        if(data.accessToken) {
          this.storeToken(data.accessToken);
          this.storeUsername(data.username);
        }
        return data;
      })
    );

    return request;
  }

  /**
   * Check credentials for a user trying to log in
   * 
   * @param {TokenPayload} user login credentials
   * @return {Promise} an http request promise that will attempt to verify the credentials
   */
  public login(user: TokenPayload): Observable<any> {
    let url = this.http.post(`${environment.apiURL}auth`, user);

    const request = url.pipe(
      map((data: AuthToken) => {
        if (data.accessToken) {
          this.storeToken(data.accessToken);
          this.storeUsername(data.username);
        }
        return data;
      })
    );

    return request;
  }

  /**
   * Get user data from the API
   * 
   * @return {Promise} an http request promise that will get data about the logged in user
   */
  public profile(): Observable<any> {
    let url = this.http.get(
      `${environment.apiURL}users/${this.getData().userId}`,
      {headers:{Authorization: `Bearer ${this.getToken()}`}});

    return url;
  }

  /**
   * Log a user out and delete locally stored tokens
   */
  public logout(): void {
    this.authToken = '';
    window.localStorage.removeItem('reuserepo-token');
    window.localStorage.removeItem('reuserepo-username');
  }

  /**
   * Extract data from the JWT
   * 
   * @return {Object|null} the extracted data or null if no user is logged in
   */
  public getData(): UserData {
    const token = this.getToken();
    var payload;

    if(token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    }
    else {
      return null;
    }
  }

  /**
   * Check if the user is logged in
   * 
   * @return {boolean} whether the user is logged in
   */
  public isLoggedIn(): boolean {
    let user = this.getData();
    return user ? true : false;
  }

  /**
   * Get the user's username
   * 
   * @return {string} the user's username
   */
  public getUsername(): string {
    if(!this.username) {
      this.username = localStorage.getItem('reuserepo-username');
    }
    return this.username;
  }

  // Private methods
  /**
   * Store a JWT in local storage
   * 
   * @param {string} token the JWT to store
   */
  private storeToken(token: string): void {
    localStorage.setItem('reuserepo-token', token);
    this.authToken = token;
  }

  /**
  * Store a username in local storage
  *
  * @param {string} username the username to store
  */
  private storeUsername(username: string): void {
    localStorage.setItem('reuserepo-username', username);
    this.username = username;
  }

  /**
  * Get a JWT from local storage
  *
  * @return {string} the stored JWT
  */
  public getToken(): string {
    if (!this.authToken) {
      this.authToken = localStorage.getItem('reuserepo-token');
    }
    return this.authToken;
  }
}
