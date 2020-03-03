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

  notes: Advertisement[] = [];
  isLoading = false;
  totalNotes = 0;
  notesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private notesSub: Subscription;

  constructor(public notesService: AdvertisementsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.notesService.getNotes(this.notesPerPage, this.currentPage);
    this.notesSub = this.notesService
      .getNoteUpdateListener()
      .subscribe((noteData: { notes: Advertisement[], noteCount: number }) => {
        this.isLoading = false;
        this.totalNotes = noteData.noteCount;
        this.notes = noteData.notes;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.notesPerPage = pageData.pageSize;
    this.notesService.getNotes(this.notesPerPage, this.currentPage);
  }

  onDelete(noteId: string) {
    this.isLoading = true;
    this.notesService.deleteNote(noteId).subscribe(() => {
      this.notesService.getNotes(this.notesPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.notesSub.unsubscribe();
  }
}
