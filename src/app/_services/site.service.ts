import { Injectable } from '@angular/core';
import { User } from '@app/_models';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Site } from '@app/_models/site';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Site[]>(`${environment.apiUrl}/sites`);
    }

    getById(id: number) {
        return this.http.get<Site>(`${environment.apiUrl}/sites/${id}`);
    }
}
