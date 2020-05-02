import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user.model';
import { UsersService } from '../users.service';

import { AuthService } from "../../sharedServices/auth.service"

import io from 'node_modules/socket.io-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  username: string;
  password: string;

  users: User[] = [];

  isInvalid = false;
  socket = io('http://localhost:3000');

  ngOnInit() {

  }

  constructor(private router: Router, private usersService: UsersService, private authService: AuthService) {
    //לאתחל את localstrong
    this.authService.logout();
    //when I am already login 
    if (authService.authenticated == true) {
      this.username = this.authService.getUsername();
      this.socket.emit('login', this.username);
      this.router.navigate(["advertisements"]);
    }
  }

  login() {

    this.usersService.list().subscribe(userData => {
      this.users = userData.users;

      for (var i = 0; i < this.users.length; i++) {
        if (this.username == this.users[i].name && this.password == this.users[i].password) {
          this.authService.authLogin(this.username);
          this.socket.emit('login', this.username);
          this.router.navigate(["advertisements"]);
        } else {
          this.isInvalid = true;
        }

      }
    });


  }
}
