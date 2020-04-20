import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { User } from "../user.model";
import { UsersService } from "../users.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  users: User[] = [];
  totalUsers = 0;
  username: string;
  password: string;
  private notesSub: Subscription;
  isSearch = false;
  isEmpty = false;

  constructor(public usersService: UsersService, public router: Router) { }

  ngOnInit() {
    this.isSearch = true;
    this.usersService.getUsers();
    this.notesSub = this.usersService
      .getUserUpdateListener()
      .subscribe((noteData: { users: User[], userCount: number }) => {
        this.totalUsers = noteData.userCount;
        this.users = noteData.users;
      });

  }

  login(): void {
    for (var i = 0; i < this.users.length; i++) {
      if (this.username == this.users[i].name && this.password == this.users[i].password) {
        this.router.navigate(["/"]);
      } else {
        this.isSearch = false;
      }
    }
    if (this.username == "" || this.password == "")
      this.isEmpty = true;

  }

  onDelete(userId: string) {
    this.usersService.deleteUser(userId).subscribe(() => {
      this.usersService.getUsers();
    });
  }

  ngOnDestroy() {
    this.notesSub.unsubscribe();
  }

}
