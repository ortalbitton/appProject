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
  filterusers: User[] = [];
  totalUsers = 0;
  private notesSub: Subscription;

  Userinformation: User[] = [];
  isAdmin: boolean;
  username: string;
  admins: Admin[] = [];

  searchName: string;
  searchLatitude: number;
  searchLongitude: number;
  isSearch: boolean;


  constructor(public usersService: UsersService, public router: Router, private adminsService: AdminsService, private authService: AuthService) { }

  ngOnInit() {
    this.usersService.getUsers();
    this.username = this.authService.getUsername();
    this.notesSub = this.usersService
      .getUserUpdateListener()
      .subscribe((noteData: { users: User[], userCount: number }) => {
        this.totalUsers = noteData.userCount;
        this.users = noteData.users;
        this.filterusers = noteData.users;
      });

    this.adminsService.listofAdmins().subscribe(adminData => {
      this.admins = adminData.admins;
      //check if this.username.name is not Admin
      for (var i = 0; i < this.admins.length; i++) {
        if (this.username != this.admins[i].name) {
          this.Userinformation = this.users.filter(user =>
            user.name == this.username);
          this.isAdmin = false;
        }
      }

      //check if this.username.name is admin
      for (var i = 0; i < this.admins.length; i++) {
        if (this.username == this.admins[i].name) {
          this.users = this.users.filter(user =>
            user.name != this.username);
          this.isAdmin = true;
        }
      }

    });

  }


  onSearchBy3parameters(searchName: string, searchLatitude: number, searchLongitude: number) {
    this.users = this.filterusers.filter(user =>
      user.name.toLowerCase().indexOf(searchName.toLowerCase()) !== -1 && user.latitude == searchLatitude && user.longitude == searchLongitude);
    if (this.users.length == 0) this.isSearch = false;
  }

  OnClean() {
    this.searchName = "";
    this.searchLatitude = 0;
    this.searchLongitude = 0;
    this.usersService.getUsers();
    this.notesSub = this.usersService
      .getUserUpdateListener()
      .subscribe((noteData: { users: User[], userCount: number }) => {
        this.totalUsers = noteData.userCount;
        this.users = noteData.users.filter(user =>
          user.name != this.username);
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
