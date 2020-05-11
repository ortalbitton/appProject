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

  addAdmin(name: string, password: string) {
    const adminData = new FormData();
    adminData.append("name", name);
    adminData.append("password", password);
    this.http
      .post<{ message: string; admin: Admin; }>(
        "http://localhost:3000/api/admins",
        adminData
      )
      .subscribe(responseData => {
        this.router.navigate(["loginAdmin"]);
      });
  }

}
