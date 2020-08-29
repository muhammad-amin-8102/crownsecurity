import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AuthenticationService } from './_services';
import { RoleService } from './_services/role.service';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CrownSecurity';
	currentUser: User;
  pageTitle = '';

  constructor(
    private authenticationService: AuthenticationService,
    private sharedService: SharedService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.sharedService.getAllData();
  }

  get isAdmin() {
    return true;
    // return this.currentUser && this.currentUser.role === Role.Admin;
  }

  get isLoggedin() {
    return this.currentUser;
  }
}
