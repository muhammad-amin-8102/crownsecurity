import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserRole } from '../_models';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class RoleService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<UserRole[]>(`${environment.apiUrl}/roles`);
    }

    getById(id: number) {
        return this.http.get<UserRole>(`${environment.apiUrl}/roles/${id}`);
    }
}