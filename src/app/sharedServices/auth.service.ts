import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;

  constructor() { }

  logout() {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('username');
    this.isAuthenticated = false;
  }

  authLogin(name: string) {
    this.isAuthenticated = true;
    localStorage.setItem('isLoggedIn', "true");
    localStorage.setItem('username', name);
  }

  public get authenticated(): boolean {
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    var isAuth = isLoggedIn.indexOf('true') !== -1;
    return isAuth;
  }

  getUsername() {
    return localStorage.getItem('username');
  }

} 