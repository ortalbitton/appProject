import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { User } from "../user.model";
import { UsersService } from "../users.service";

import { Admin } from "../../advertisements/admin.model"
import { AdminsService } from "../../advertisements/admins.service"

import { AuthService } from "../../sharedServices/auth.service"

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  totalUsers = 0;
  private notesSub: Subscription;

  Userinformation: User[] = [];
  isSearch: boolean;
  username: string;

  admins: Admin[] = [];

  constructor(public usersService: UsersService, public router: Router, private adminsService: AdminsService, private authService: AuthService) { }

  ngOnInit() {
    this.usersService.getUsers();
    this.username = this.authService.getUsername();
    this.notesSub = this.usersService
      .getUserUpdateListener()
      .subscribe((noteData: { users: User[], userCount: number }) => {
        this.totalUsers = noteData.userCount;
        this.users = noteData.users;
      });

    this.adminsService.listofAdmins().subscribe(adminData => {
      this.admins = adminData.admins;
      //check if this.username.name is not Admin
      for (var i = 0; i < this.admins.length; i++) {
        if (this.username != this.admins[i].name) {
          this.Userinformation = this.users.filter(user =>
            user.name == this.username);
          this.isSearch = true;
        }
      }

      //check if this.username.name is admin
      for (var i = 0; i < this.admins.length; i++) {
        if (this.username == this.admins[i].name) {
          this.users = this.users.filter(user =>
            user.name != this.username);
          this.isSearch = false;
        }
      }

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
