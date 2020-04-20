import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { map, count } from "rxjs/operators";
import { Subject } from "rxjs";

import { User } from "./user.model";


@Injectable({ providedIn: "root" })
export class UsersService {

  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[]; userCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }


  getUsers() {
    this.http
      .get<{ message: string; users: any, maxUsers: number }>(
        "http://localhost:3000/api/users"
      )
      .pipe(
        map(noteData => {
          return {
            users: noteData.users.map(note => {
              return {
                name: note.name,
                password: note.password,
                id: note._id
              };
            }),
            maxUsers: noteData.maxUsers
          };
        })
      )
      .subscribe(transformedNoteData => {
        this.users = transformedNoteData.users;
        this.usersUpdated.next({
          users: [...this.users],
          userCount: transformedNoteData.maxUsers
        });
      });
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  addUser(name: string, password: string) {
    const noteData = new FormData();
    noteData.append("name", name);
    noteData.append("password", password);
    this.http
      .post<{ message: string; user: User }>(
        "http://localhost:3000/api/users",
        noteData
      )
      .subscribe(responseData => {
        this.router.navigate(["login"]);
      });
  }

  deleteUser(userId: string) {
    return this.http
      .delete("http://localhost:3000/api/users/" + userId);
  }

}
