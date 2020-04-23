import { Component, OnInit } from "@angular/core";

import io from 'node_modules/socket.io-client';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  socket = io('http://localhost:3000');
  amountOfUserConnect: number;

  constructor() { }

  ngOnInit() {
    this.socket.emit('login');
    this.socket.on('numClients', (data) => {
      this.amountOfUserConnect = data.numClients;
    });
  }

  onChange() {
    this.socket = io('http://localhost:3000');
    this.socket.emit('update', this.amountOfUserConnect);
  }

}
