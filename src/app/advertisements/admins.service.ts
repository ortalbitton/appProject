import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { Admin } from "./admin.model";

@Injectable({ providedIn: "root" })
export class AdminsService {

  constructor(private http: HttpClient, private router: Router) { }


  listofAdmins() {
    return this.http
      .get<{ message: string; admins: any, maxAdmins: number }>(
        "http://localhost:3000/api/admins")
  }

  addAdmin(name: string) {
    const advertisementData = new FormData();
    advertisementData.append("name", name);
    this.http
      .post<{ message: string; admin: Admin; }>(
        "http://localhost:3000/api/admins",
        advertisementData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

}
