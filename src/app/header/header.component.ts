import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';

//import { UsersService } from "../users/users.service";

import io from 'node_modules/socket.io-client';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  //username;

  constructor(private router: Router) { }

  ngOnInit() {
    //this.username = this.usersService.getUsername();
  }

  onlogout() {
    //this.username = "";
    const socket = io('http://localhost:3000');
    socket.emit('logout');
    this.router.navigate(["login"]);
  }

}
