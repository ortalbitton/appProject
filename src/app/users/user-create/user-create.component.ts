import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { User } from "../user.model";
import { UsersService } from "../users.service";

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  user: User;
  form: FormGroup;
  isLoading = false;
  private mode = "create";
  private userId: string;
  users: User[] = [];
  flag: boolean = false;
  isName: boolean;

  constructor(
    public usersService: UsersService,
    public route: ActivatedRoute) { }

  ngOnInit() {
    this.isName = false;
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(9)]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(9)]
      }),
      latitude: new FormControl(null, {
        validators: [Validators.required]
      }),
      longitude: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("userId")) {
        this.mode = "edit";
        this.userId = paramMap.get("userId");
        this.isLoading = true;
        this.usersService.getUser(this.userId).subscribe(userData => {
          this.isLoading = false;
          this.user = {
            id: userData._id,
            name: userData.name,
            password: userData.password,
            latitude: userData.latitude,
            longitude: userData.longitude
          };
          this.form.setValue({
            name: this.user.name,
            password: this.user.password,
            latitude: this.user.latitude,
            longitude: this.user.longitude
          });
        });
      } else {
        this.mode = "create";
        this.userId = null;
      }
    });

    this.usersService.list().subscribe(userData => {
      this.users = userData.users;
    });

  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    for (var i = 0; i < this.users.length; i++) {
      if (this.form.value.name == this.users[i].name) {
        this.flag = true;
        this.isName = true;
      }
    }

    if (this.mode === "create") {
      if (this.flag == false) {
        this.usersService.addUser(
          this.form.value.name,
          this.form.value.password,
          this.form.value.latitude,
          this.form.value.longitude
        );
      }
    } else {
      this.usersService.updateUser(
        this.userId,
        this.form.value.name,
        this.form.value.password,
        this.form.value.latitude,
        this.form.value.longitude
      );
    }
    this.form.reset();
    this.flag = false;
  }

}
