import { Component, OnInit } from '@angular/core';

import { AuthService } from "../../sharedServices/auth.service"

@Component({
  selector: 'app-username',
  template: `
  <div>
     <h1>hello: {{username}}</h1>
  </div>
  `,
  styles: [
    `div {
      position: absolute;
    }`
  ]
})
export class UsernameComponent implements OnInit {

  username: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.username = this.authService.getUsername();
  }

}
