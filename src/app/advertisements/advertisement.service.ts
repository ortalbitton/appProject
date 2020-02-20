import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Advertisement } from "./advertisement.model";

@Injectable({ providedIn: "root" })
export class AdvertisementService {
  private advertisements: Advertisement[] = [];
  private advertisementsUpdated = new Subject<{ advertisements: Advertisement[]; noteCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getAdvertisements(advertisementsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${advertisementsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; advertisements: any; maxAdvertisements: number }>(
        "http://localhost:3000/api/advertisements" + queryParams
      )
      .pipe(
        map(advertisementData => {
          return {
            advertisements: advertisementData.advertisements.map(note => {
              return {
                title: note.title,
                content: note.content,
                id: note._id,
                imagePath: note.imagePath,
                OpeningTime: note.OpeningTime,
                ClosingTime: note.ClosingTime,
                screenid: note.screenid,
                OpeningHours: note.OpeningHours,
                ClosingHours: note.ClosingHours
              };
            }),
            maxAdvertisements: advertisementData.maxAdvertisements
          };
        })
      )
      .subscribe(transformedNoteData => {
        this.advertisements = transformedNoteData.advertisements;
        this.advertisementsUpdated.next({
          advertisements: [...this.advertisements],
          noteCount: transformedNoteData.maxAdvertisements
        });
      });
  }

  getAdvertisementUpdateListener() {
    return this.advertisementsUpdated.asObservable();
  }

  getAdvertisement(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      OpeningTime: string;
      ClosingTime: string;
      screenid: string;
      OpeningHours: string;
      ClosingHours: string;
    }>("http://localhost:3000/api/notes/" + id);
  }

  addAdvertisement(title: string, content: string, image: File, OpeningTime: string, ClosingTime: string, screenid: string, OpeningHours: string, ClosingHours: string) {
    const noteData = new FormData();
    noteData.append("title", title);
    noteData.append("content", content);
    noteData.append("image", image, title);
    noteData.append("OpeningTime", OpeningTime);
    noteData.append("ClosingTime", ClosingTime);
    noteData.append("screenid", screenid);
    noteData.append("OpeningHours", OpeningHours);
    noteData.append("ClosingHours", ClosingHours);
    this.http
      .post<{ message: string; note: Advertisement }>(
        "http://localhost:3000/api/notes",
        noteData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateAdvertisement(id: string, title: string, content: string, image: File | string, OpeningTime: string, ClosingTime: string, screenid: string, OpeningHours: string, ClosingHours: string) {
    let noteData: Advertisement | FormData;
    if (typeof image === "object") {
      noteData = new FormData();
      noteData.append("id", id);
      noteData.append("title", title);
      noteData.append("content", content);
      noteData.append("image", image, title);
      noteData.append("OpeningTime", OpeningTime);
      noteData.append("ClosingTime", ClosingTime);
      noteData.append("screenid", screenid);
      noteData.append("OpeningHours", OpeningHours);
      noteData.append("ClosingHours", ClosingHours);
    } else {
      noteData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        OpeningTime: OpeningTime,
        ClosingTime: ClosingTime,
        screenid: screenid,
        OpeningHours: OpeningHours,
        ClosingHours: ClosingHours
      };
    }
    this.http
      .put("http://localhost:3000/api/notes/" + id, noteData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteAdvertisement(noteId: string) {
    return this.http
      .delete("http://localhost:3000/api/notes/" + noteId);
  }
}
