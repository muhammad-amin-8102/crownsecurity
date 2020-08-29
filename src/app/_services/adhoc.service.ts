import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AdhocType, AdhocNewUser } from '@app/_models/adhoc';

@Injectable({ providedIn: 'root' })
export class AdhocService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<AdhocType[]>(`${environment.apiUrl}/adhoc`);
    }

    getAllAdhocNewUsers() {
        return this.http.get<AdhocNewUser[]>(`${environment.apiUrl}/adhoc-new-users`);
    }

    getById(id: number) {
        return this.http.get<AdhocType>(`${environment.apiUrl}/adhoc/${id}`);
    }

    createUser(params: any) {
        return this.http.post(`${environment.apiUrl}/adhoc-new-users`, params);
    }

    updateUser(params: any) {
        return this.http.put(`${environment.apiUrl}/adhoc-new-users`, params);
    }

    deleteUser(params: any) {
        return this.http.post(`${environment.apiUrl}/adhoc-new-users/delete`, params);
    }
}