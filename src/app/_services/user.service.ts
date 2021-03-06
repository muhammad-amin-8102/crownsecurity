import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
		}
		
	getByRole(roleId: number) {
		return this.http.get(`${environment.apiUrl}/users/role/${roleId}`);
	}

	getCrossOtByUserId(params: any) {
		return this.http.post(`${environment.apiUrl}/users/check-cross-ot`, params);
	}

	create(params: any) {
        return this.http.post(`${environment.apiUrl}/users`, params);
    }

    update(params: any) {
        return this.http.put(`${environment.apiUrl}/users`, params);
    }

    delete(params: any) {
        return this.http.post(`${environment.apiUrl}/users/delete`, params);
    }
}