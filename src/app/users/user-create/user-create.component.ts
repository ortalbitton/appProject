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

  constructor(
    public usersService: UsersService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(9)]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(9)]
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
            password: userData.password
          };
          this.form.setValue({
            name: this.user.name,
            password: this.user.password
          });
        });
      } else {
        this.mode = "create";
        this.userId = null;
      }
    });
  }

  onSave() {

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === "create") {
      this.usersService.addUser(
        this.form.value.name,
        this.form.value.password,
      );
    } else {
      this.usersService.updateUser(
        this.userId,
        this.form.value.name,
        this.form.value.password
      );
    }
    this.form.reset();
  }

}
