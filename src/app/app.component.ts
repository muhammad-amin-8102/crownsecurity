import { Component } from '@angular/core';
import { User } from './_models/user';
import { AuthenticationService } from './_services';
import { Role } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CrownSecurity';
	currentUser: User;
	pageTitle = '';

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  get isLoggedin() {
    return this.currentUser;
  }
}
