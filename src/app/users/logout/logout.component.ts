import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import io from 'node_modules/socket.io-client';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  socket = io('http://localhost:3000');

  constructor(private router: Router) { }

  ngOnInit() {
    this.socket.emit('logout');
    this.router.navigate(["login"]);
  }


}
