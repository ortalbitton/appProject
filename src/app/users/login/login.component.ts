import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

import io from 'node_modules/socket.io-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  username: string;
  password: string;


  isInvalid = false;
  socket = io('http://localhost:3000');

  ngOnInit() {

  }

  constructor(private router: Router, private usersService: UsersService) { }

  login(): void {
    this.usersService.list().subscribe(data => {
      for (var i = 0; i < data.maxUsers; i++) {
        if (this.username == data.users[i].name && this.password == data.users[i].password) {
          this.usersService.setUsername('name', data.users[i].name);
          this.socket.emit('login', this.username);
          this.router.navigate(["advertisements"]);
        } else {
          this.isInvalid = true;
        }
      }
    });
  }
}