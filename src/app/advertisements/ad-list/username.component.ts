import { Component, OnInit } from '@angular/core';

import { UsersService } from "../../users/users.service";

@Component({
  selector: 'app-username',
  template: `
  <div>
     <h1>hello: {{username.name}}</h1>
  </div>
  `,
  styles: [
    `div {
      position: absolute;
    }`
  ]
})
export class UsernameComponent implements OnInit {

  username;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.username = this.usersService.getUsername();
  }

}
