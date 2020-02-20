import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

//Datepicker 
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-ad-create',
  templateUrl: './ad-create.component.html',
  styleUrls: ['./ad-create.component.css'],
  //Datepicker
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class AdCreateComponent implements OnInit {
  //note: Note;
  advertisement: '';
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private advertisementId: string;

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        //asyncValidators: [mimeType]
      }),
      OpeningTime: new FormControl(moment()),
      ClosingTime: new FormControl(moment()),
      screenid: new FormControl(null, {
        validators: [Validators.required]
      }),
      OpeningHours: new FormControl(),
      ClosingHours: new FormControl()
    });
  }

  onSaveNote() {
    if (this.form.invalid) {
      return;
    }
    //this.isLoading = true;
    //if (this.mode === "create") {
    //this.notesService.addNote(
    this.form.value.title,
      this.form.value.content,
      this.form.value.image,
      this.form.value.OpeningTime,
      this.form.value.ClosingTime,
      this.form.value.screenid;
    this.form.value.OpeningHours;
    this.form.value.ClosingHours;
    //);
    /*} else {
      this.notesService.updateNote(
        this.noteId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }*/
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

}
