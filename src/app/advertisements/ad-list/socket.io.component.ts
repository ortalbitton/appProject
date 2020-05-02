import { Component, OnInit } from '@angular/core';

import io from 'node_modules/socket.io-client';

@Component({
  selector: 'app-socket',
  template: `
    <mat-form-field>
      <mat-label>amountOfUserConnect:</mat-label>
      <input matInput [(ngModel)]="amountOfUserConnect">
    </mat-form-field>
    <button mat-raised-button color="accent" (click)="onChange()">Update of amountOfUserConnect</button>
  `,
  styles: [
    `mat-form-field {
      margin-top: 5%;
      padding-left: 40px;
      position: absolute;
    }
    
    button{
      position: absolute;
      margin-top: 8%;
    }`
  ]
})
export class SocketIoComponent implements OnInit {

  socket = io('http://localhost:3000');
  amountOfUserConnect: number;

  constructor() { }

  ngOnInit() {
    this.socket.on('numClients', (data) => {
      this.amountOfUserConnect = data.numClients;
    });
  }

  onChange() {
    this.socket = io('http://localhost:3000');
    this.socket.emit('update', this.amountOfUserConnect);
  }


}
