import { Component, OnInit } from "@angular/core";

const io = require('socket.io-client');
// or with import syntax
import io from 'node_modules/socket.io-client';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  socket = io('http://localhost:3000');
  amountOfUserConnect: string;

  constructor() { }

  ngOnInit() {
    this.socket.on('numClients', (numClients) => {
      this.amountOfUserConnect = numClients;
    });

  }

}
