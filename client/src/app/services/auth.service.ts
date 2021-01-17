import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
//import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
//import { tokenNotExpired } from 'angular2-jwt';
import { JwtHelperService } from "@auth0/angular-jwt";

import { Observable, throwError } from 'rxjs';
import { map, tap, catchError, retry } from 'rxjs/operators';

@Injectable()
export class AuthService {

  domain = environment.apiUrl;
  authToken;
  user;
  options;
  helper = new JwtHelperService();

  constructor(
    private http: HttpClient
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    if (this.authToken) {
      this.options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'authorization': this.authToken
        })
      };
    } else {
      this.options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
    }
  }

  // Function to get token from client local storage
  loadToken() {
    this.authToken = localStorage.getItem('token');; // Get token and asssign to variable to be used elsewhere
  }

  registerUser(user) {
    return this.http.post(this.domain + 'authentication/register', user);
  }

  checkUsername(username) {
    return this.http.get(this.domain + 'authentication/checkUsername/' + username);
  }

  checkEmail(email) {
    return this.http.get(this.domain + 'authentication/checkEmail/' + email);
  }

  // Function to login user
  login(user) {
    return this.http.post(this.domain + 'authentication/login', user);
  }

  // Function to logout
  logout() {
    this.createAuthenticationHeaders();
    this.http.get(this.domain + 'authentication/logout', this.options).subscribe();
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  // Function to store user's data in client local storage
  storeUserData(token, user) {
    localStorage.setItem('token', token); // Set token in local storage
    localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
    this.authToken = token; // Assign token to be used elsewhere
    this.user = user; // Set user to be used elsewhere
  }

  // Function to get user's profile data
  getProfile() {
    this.createAuthenticationHeaders(); // Create headers before sending to API
    return this.http.get(this.domain + 'profile/profile', this.options);
  }

  getPublicProfile(username) {
    return this.http.get(this.domain + 'profile/publicProfile/' + username, this.options);
  }

  getLoginStatus() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'profile/loginstatus', this.options);
  }

  // Function to check if user is logged in
  loggedIn() {
    return !this.helper.isTokenExpired(this.authToken);
  }

}
