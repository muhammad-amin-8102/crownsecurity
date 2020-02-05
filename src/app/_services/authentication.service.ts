import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../_models';
import { environment } from '@environments/environment';
import * as CryptoJS from 'crypto-js';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;

	constructor(private http: HttpClient) {
		this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}

	login(username: string, password: string) {
		return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { email: username, password })
			.pipe(map(user => {
				// login successful if there's a jwt token in the response
				if (user && user.token) {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					localStorage.setItem('currentUser', JSON.stringify(user));
					this.currentUserSubject.next(user);
				}

				return user;
			}));
	}

	logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);
	}

	encryptData(data) {
		try {
			return CryptoJS.AES.encrypt(JSON.stringify(data), environment.noChance).toString();
		} catch (e) {
			console.log(e);
		}
	}

	decryptData(data) {
		try {
			const bytes = CryptoJS.AES.decrypt(data, environment.noChance);
			if (bytes.toString()) {
				return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
			}
			return data;
		} catch (e) {
			console.log(e);
		}
	}
}