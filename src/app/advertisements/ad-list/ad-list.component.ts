import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Advertisement } from "../advertisement.model";
import { AdvertisementsService } from "../advertisements.service";

import { Admin } from "../admin.model"
import { AdminsService } from "../admins.service"

import { UsersService } from "../../users/users.service"


@Component({
  selector: "app-ad-list",
  templateUrl: "./ad-list.component.html",
  styleUrls: ["./ad-list.component.css"]
})
export class AdListComponent implements OnInit, OnDestroy {

  advertisements: Advertisement[] = [];
  filteradvertisements: Advertisement[] = [];
  locations: Advertisement[] = [];
  isLoading = false;
  totalNotes = 0;
  notesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private notesSub: Subscription;
  isSearch = false;

  searchTitle: string;
  searchOpeningHours: string;
  searchClosingHours: string;


  private _searchCity: string;
  get searchCity(): string {
    return this._searchCity;
  }
  set searchCity(value: string) {
    this._searchCity = value;
    this.advertisements = this.onSearchByCity(value);
    if (this.advertisements.length == 0) this.isSearch = false;
  }

  form: FormGroup;

  admins: Admin[] = [];
  isAdmin = false;

  username;

  constructor(public notesService: AdvertisementsService, private adminsService: AdminsService, private usersService: UsersService) { }

  ngOnInit() {
    this.isLoading = true;
    this.isSearch = true;
    this.notesService.getAdvertisements(this.notesPerPage, this.currentPage);
    this.notesSub = this.notesService
      .getAdvertisementUpdateListener()
      .subscribe((noteData: { advertisements: Advertisement[], locations: Advertisement[], noteCount: number }) => {
        this.isLoading = false;
        this.totalNotes = noteData.noteCount;
        this.filteradvertisements = noteData.advertisements;
        this.locations = noteData.locations;
        this.advertisements = noteData.advertisements;
      });

    //form create admin
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    //name of user from login
    this.username = this.usersService.getUsername();

    //list of admin
    this.adminsService.listofAdmins().subscribe(data => {
      this.admins = data.admins;
      for (var i = 0; i < this.admins.length; i++) {
        if (this.admins[i].name == this.username.name)
          this.isAdmin = true;
      }
    });

  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.notesPerPage = pageData.pageSize;
    this.notesService.getAdvertisements(this.notesPerPage, this.currentPage);
    this.searchCity = "";
  }

  onDelete(noteId: string) {
    this.isLoading = true;
    this.notesService.deleteAdvertisement(noteId).subscribe(() => {
      this.notesService.getAdvertisements(this.notesPerPage, this.currentPage);
    });
  }

  onSearchBy3parameters(searchTitle: string, searchOpeningHours: string, searchClosingHours: string) {
    this.advertisements = this.filteradvertisements.filter(advertisement =>
      advertisement.title.toLowerCase().indexOf(searchTitle.toLowerCase()) !== -1 && advertisement.openingHours.toLowerCase().indexOf(searchOpeningHours.toLowerCase()) !== -1 && advertisement.closingHours.toLowerCase().indexOf(searchClosingHours.toLowerCase()) !== -1);
    if (this.advertisements.length == 0) this.isSearch = false;
  }

  OnClean() {
    this.searchTitle = "";
    this.searchOpeningHours = "";
    this.searchClosingHours = "";
    this.notesService.getAdvertisements(this.notesPerPage, this.currentPage);
  }

  onSearchByCity(searchCity: string) {
    return this.filteradvertisements.filter(advertisement =>
      advertisement.location.toLowerCase().indexOf(searchCity.toLowerCase()) !== -1);
  }

  onSaveAdmin() {
    if (this.form.invalid) {
      return;
    }

    this.adminsService.addAdmin(
      this.form.value.name
    )
  }

  ngOnDestroy() {
    this.notesSub.unsubscribe();
  }
}
