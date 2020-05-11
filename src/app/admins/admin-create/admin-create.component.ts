import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { Admin } from "../admin.model";
import { AdminsService } from "../admins.service";

@Component({
  selector: 'app-admin-create',
  templateUrl: './admin-create.component.html',
  styleUrls: ['./admin-create.component.css']
})
export class AdminCreateComponent implements OnInit {

  form: FormGroup;
  admins: Admin[] = [];
  flag: boolean = false;
  isCode: boolean;
  isName: boolean;

  constructor(
    public adminsService: AdminsService,
    public route: ActivatedRoute) { }

  ngOnInit() {
    this.isCode = true;
    this.isName = false;
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      adminCode: new FormControl()
    });

    this.adminsService.listofAdmins().subscribe(adminData => {
      this.admins = adminData.admins;
    });

  }

  onSave() {

    if (this.form.invalid) {
      return;
    }

    if (this.form.value.adminCode == "happylife") {
      this.isCode = true;

      for (var i = 0; i < this.admins.length; i++) {
        if (this.form.value.name == this.admins[i].name) {
          this.flag = true;
          this.isName = true;
        }
      }

      if (this.flag == false) {
        this.adminsService.addAdmin(
          this.form.value.name,
          this.form.value.password
        );

      }

    } else {
      this.isCode = false;
    }

    this.form.reset();
    this.flag = false;

  }

}
