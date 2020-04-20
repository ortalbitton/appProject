import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { UsersService } from "../users.service";

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  form: FormGroup;

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
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    this.usersService.addUser(
      this.form.value.name,
      this.form.value.password
    );
    this.form.reset();
  }

}
