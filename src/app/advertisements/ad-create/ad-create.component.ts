import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { AdvertisementsService } from "../advertisements.service";
import { Advertisement } from "../advertisement.model";

@Component({
  selector: "app-ad-create",
  templateUrl: "./ad-create.component.html",
  styleUrls: ["./ad-create.component.css"]
})
export class AdCreateComponent implements OnInit {
  advertisement: Advertisement;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private noteId: string;

  constructor(
    public notesService: AdvertisementsService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("noteId")) {
        this.mode = "edit";
        this.noteId = paramMap.get("noteId");
        this.isLoading = true;
        this.notesService.getNote(this.noteId).subscribe(noteData => {
          this.isLoading = false;
          this.advertisement = {
            id: noteData._id,
            title: noteData.title,
            content: noteData.content,
            imagePath: noteData.imagePath
          };
          this.form.setValue({
            title: this.advertisement.title,
            content: this.advertisement.content,
            image: this.advertisement.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.noteId = null;
      }
    });
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

  onSaveNote() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.notesService.addNote(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.notesService.updateNote(
        this.noteId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
