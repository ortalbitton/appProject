import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class MapReduceService {

    constructor(private http: HttpClient, private router: Router) { }

    listofTitles() {
        return this.http
            .get<{ message: string; titles: any, maxTitles: number }>(
                "http://localhost:3000/api/mapReduce")
    }
}