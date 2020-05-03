import { Component, OnInit } from "@angular/core";

import { AuthService } from "../sharedServices/auth.service"

import io from 'node_modules/socket.io-client';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    const socket = io('http://localhost:3000');
    socket.emit('logout');
    this.authService.logout();
  }

}