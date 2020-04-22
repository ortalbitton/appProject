import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { User } from "../user.model";
import { UsersService } from "../users.service";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  totalUsers = 0;
  private notesSub: Subscription;

  constructor(public usersService: UsersService, public router: Router) { }

  ngOnInit() {
    this.usersService.getUsers();
    this.notesSub = this.usersService
      .getUserUpdateListener()
      .subscribe((noteData: { users: User[], userCount: number }) => {
        this.totalUsers = noteData.userCount;
        this.users = noteData.users;
      });

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
