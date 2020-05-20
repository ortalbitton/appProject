import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../sharedServices/auth.service'

import io from 'node_modules/socket.io-client';

@Component({
  selector: 'app-socket',
  template: `
    <mat-form-field>
      <mat-label>amountOfUserConnect:</mat-label>
      <input matInput [(ngModel)]="amountOfUserConnect">
    </mat-form-field>
    <button mat-raised-button  (click)="onChange()">Update of amountOfUserConnect</button>
  `,
  styles: [
    `mat-form-field {
       margin-top: 5%;
      // margin-right: 10%;
      //  padding-left: 40px;
      // margin: 2em auto;
      position: absolute;
    }
    button{
      background-color: #d7b58c;
      // margin-left: auto;
      // margin: 2em auto;
    }`
  ]
})
export class SocketIoComponent implements OnInit {

  socket = io('http://localhost:3000');
  amountOfUserConnect: number;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    //when I am already login 
    if (this.authService.authenticated == true) {
      this.socket.on('numClients', (data) => {
        this.amountOfUserConnect = data.numClients;
      });
    }
  }

  onChange() {
    this.socket = io('http://localhost:3000');
    this.socket.emit('update', this.amountOfUserConnect);
  }


}
