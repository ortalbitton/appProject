import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map, count } from "rxjs/operators";
import { Router } from "@angular/router";

import { Advertisement } from "./advertisement.model";

import { Admin } from "./admin.model";

@Injectable({ providedIn: "root" })
export class AdvertisementsService {
  private advertisements: Advertisement[] = [];
  private notesUpdated = new Subject<{ advertisements: Advertisement[]; locations: Advertisement[]; noteCount: number }>();

  private locations: Advertisement[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  getNotes(notesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${notesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; advertisements: any; locations: any, maxNotes: number }>(
        "http://localhost:3000/api/advertisements" + queryParams
      )
      .pipe(
        map(noteData => {
          return {
            advertisements: noteData.advertisements.map(note => {
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
        this.advertisements = transformedNoteData.advertisements;
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
      admindBy: Admin;
    }>("http://localhost:3000/api/advertisements/" + id);
  }

  addNote(title: string, content: string, image: File, openingHours: string, closingHours: string, location: string, admindBy: string) {
    const advertisementData = new FormData();
    advertisementData.append("title", title);
    advertisementData.append("content", content);
    advertisementData.append("image", image, title);
    advertisementData.append("openingHours", openingHours);
    advertisementData.append("closingHours", closingHours);
    advertisementData.append("location", location);
    advertisementData.append("admindBy", admindBy);
    this.http
      .post<{ message: string; advertisement: Advertisement; }>(
        "http://localhost:3000/api/advertisements",
        advertisementData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateNote(id: string, title: string, content: string, image: File | string, openingHours: string, closingHours: string, location: string, admindBy: string) {
    let advertisementData: Advertisement | FormData;
    if (typeof image === "object") {
      advertisementData = new FormData();
      advertisementData.append("id", id);
      advertisementData.append("title", title);
      advertisementData.append("content", content);
      advertisementData.append("image", image, title);
      advertisementData.append("openingHours", openingHours);
      advertisementData.append("closingHours", closingHours);
      advertisementData.append("location", location);
      advertisementData.append("admindBy", admindBy);
    } else {
      advertisementData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        openingHours: openingHours,
        closingHours: closingHours,
        location: location,
        admindBy: admindBy
      };
    }
    this.http
      .put("http://localhost:3000/api/advertisements/" + id, advertisementData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteNote(advertisementId: string, admindIn: string) {
    return this.http
      .delete("http://localhost:3000/api/advertisements/" + advertisementId + "/" + admindIn);
  }

}
