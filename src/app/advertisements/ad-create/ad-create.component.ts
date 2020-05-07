import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { AdvertisementsService } from "../advertisements.service";
import { Advertisement } from "../advertisement.model";

import { Admin } from "../../admins/admin.model"
import { AdminsService } from "../../admins/admins.service";

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
  private advertisementId: string;

  admins: Admin[] = [];

  constructor(
    public advertisementsService: AdvertisementsService,
    public route: ActivatedRoute,
    private adminsService: AdminsService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required]
      }),
      openingHours: new FormControl(),
      closingHours: new FormControl(),
      location: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      admindBy: new FormControl()
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("advertisementId")) {
        this.mode = "edit";
        this.advertisementId = paramMap.get("advertisementId");
        this.isLoading = true;
        this.advertisementsService.getAdvertisement(this.advertisementId).subscribe(noteData => {
          this.isLoading = false;
          this.advertisement = {
            id: noteData._id,
            title: noteData.title,
            content: noteData.content,
            imagePath: noteData.imagePath,
            openingHours: noteData.openingHours,
            closingHours: noteData.closingHours,
            location: noteData.location,
            admindBy: noteData.admindBy.name
          };
          this.form.setValue({
            title: this.advertisement.title,
            content: this.advertisement.content,
            image: this.advertisement.imagePath,
            openingHours: this.advertisement.openingHours,
            closingHours: this.advertisement.closingHours,
            location: this.advertisement.location,
            admindBy: this.advertisement.admindBy

          });
        });
      } else {
        this.mode = "create";
        this.advertisementId = null;
      }
    });

    this.adminsService.listofAdmins().subscribe(data => {
      this.admins = data.admins;
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
      this.advertisementsService.addAdvertisement(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.openingHours,
        this.form.value.closingHours,
        this.form.value.location,
        this.form.value.admindBy
      );
    } else {
      this.advertisementsService.updateAdvertisement(
        this.advertisementId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.openingHours,
        this.form.value.closingHours,
        this.form.value.location,
        this.form.value.admindBy
      );
    }
    this.form.reset();
  }
}
