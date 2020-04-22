import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Advertisement } from "../advertisement.model";
import { AdvertisementsService } from "../advertisements.service";

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

  constructor(public notesService: AdvertisementsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.isSearch = true;
    this.notesService.getNotes(this.notesPerPage, this.currentPage);
    this.notesSub = this.notesService
      .getNoteUpdateListener()
      .subscribe((noteData: { advertisements: Advertisement[], locations: Advertisement[], noteCount: number }) => {
        this.isLoading = false;
        this.totalNotes = noteData.noteCount;
        this.filteradvertisements = noteData.advertisements;
        this.locations = noteData.locations;
        this.advertisements = noteData.advertisements;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.notesPerPage = pageData.pageSize;
    this.notesService.getNotes(this.notesPerPage, this.currentPage);
    this.searchCity = "";
  }

  onDelete(noteId: string, admindIn: string) {
    this.isLoading = true;
    this.notesService.deleteNote(noteId, admindIn).subscribe(() => {
      this.notesService.getNotes(this.notesPerPage, this.currentPage);
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
    this.notesService.getNotes(this.notesPerPage, this.currentPage);
  }

  onSearchByCity(searchCity: string) {
    return this.filteradvertisements.filter(advertisement =>
      advertisement.location.toLowerCase().indexOf(searchCity.toLowerCase()) !== -1);
  }

  ngOnDestroy() {
    this.notesSub.unsubscribe();
  }
}
