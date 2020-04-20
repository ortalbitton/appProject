import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map, count } from "rxjs/operators";
import { Router } from "@angular/router";

import { Advertisement } from "./advertisement.model";

@Injectable({ providedIn: "root" })
export class AdvertisementsService {
  private advertisements: Advertisement[] = [];
  private notesUpdated = new Subject<{ advertisements: Advertisement[]; locations: Advertisement[]; noteCount: number }>();

  private locations: Advertisement[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  getNotes(notesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${notesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; notes: any; locations: any, maxNotes: number }>(
        "http://localhost:3000/api/notes" + queryParams
      )
      .pipe(
        map(noteData => {
          return {
            notes: noteData.notes.map(note => {
              return {
                title: note.title,
                content: note.content,
                id: note._id,
                imagePath: note.imagePath,
                openingHours: note.openingHours,
                closingHours: note.closingHours,
                location: note.location,
                admindBy: note.admindBy
              };
            }),
            locations: noteData.locations.map(note => {
              return {
                city: note._id,
                count: note.count
              };
            }),
            maxNotes: noteData.maxNotes
          };
        })
      )
      .subscribe(transformedNoteData => {
        this.advertisements = transformedNoteData.notes;
        this.locations = transformedNoteData.locations;
        this.notesUpdated.next({
          advertisements: [...this.advertisements],
          locations: [...this.locations],
          noteCount: transformedNoteData.maxNotes
        });
      });
  }

  getNoteUpdateListener() {
    return this.notesUpdated.asObservable();
  }

  getNote(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      openingHours: string;
      closingHours: string;
      location: string;
    }>("http://localhost:3000/api/notes/" + id);
  }

  addNote(title: string, content: string, image: File, openingHours: string, closingHours: string, location: string, admindBy: string) {
    const noteData = new FormData();
    noteData.append("title", title);
    noteData.append("content", content);
    noteData.append("image", image, title);
    noteData.append("openingHours", openingHours);
    noteData.append("closingHours", closingHours);
    noteData.append("location", location);
    noteData.append("admindBy", admindBy);
    this.http
      .post<{ message: string; advertisement: Advertisement; }>(
        "http://localhost:3000/api/notes",
        noteData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateNote(id: string, title: string, content: string, image: File | string, openingHours: string, closingHours: string, location: string) {
    let noteData: Advertisement | FormData;
    if (typeof image === "object") {
      noteData = new FormData();
      noteData.append("id", id);
      noteData.append("title", title);
      noteData.append("content", content);
      noteData.append("image", image, title);
      noteData.append("openingHours", openingHours);
      noteData.append("closingHours", closingHours);
      noteData.append("location", location);
    } else {
      noteData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        openingHours: openingHours,
        closingHours: closingHours,
        location: location,
        admindBy: null
      };
    }
    this.http
      .put("http://localhost:3000/api/notes/" + id, noteData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteNote(advertisementId: string) {
    return this.http
      .delete("http://localhost:3000/api/notes/" + advertisementId);
  }

}
