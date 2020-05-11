import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Admin } from '../admin.model';
import { AdminsService } from '../admins.service';

import { AuthService } from "../../sharedServices/auth.service"

import io from 'node_modules/socket.io-client';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})

export class LoginAdminComponent implements OnInit {

  username: string;
  password: string;

  admins: Admin[] = [];

  isInvalid = false;
  socket = io('http://localhost:3000');

  ngOnInit() {

  }

  constructor(private router: Router, private adminsService: AdminsService, private authService: AuthService) {
    //לאתחל את localstrong
    this.authService.logout();
    //when I am already login 
    if (authService.authenticated == true) {
      this.router.navigate(["advertisements"]);
    }
  }

  login() {

    this.adminsService.listofAdmins().subscribe(userData => {
      this.admins = userData.admins;

      for (var i = 0; i < this.admins.length; i++) {
        if (this.username == this.admins[i].name && this.password == this.admins[i].password) {
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
