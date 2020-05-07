import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { AdminsService } from "../admins.service";

@Component({
  selector: 'app-admin-create',
  templateUrl: './admin-create.component.html',
  styleUrls: ['./admin-create.component.css']
})
export class AdminCreateComponent implements OnInit {

  form: FormGroup;

  constructor(
    public adminsService: AdminsService,
    public route: ActivatedRoute) { }

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
    this.adminsService.addAdmin(
      this.form.value.name,
      this.form.value.password
    );
    this.form.reset();
  }

}
